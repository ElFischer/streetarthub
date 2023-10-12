import { AvatarProps } from "@radix-ui/react-avatar"
import { User } from "@/lib/models/User"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <AvatarImage alt={user.name} src={user.image} />
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{user.name}</span>
                    <Icons.user className="h-5 w-5" />
                </AvatarFallback>
            )}
        </Avatar>
    )
}