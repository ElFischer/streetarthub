"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import * as z from "zod"

import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/models/Posts"
import type { Post } from "@/lib/models/Posts"

import { updatePost, deletePostWithImages } from "@/lib/firebasePost"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { uploadFile } from "@/lib/firebaseStore"
import { ImageUploader, type UploaderItem } from "@/components/ui/image-uploader"

interface EditorProps {
    post: Pick<Post, "id" | "title" | "content" | "approved" | "date" | "artist" | "category" | "description" | "source" | "cover" | "location"> & {
        author?: {
            id: string;
            name: string;
            avatar: string;
        }
    }
    isDraft?: boolean
}

type FormData = z.infer<typeof postPatchSchema>

// Function to create default blocks for new posts
function getDefaultBlocks(post: EditorProps['post'], isDraft: boolean = false) {
    // Check if this is a new post (no existing content) or an existing post
    const isNewPost = !post.content || (post.content?.blocks && post.content.blocks.length === 0) || isDraft;
    
    if (isNewPost) {
        // For new posts, start without cover block (handled by custom uploader)
        return {
            time: Date.now(),
            blocks: [],
            version: "2.28.2"
        };
    } else {
        // For existing posts, include all blocks with existing data
        return {
            time: Date.now(),
            blocks: [
                ...(post.artist && post.artist.length > 0 ? [{
                    id: "artistBlock",
                    type: "artistBlock",
                    data: {
                        artists: post.artist
                    }
                }] : []),
                ...(post.category && post.category.length > 0 ? [{
                    id: "categoryBlock", 
                    type: "categoryBlock",
                    data: {
                        categories: post.category
                    }
                }] : []),
                ...((post.description && post.description.length > 0) || (post.source && post.source.length > 0) ? [{
                    id: "metadataBlock",
                    type: "metadataBlock", 
                    data: {
                        description: post.description || '',
                        source: post.source || ''
                    }
                }] : []),
                ...(post.location && (post.location.country?.long_name || post.location.locality?.long_name || post.location.geoData?.lat) ? [{
                    id: "locationBlock",
                    type: "locationBlock",
                    data: post.location
                }] : [])
            ],
            version: "2.28.2"
        };
    }
}

// Function to extract metadata from editor blocks
function extractMetadataFromBlocks(blocks: any[]) {
    const result: any = {
        artist: [],
        category: [],
        description: '',
        source: '',
        location: null,
        cover: []
    }

    blocks.forEach(block => {
        switch (block.type) {
            case 'artistBlock':
                if (block.data?.artists) {
                    result.artist = block.data.artists
                }
                break
            case 'categoryBlock':
                if (block.data?.categories) {
                    result.category = block.data.categories
                }
                break
            case 'metadataBlock':
                if (block.data?.description) {
                    result.description = block.data.description
                }
                if (block.data?.source) {
                    result.source = block.data.source
                }
                break
            case 'locationBlock':
                if (block.data) {
                    result.location = block.data
                }
                break
        }
    })

    return result
}

export function Editor({ post, isDraft = false }: EditorProps) {
    const { register, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(postPatchSchema),
        defaultValues: {
            title: post.title || ""
        }
    })
    const ref = React.useRef<EditorJS>()
    const router = useRouter()
    const [isSaving, setIsSaving] = React.useState<boolean>(false)
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false)
    const [isMounted, setIsMounted] = React.useState<boolean>(false)
    const [coverItems, setCoverItems] = React.useState<UploaderItem[]>([])


    const initializeEditor = React.useCallback(async () => {
        // Suppress EditorJS passive event listener warnings during initialization
        const originalWarn = console.warn;
        console.warn = (...args) => {
            const message = args[0];
            if (typeof message === 'string' && message.includes('passive event listener')) {
                return; // Suppress passive event listener warnings
            }
            originalWarn.apply(console, args);
        };

        const EditorJS = (await import("@editorjs/editorjs")).default
        const Header = (await import("@editorjs/header")).default
        const Embed = (await import("@editorjs/embed")).default
        const List = (await import("@editorjs/list")).default
        const LinkTool = (await import("@editorjs/link")).default
        const InlineCode = (await import("@editorjs/inline-code")).default
        const ImageTool = (await import('@editorjs/image')).default
        
        // Import our custom blocks
        const ArtistBlock = (await import("@/components/editor/blocks/ArtistBlock")).default
        const CategoryBlock = (await import("@/components/editor/blocks/CategoryBlock")).default
        const MetadataBlock = (await import("@/components/editor/blocks/MetadataBlock")).default
        const LocationBlock = (await import("@/components/editor/blocks/LocationBlock")).default

        // Parse post data safely for EditorJS initialization
        const body = {
            title: post.title || "",
            content: post.content,
            artist: post.artist || [],
            category: post.category || [],
            description: post.description || "",
            source: post.source || "",
            cover: post.cover || [],
            location: post.location
        }

        // Function to check if a block type already exists in the editor data
        const hasBlockType = (blockType: string, editorData: any) => {
            if (!editorData?.blocks) return false;
            return editorData.blocks.some((block: any) => block.type === blockType);
        }

        const editorData = body.content || getDefaultBlocks(post, isDraft);

        // Create dynamic tools configuration - custom blocks first
        const availableTools: any = {
            // Custom metadata blocks first (single-use)
            artistBlock: {
                class: ArtistBlock,
                config: {
                    placeholder: 'Search and add artists...'
                }
            },
            categoryBlock: {
                class: CategoryBlock,
                config: {
                    placeholder: 'Search and add categories...'
                }
            },
            locationBlock: {
                class: LocationBlock,
                config: {
                    enableGeolocation: true
                }
            },
            metadataBlock: {
                class: MetadataBlock,
                config: {
                    descriptionPlaceholder: 'Describe the artwork, location, or context...',
                    sourcePlaceholder: 'https://example.com/artwork-source'
                }
            },
            // Standard EditorJS blocks
            header: Header,
            image: {
                class: ImageTool,
                config: {
                    uploader: {
                        async uploadByFile(file: File) {
                            const postId = post.id || 'temp';
                            const isCurrentDraft = postId.startsWith('draft-') || isDraft;
                            
                            if (isCurrentDraft) {
                                // For drafts, return Base64 data temporarily
                                return new Promise((resolve) => {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const base64Data = e.target?.result as string;
                                        resolve({
                                            success: 1,
                                            file: {
                                                url: base64Data,
                                                // Store original file data for later upload
                                                originalFile: file,
                                                isDraft: true
                                            },
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                });
                            } else {
                                // For existing posts, upload immediately to Firebase
                                const date = new Date();
                                const res = await uploadFile(file, `art/${post.id}_${date.getTime()}`)
                                return {
                                    success: 1,
                                    file: {
                                        url: res,
                                    },
                                }
                            }
                        },
                    },
                },
            },
            linkTool: {
                class: LinkTool,
                config: {
                    endpoint: '/api/link',
                },
            },
            list: List,
            inlineCode: InlineCode,
            embed: {
                class: Embed,
                config: {
                    services: {
                        youtube: true,
                        instagram: true,
                        twitter: true,
                        vimeo: true,
                        pinterest: true,
                        facebook: true
                    }
                }
            },
        };

        // Function to update toolbox visibility for single-use blocks
        const updateToolboxVisibility = (editor: any) => {
            try {
                const allBlocks = editor.blocks.getBlocksCount();
                const existingBlockTypes: string[] = [];
                
                // Get all existing block types
                for (let i = 0; i < allBlocks; i++) {
                    try {
                        const block = editor.blocks.getBlockByIndex(i);
                        if (block && block.name) {
                            existingBlockTypes.push(block.name);
                        }
                    } catch (e) {
                        // Ignore errors when getting block
                    }
                }
                
                // Define single-use blocks and their button selectors
                const singleUseBlocks = [
                    { type: 'artistBlock', selector: '[data-item-name="artistBlock"]' },
                    { type: 'categoryBlock', selector: '[data-item-name="categoryBlock"]' },
                    { type: 'metadataBlock', selector: '[data-item-name="metadataBlock"]' },
                    { type: 'locationBlock', selector: '[data-item-name="locationBlock"]' }
                ];
                
                singleUseBlocks.forEach(({ type, selector }) => {
                    const toolButton = document.querySelector(selector) as HTMLElement;
                    const isExisting = existingBlockTypes.includes(type);
                    
                    if (toolButton) {
                        if (isExisting) {
                            toolButton.style.display = 'none';
                            toolButton.style.pointerEvents = 'none';
                        } else {
                            toolButton.style.display = 'flex';
                            toolButton.style.pointerEvents = 'auto';
                        }
                    }
                });
                
            } catch (error) {
                console.debug('Error updating toolbox visibility:', error);
            }
        };

        if (!ref.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    ref.current = editor
                    
                    // Restore original console.warn after EditorJS is ready
                    console.warn = originalWarn;
                    
                    // Initial toolbox update after a small delay
                    setTimeout(() => {
                        updateToolboxVisibility(editor);
                    }, 500);
                },
                onChange: async (api: any, event: any) => {
                    // Update toolbox when blocks change
                    setTimeout(() => {
                        updateToolboxVisibility(api);
                    }, 100);
                    
                    // Prevent automatic paragraph creation after custom blocks
                    setTimeout(() => {
                        const allBlocks = api.blocks.getBlocksCount();
                        const customBlockTypes = ['artistBlock', 'categoryBlock', 'metadataBlock', 'locationBlock'];
                        
                        for (let i = 0; i < allBlocks - 1; i++) {
                            try {
                                const currentBlock = api.blocks.getBlockByIndex(i);
                                const nextBlock = api.blocks.getBlockByIndex(i + 1);
                                
                                if (currentBlock && nextBlock && 
                                    customBlockTypes.includes(currentBlock.name) && 
                                    nextBlock.name === 'paragraph') {
                                    
                                    const nextBlockData = nextBlock.save();
                                    if (nextBlockData && (!nextBlockData.text || nextBlockData.text.trim() === '')) {
                                        api.blocks.delete(i + 1);
                                        break; // Only remove one at a time to avoid index issues
                                    }
                                }
                            } catch (e) {
                                // Ignore errors
                            }
                        }
                    }, 150);
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: editorData,
                tools: availableTools,
                defaultBlock: 'paragraph',
                minHeight: 0,
                // Disable automatic block insertion after certain operations
                readOnly: false
            })
        }
    }, [post, isDraft])

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true)
        }
    }, [])

    React.useEffect(() => {
        if (isMounted) {
            initializeEditor()

            return () => {
                if (ref.current) {
                    try {
                        ref.current.destroy()
                    } catch (error) {
                        // Ignore errors during cleanup
                        console.debug('EditorJS cleanup error:', error)
                    }
                    ref.current = undefined
                }
            }
        }
    }, [isMounted, initializeEditor])

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const editorData = await ref.current?.save()

        // Extract metadata from editor blocks (without cover)
        const extractedData = extractMetadataFromBlocks(editorData?.blocks || [])
        
        // Validate required title
        if (!data.title || data.title.trim().length === 0) {
            setIsSaving(false)
            return toast({
                title: "Title is required",
                description: "Please enter a title for your post.",
                variant: "destructive",
            })
        }
        
        // Require at least one cover image from the uploader
        if (!coverItems || coverItems.length === 0) {
            setIsSaving(false)
            return toast({
                title: "Cover image is required",
                description: "Please upload at least one cover image.",
                variant: "destructive",
            })
        }
        
        const mediaFilenames: string[] = []
        const finalCover: { url: string; width?: number; height?: number }[] = []
        
        try {
            if (isDraft) {
                // Upload cover images now (deferred until save) using a tempId
                const tempId = `post-${Date.now()}`
                for (let i = 0; i < coverItems.length; i++) {
                    const item = coverItems[i]
                    if (item.file) {
                        const filename = `${tempId}_${Date.now()}_${i}`
                        const url = await uploadFile(item.file, `art/${filename}`)
                        if (url) {
                            const obj: any = { url: url as string }
                            if (typeof item.width === 'number') obj.width = item.width
                            if (typeof item.height === 'number') obj.height = item.height
                            finalCover.push(obj)
                            mediaFilenames.push(filename)
                        }
                    } else if (item.url) {
                        const obj: any = { url: item.url }
                        if (typeof item.width === 'number') obj.width = item.width
                        if (typeof item.height === 'number') obj.height = item.height
                        finalCover.push(obj)
                        // Also try to extract filename from existing URL if it's a Firebase art URL
                        if (item.url.includes('art/') || item.url.includes('art%2F')) {
                            const match = item.url.match(/art%2F([^?&]+)/)
                            if (match && match[1]) mediaFilenames.push(decodeURIComponent(match[1]))
                        }
                    }
                }
                
                // Upload any draft images from ImageTool blocks
                if (editorData?.blocks) {
                    for (const block of editorData.blocks) {
                        if (block.type === 'image' && block.data?.file?.isDraft && block.data.file.originalFile) {
                            const filename = `${tempId}_${Date.now()}`
                            const url = await uploadFile(block.data.file.originalFile, `art/${filename}`)
                            if (url) {
                                mediaFilenames.push(filename)
                                block.data.file = { url: url as string }
                            }
                        }
                    }
                }
            } else {
                // Existing post: upload only new cover files; keep existing cover URLs
                const baseId = post.id
                for (let i = 0; i < coverItems.length; i++) {
                    const item = coverItems[i]
                    if (item.file) {
                        const filename = `${baseId}_${Date.now()}_${i}`
                        const url = await uploadFile(item.file, `art/${filename}`)
                        if (url) {
                            const obj: any = { url: url as string }
                            if (typeof item.width === 'number') obj.width = item.width
                            if (typeof item.height === 'number') obj.height = item.height
                            finalCover.push(obj)
                            mediaFilenames.push(filename)
                        }
                    } else if (item.url) {
                        const obj: any = { url: item.url }
                        if (typeof item.width === 'number') obj.width = item.width
                        if (typeof item.height === 'number') obj.height = item.height
                        finalCover.push(obj)
                        if (item.url.includes('art/') || item.url.includes('art%2F')) {
                            const match = item.url.match(/art%2F([^?&]+)/)
                            if (match && match[1]) mediaFilenames.push(decodeURIComponent(match[1]))
                        }
                    }
                }
            }
        } catch (uploadError) {
            setIsSaving(false)
            return toast({
                title: "Upload failed",
                description: "Failed to upload images. Please try again.",
                variant: "destructive",
            })
        }

        // Then add other image block filenames (already-uploaded in non-drafts)
        if (editorData?.blocks) {
            editorData.blocks.forEach((block: any) => {
                if (block.type === 'image' && block.data?.file?.url) {
                    const url = block.data.file.url
                    if (url && (url.includes('art/') || url.includes('art%2F'))) {
                        const match = url.match(/art%2F([^?&]+)/)
                        if (match && match[1]) {
                            const decodedFilename = decodeURIComponent(match[1])
                            mediaFilenames.push(decodedFilename)
                        }
                    }
                }
            })
        }

        // Delete images that are no longer used (only for existing posts)
        if (!isDraft && post.id) {
            try {
                // Current images = new cover URLs + current editor image URLs
                const currentImageUrls = new Set<string>()
                finalCover.forEach((c) => { if (c.url) currentImageUrls.add(c.url) })
                if (editorData?.blocks) {
                    editorData.blocks.forEach((block: any) => {
                        if (block.type === 'image' && block.data?.file?.url) {
                            currentImageUrls.add(block.data.file.url)
                        }
                    })
                }

                // Original URLs from existing post
                const originalImageUrls = new Set<string>()
                if (post.cover && Array.isArray(post.cover)) {
                    post.cover.forEach((coverItem: any) => {
                        if (coverItem.url) originalImageUrls.add(coverItem.url)
                    })
                }
                if (post.content && post.content.blocks) {
                    post.content.blocks.forEach((block: any) => {
                        if (block.type === 'image' && block.data?.file?.url) {
                            originalImageUrls.add(block.data.file.url)
                        }
                    })
                }

                const deletedImageUrls = Array.from(originalImageUrls).filter(url => !currentImageUrls.has(url))
                if (deletedImageUrls.length > 0) {
                    const { deleteFile } = await import("@/lib/firebaseStore")
                    const deletePromises = deletedImageUrls.map(url => deleteFile(url))
                    await Promise.all(deletePromises)
                    console.log(`Deleted ${deletedImageUrls.length} unused images from storage`)
                }
            } catch (error) {
                console.debug('Error deleting unused images:', error)
            }
        }

        // Remove old draft-upload path and cover validation from editor blocks (handled above)

        // Prepare the post data, combining form data and extracted block data
        const postData: any = {
            title: data.title,
            content: editorData,
            approved: false,
        }
        
        // Add media filenames if any images were found
        if (mediaFilenames.length > 0) {
            postData.media = mediaFilenames
        }
        
        // Use cover from uploader
        if (finalCover.length > 0) {
            postData.cover = finalCover
        }
        if (extractedData.artist && extractedData.artist.length > 0) {
            postData.artist = extractedData.artist
        }
        if (extractedData.category && extractedData.category.length > 0) {
            postData.category = extractedData.category
        }
        if (extractedData.description) {
            postData.description = extractedData.description
        }
        if (extractedData.source) {
            postData.source = extractedData.source
        }
        
        // Only include location if it has meaningful data
        if (extractedData.location && (
            extractedData.location.country?.long_name || 
            extractedData.location.locality?.long_name ||
            (extractedData.location.geoData?.lat && extractedData.location.geoData?.lng)
        )) {
            postData.location = extractedData.location
        }

        let response;
        
        if (isDraft) {
            // Add author information for new posts
            if (post.author) {
                postData.author = post.author
            }
            
            // Create new post
            const { setPost } = await import("@/lib/firebasePost")
            response = await setPost(postData)
            
            if (response) {
                // Navigate to the newly created post
                router.push(`/editor/${response}`)
                router.refresh()
            }
        } else {
            // Update existing post
            const { updatePost } = await import("@/lib/firebasePost")
            response = await updatePost(postData, post.id)
            
            if (response) {
                router.refresh()
            }
        }

        setIsSaving(false)

        if (!response) {
            return toast({
                title: "Something went wrong.",
                description: "Your post was not saved. Please try again.",
                variant: "destructive",
            })
        }

        return toast({
            description: isDraft ? "Your post has been created." : "Your post has been saved.",
        })
    }

    async function handleDelete() {
        setIsDeleting(true)

        if (isDraft) {
            // For draft posts, just navigate away (no Firebase deletion needed)
            setIsDeleting(false)
            router.push("/dashboard")
            return toast({
                description: "Draft discarded.",
            })
        }

        // For existing posts, delete from Firebase
        const success = await deletePostWithImages(post.id)

        setIsDeleting(false)

        if (!success) {
            return toast({
                title: "Something went wrong.",
                description: "Your post could not be deleted. Please try again.",
                variant: "destructive",
            })
        }

        router.push("/dashboard")
        router.refresh()

        return toast({
            description: "Your post has been deleted.",
        })
    }

    if (!isMounted) {
        return null
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full gap-10">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center space-x-10">
                        <Link
                            href="/dashboard"
                            className={cn(buttonVariants({ variant: "ghost" }))}
                        >
                            <>
                                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {post.approved ? "Published" : "Draft"}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(buttonVariants({ variant: "ghost" }))}
                                    disabled={isDeleting || isSaving}
                                >
                                    {isDeleting && (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <span>{isDraft ? "Discard" : "Delete"}</span>
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {isDraft 
                                            ? "This will discard your draft. You can create a new post anytime."
                                            : "This action cannot be undone. This will permanently delete your post and remove all associated images from our servers."
                                        }
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className={cn(buttonVariants({ variant: "destructive" }))}
                                    >
{isDraft ? "Discard Draft" : "Delete Post"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button type="submit" className={cn(buttonVariants())} disabled={isDeleting || isSaving}>
                            {isSaving && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>{isDraft ? "Create Post" : "Save"}</span>
                        </button>
                    </div>
                </div>
                <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
                    {/* Main title */}
                    <TextareaAutosize
                        autoFocus
                        id="title"
                        defaultValue={post.title}
                        placeholder="Post title *"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none mb-8"
                        {...register("title", { required: "Title is required" })}
                    />
                    {/* Cover uploader */}
                    <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">Cover Images *</h3>
                        <ImageUploader
                            initialItems={(post.cover as any) || []}
                            onChange={setCoverItems}
                            maxFiles={12}
                        />
                        <p className="text-xs text-muted-foreground mt-2">Mehrere Bilder möglich. Reihenfolge entspricht der Anzeige.</p>
                    </div>
                    
                    {/* EditorJS with custom metadata blocks */}
                    <div id="editor" className="min-h-[500px]" />
                    <p className="text-sm text-gray-500 mt-4">
                        Use{" "}
                        <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                            Tab
                        </kbd>{" "}
                        to open the command menu and add blocks. Each metadata block (Artists, Styles, Metadata, Location) can only be added once.
                    </p>
                </div>
            </div>
        </form>
    )
}