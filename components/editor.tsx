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
import { ComboboxDemo } from "./combobox"

interface EditorProps {
    post: Pick<Post, "id" | "title" | "content" | "approved" | "date">
}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({ post }: EditorProps) {
    const { register, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(postPatchSchema),
    })
    const ref = React.useRef<EditorJS>()
    const router = useRouter()
    const [isSaving, setIsSaving] = React.useState<boolean>(false)
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false)
    const [isMounted, setIsMounted] = React.useState<boolean>(false)

    const initializeEditor = React.useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default
        const Header = (await import("@editorjs/header")).default
        const Embed = (await import("@editorjs/embed")).default
        const Table = (await import("@editorjs/table")).default
        const List = (await import("@editorjs/list")).default
        const Code = (await import("@editorjs/code")).default
        const LinkTool = (await import("@editorjs/link")).default
        const InlineCode = (await import("@editorjs/inline-code")).default
        const ImageTool = (await import('@editorjs/image')).default

        const body = postPatchSchema.parse(post)

        if (!ref.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    ref.current = editor
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: body.content,
                tools: {
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    // upload to firebase storage
                                    const date = new Date();
                                    const res = await uploadFile(file, `art/${post.id}_${date.getTime()}`)
                                    return {
                                        success: 1,
                                        file: {
                                            url: res,
                                        },
                                    }
                                },
                            },
                        },
                    },
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            })
        }
    }, [post])

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true)
        }
    }, [])

    React.useEffect(() => {
        if (isMounted) {
            initializeEditor()

            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    }, [isMounted, initializeEditor])

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const blocks = await ref.current?.save()

        const response = updatePost({
            title: data.title,
            content: blocks,
        }, post.id)

        setIsSaving(false)

        if (!response) {
            return toast({
                title: "Something went wrong.",
                description: "Your post was not saved. Please try again.",
                variant: "destructive",
            })
        }

        router.refresh()

        return toast({
            description: "Your post has been saved.",
        })
    }

    async function handleDelete() {
        setIsDeleting(true)

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
                                    className={cn(buttonVariants({ variant: "destructive" }))}
                                    disabled={isDeleting || isSaving}
                                >
                                    {isDeleting && (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <span>Delete</span>
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your post
                                        and remove all associated images from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className={cn(buttonVariants({ variant: "destructive" }))}
                                    >
                                        Delete Post
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button type="submit" className={cn(buttonVariants())} disabled={isDeleting || isSaving}>
                            {isSaving && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Save</span>
                        </button>
                    </div>
                </div>
                <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
                    <TextareaAutosize
                        autoFocus
                        id="title"
                        defaultValue={post.title}
                        placeholder="Post title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                        {...register("title")}
                    />
                    {/* <ComboboxDemo /> */}
                    <div id="editor" className="min-h-[500px]" />
                    <p className="text-sm text-gray-500">
                        Use{" "}
                        <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                            Tab
                        </kbd>{" "}
                        to open the command menu.
                    </p>
                </div>
            </div>
        </form>
    )
}