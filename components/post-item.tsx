import Link from "next/link"
import type { Post } from "@/lib/models/Posts"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PostItemProps {
    post: Pick<Post, "id" | "title" | "date">
}

export function PostItem({ post }: PostItemProps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <Link
                    href={`/editor/${post.id}`}
                    className="font-semibold hover:underline"
                >
                    {post.title}
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(post.date)}
                    </p>
                </div>
            </div>
        </div>
    )
}

PostItem.Skeleton = function PostItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}