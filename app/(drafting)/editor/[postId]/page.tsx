import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/editor"
import { getPost } from "@/lib/firebasePost"

interface EditorPageProps {
    params: { postId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

async function getPostFromParams(id: string) {
    
    const post = await getPost(id)
    if (!post) {
        null
    }
    return post

}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }
    
    // Check if this is a draft post
    const isDraft = searchParams.draft === 'true'
    const isNewDraft = params.postId.startsWith('draft-')
    
    if (isDraft || isNewDraft) {
        // This is a new draft post - create default structure
        const draftPost = {
            id: params.postId,
            title: "",
            content: null,
            approved: false,
            date: Date.now(),
            artist: [],
            category: [],
            description: "",
            source: "",
            cover: [],
            location: undefined,
            author: {
                id: searchParams.userId as string || user.id,
                name: decodeURIComponent(searchParams.userName as string || user.name || ''),
                avatar: decodeURIComponent(searchParams.userAvatar as string || user.image || ''),
            }
        }
        
        return (
            <>
                <Editor
                    post={draftPost}
                    isDraft={true}
                />
            </>
        )
    }
    
    // This is an existing post - fetch from Firebase
    const post = await getPostFromParams(params.postId)
    
    if (!post) {
        notFound()
    }

    return (
        <>
            <Editor
                post={{
                    id: params.postId,
                    title: post.title,
                    content: post.content,
                    approved: false,
                    date: post.date,
                    artist: post.artist,
                    category: post.category,
                    description: post.description,
                    source: post.source,
                    cover: post.cover,
                    location: post.location,
                }}
                isDraft={false}
            />
        </>
    )
}