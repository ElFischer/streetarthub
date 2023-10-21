import Link from "next/link"
import NextImage from "next/image"
import { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { Icons } from "../icons";

export default function Card({ id, title, image, description, count, type, source }: any) {
    const [aspectClass, setAspectClass] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = `https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${image}?alt=media`;

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
            <article className={`group relative `}>
                <div className="relative">
                    <div className={`aspect-h-4 aspect-w-4 overflow-hidden rounded-lg bg-gray-100 hidden sm:block`}>
                        <Link href={`${type ? type : '/art'}/${id}`} className="">
                            <NextImage
                                src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${image}?alt=media`}
                                alt={title}
                                fill={true}
                                sizes="450px"
                                className="h-full w-full object-cover object-center group-hover:opacity-80"
                                priority={true}
                            />
                            <span className="sr-only">View Article</span>
                        </Link>
                    </div>
                    <div className="sm:hidden" style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <NextImage
                            alt='Mountains'
                            src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${image}?alt=media`}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="rounded-lg group-hover:opacity-80"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100" aria-hidden="true">
                        <Button variant={'ghost'} size="icon" className="rounded-md bg-white bg-opacity-75 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"><Icons.heart className="h-4 w-4" /></Button>
                    </div>
                    {source && (
                        <div className="absolute bottom-0 p-4 transition-opacity duration-150 ease-in-out opacity-0 group-hover:opacity-100" aria-hidden="true">
                            <Link href={source} target="_blank">
                                <Button variant={'ghost'} size="icon" className="rounded-md bg-white bg-opacity-75 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"><Icons.link className="h-4 w-4" /></Button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-center justify-between space-x-8 font-medium text-gray-900">
                    <Link href={`${type ? type : '/art'}/${id}`} className="text-sm font-semibold leading-none">
                        {title}
                    </Link>
                    {/* <p>{product.price}</p> */}
                </div>
                {/* <p className="mt-1 text-sm text-gray-500">{product.category}</p> */}
            </article>
        </>
    )
}
