import Link from "next/link"
import Image from "next/image"

export default function Card({ id, title, image, description, count, type }: any) {
    return (
        <article className='h-80 w-56 xl:w-auto bg-gray-200 rounded-md relative flex flex-col overflow-hidden'>
            <span aria-hidden="true" className="absolute inset-0">
                <Image
                    src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${image}?alt=media`}
                    alt={title}
                    fill={true}
                    sizes="450px"
                    className="h-full w-full object-cover object-center"
                    priority={true}
                />
                {/* <div key={index} style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Image
                    alt='Mountains'
                    src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${photo.media[0]}?alt=media`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                />
            </div> */}
            </span>
            <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-20"
            />
            <span className="relative mt-auto text-center text-xl font-bold text-white tracking-tight font-heading">{title}</span>
            <Link href={`${type ? type : '/art'}/${id}`} className="absolute inset-0">
                <span className="sr-only">View Article</span>
            </Link>
        </article>
    )
}
