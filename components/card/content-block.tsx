import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

const Content = ({ post }: any) => {
  return (
    <div>
      <div>

        <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>
        {post.author?.id ? (
          <div className="mt-4 flex space-x-4">
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
                <p className="font-bold text-md">{post.author.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  {post.date && (
                    <time
                      dateTime={formatDate(post.date)}
                      className="block "
                    >
                      {formatDate(post.date)}
                    </time>
                  )}
                </p>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Content;