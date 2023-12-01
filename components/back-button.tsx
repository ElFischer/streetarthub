'use client'

import { useRouter } from 'next/navigation'
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function AbsoluteBack() {
    const router = useRouter()

    return (
        <button type="button" onClick={() => router.back()} className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            See all posts
        </button>
    )
}

export function SimpleBack() {
    const router = useRouter()

    return (
        <button type="button" onClick={() => router.back()} className={cn(
            buttonVariants({ variant: "ghost" })
        )}>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            See all posts
        </button>
    )
}