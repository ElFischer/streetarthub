import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/editor"
import { getPost } from "@/lib/firebasePost"

interface EditorPageProps {
    params: { postId: string }
}

async function getPostFromParams(id: string) {
    
    const post = await getPost(id)
    if (!post) {
        null
    }
    return post

}

export default async function EditorPage({ params }: EditorPageProps) {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }
    
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
                }}
            />
        </>
    )
}