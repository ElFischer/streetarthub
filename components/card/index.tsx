import Link from "next/link"
import NextImage from "next/image"
import { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { Icons } from "../icons";

export default function Card({ id, title, image, description, count, type, source, index }: any) {
    const [aspectClassGrid, setAspectClassGrid] = useState<string | null>(null);
    const [aspectClassRatio, setAspectClassRatio] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = `https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${image}?alt=media`;

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            setAspectRatio(aspectRatio);
            if (aspectRatio > 0.7) {
                setAspectClassRatio('h-[14rem] lg:h-[10rem] xl:h-[15rem]');
                if (aspectRatio < 1.6 || index < 2) {
                    setAspectClassGrid(null);
                } else {
                    setAspectClassGrid('col-span-2');
                }
            } else {
                setAspectClassGrid('row-span-2');
                setAspectClassRatio('h-[32.375rem] lg:h-[24.375rem] xl:h-[34.375rem]');
            }
        };
    }, [image, index]);

    return (
        <>
            <article className={`group relative hidden sm:block ${aspectClassGrid}`}>
                <div className="group relative">
                    <div className={`${aspectClassRatio} min-h-[14rem] lg:min-h-[10rem] xl:min-h-[15rem] w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75`}>
                        <Link href={`${type ? type : '/art'}/${id}`}>
                            <NextImage
                                src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${image}?alt=media`}
                                alt={title}
                                fill={true}
                                sizes="450px"
                                className="h-full w-full rounded-lg object-cover object-center"
                                priority={true}
                                placeholder='blur'
                                blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
                            />
                            <span className="sr-only">View Article</span>
                        </Link>
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
                    <Link href={`${type ? type : '/art'}/${id}`} className="text-sm font-semibold leading-none truncate w-full max-w-[calc(100%-2rem)]">
                        {title}
                    </Link>
                </div>

            </article>
            <article className={`group relative sm:hidden`}>
                {!isComplete && <div className="bg-gray-300 min-h-[20rem] rounded-lg"></div>}
                <Link href={`${type ? type : '/art'}/${id}`}>
                    <NextImage
                        alt={title}
                        src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F${image}?alt=media`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="rounded-lg group-hover:opacity-80"
                        style={{ width: '100%', height: 'auto' }}
                        onLoadingComplete={() => setIsComplete(true)}
                        placeholder='blur'
                        blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
                    />
                </Link>
                <div className="mt-4 flex items-center justify-between space-x-8 font-medium text-gray-900">
                    <Link href={`${type ? type : '/art'}/${id}`} className="text-sm font-semibold leading-none truncate w-full max-w-[calc(100%-2rem)]">
                        {title}
                    </Link>
                </div>
            </article>
        </>
    )
}
