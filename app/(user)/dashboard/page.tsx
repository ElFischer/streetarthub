import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"

import { fetchPosts } from '@/lib/firebase/posts'
import type { PostsFeed } from "@/lib/models/Posts"

import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const filterField = 'author.id'
  const filterValue = user.id
  const filterOperator = '=='
  const limit = 15

  const posts = await fetchPosts({ limitValue: limit, filterField, filterValue, filterOperator })

  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton user={user} />
      </DashboardHeader>
      <div>
        {posts?.docs?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.docs.map((post: any) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" user={user} />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
