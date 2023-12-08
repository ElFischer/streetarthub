import Link from "next/link";
import Image from "next/image";

const UserBlock = (data: any) => {
    let post = data.post
    return (
        <>
            {post.author?.id ? (
                <div className="flex space-x-4">
                    <Link
                        href={`/u/${post.author.id}`}
                        className="flex items-center space-x-3"
                    >
                        <Image
                            src={post.author.avatar || "/images/streetarthub.jpg"}
                            alt={post.author.name || "Avatar"}
                            width={42}
                            height={42}
                            className="rounded-full bg-white"
                        />
                        <div className="flex-1 text-left leading-tight">
                            <p className="font-heading text-md text-white">{post.author.name}</p>
                        </div>
                    </Link>
                </div>
            ) : (null)}
        </>
    );
}

export default UserBlock;