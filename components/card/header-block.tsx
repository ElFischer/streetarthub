import Link from "next/link"
import Image from "next/image"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "../icons";
import { defaultUser } from "@/config/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const HeaderBlock = ({ post }: any) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        {post.author?.id ? (
          <Link
            href={`/u/${post.author.id}`}
            className="flex items-center space-x-2 text-sm"
          >
            <Image
              src={post.author.avatar || "/images/streetarthub.jpg"}
              alt={post.author.name || "Avatar"}
              width={42}
              height={42}
              className="rounded-full bg-white"
            />
            <div className="flex-1 text-left leading-tight">
              <p className="text-[14px] font-bold">{post.author.name}</p>
              <p className="text-[13px] text-muted-foreground">
                {post.date && (
                  <time
                    dateTime={formatDate(post.date)}
                    className="block"
                  >
                    {formatDate(post.date)}
                  </time>
                )}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href={`/u/${defaultUser.id}`}
            className="flex items-center space-x-2 text-sm"
          >
            <Image
              src={defaultUser.image || "/images/streetarthub.jpg"}
              alt={defaultUser.name || "Avatar"}
              width={42}
              height={42}
              className="rounded-full bg-white"
            />
            <div className="flex-1 text-left leading-tight">
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-[12px] text-muted-foreground">
                {post.date && (
                  <time
                    dateTime={formatDate(post.date)}
                    className="block text-sm text-muted-foreground"
                  >
                    {formatDate(post.date)}
                  </time>
                )}
              </p>
            </div>
          </Link>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          ""
        )}>
          <Icons.moreMenu className="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[15rem] font-medium" align="end">
          <DropdownMenuItem className="justify-center">Report</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center">
            <Link href={`/art/${post.id}`} title={`Source for ${post.title}`}>Go to post</Link>
          </DropdownMenuItem>
          {post.source && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                <Link href={post.source} target="_blank" title={`Source for ${post.title}`}>Visit source</Link>
              </DropdownMenuItem>
            </>
          )}

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default HeaderBlock;