import Link from "next/link"
import NextImage from "next/image"
import { useEffect, useState } from 'react';

export default function Card({ id, title, image, description, count, type }: any) {
    const [aspectClass, setAspectClass] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = `https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_500_${image}?alt=media`;

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            if (aspectRatio > 1) {
                setAspectClass(false); // Setzen Sie hier Ihre Querformat-Klasse
            } else {
                setAspectClass(true); // Setzen Sie hier Ihre Hochformat-Klasse
            }
        };
    }, [image]);

    return (
        <>
            <div className={`group relative`}>
                <div className="relative">
                    <div className={`aspect-h-4 aspect-w-4 overflow-hidden rounded-lg bg-gray-100`}>
                        <Link href={`${type ? type : '/art'}/${id}`} className="">
                            <NextImage
                                src={`https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_500_${image}?alt=media`}
                                alt={title}
                                fill={true}
                                sizes="450px"
                                className="h-full w-full object-cover object-center"
                                priority={true}
                            />
                            <span className="sr-only">View Article</span>
                        </Link>
                    </div>
                    <div className="absolute top-0 p-4 opacity-0 group-hover:opacity-100" aria-hidden="true">
                        <Link href='#' className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">View Artwork</Link>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between space-x-8 font-medium text-gray-900">
                    <Link href={`${type ? type : '/art'}/${id}`} className="text-sm font-semibold leading-none">
                        {title}
                    </Link>
                    {/* <p>{product.price}</p> */}
                </div>
                {/* <p className="mt-1 text-sm text-gray-500">{product.category}</p> */}
            </div>

            {/* <article className='h-80 xl:w-auto bg-gray-200 rounded-md relative flex flex-col overflow-hidden'>
                <span aria-hidden="true" className="absolute inset-0">
                    <Image
                        src={`https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_500_${image}?alt=media`}
                        alt={title}
                        fill={true}
                        sizes="450px"
                        className="h-full w-full object-cover object-center"
                        priority={true}
                    />

                </span>
                <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-20"
                />
                <span className="relative mt-auto text-center text-xl font-bold text-white tracking-tight font-heading">{title}</span>
                <Link href={`${type ? type : '/art'}/${id}`} className="absolute inset-0">
                    <span className="sr-only">View Article</span>
                </Link>
            </article> */}
            {/* <div key={index} style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Image
                    alt='Mountains'
                    src={`https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_500_${photo.media[0]}?alt=media`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                />
            </div> */}
        </>
    )
}
