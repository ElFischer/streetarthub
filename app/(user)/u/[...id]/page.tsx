import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import TitleImage from "@/components/title-image"
import Feed from "@/components/feed/posts"
import { getCurrentUser } from "@/lib/session"
export const metadata = {
  title: "Profile",
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <>
      <TitleImage user={user}/>
      <Feed user={user.id} />
    </>
  )
}