import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import TitleImage from "@/components/title-image"
import Feed from "@/components/feed/posts"
import { getCurrentUser } from "@/lib/session"
import { getUser } from '@/lib/firebase/user'

export const metadata = {
  title: "Profile",
}

interface UserPageProps {
  params: {
    slug: string[]
  }
}

async function getPostFromParams(params: any) {
  const id = params?.id?.join("/")
  const post = await getUser(id)

  if (!post) {
    null
  }
  
  return post
}

export default async function ProfilePage({ params }: UserPageProps) {
  const user = await getPostFromParams(params)

  if (!user) {
    notFound()
  }

  return (
    <>
      <TitleImage user={user} />
      <div className="container">
        <Feed user={user.id} />
      </div>
    </>
  )
}