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
    const [height, setheight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const img = new Image();
        img.src = `https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_500_${image}?alt=media`;

        img.onload = () => {
            setWidth(img.width);
            setheight(img.height);

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
                setAspectClassRatio('h-[14rem] sm:h-[32.375rem] lg:h-[24.375rem] xl:h-[34.375rem]');
            }
        };
    }, [image, index]);

    return (
        <>
            <article className={`group relative `}>
                <div className="group relative">
                    <div className={`aspect-h-4 aspect-w-4 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75`}>
                        <Link href={`${type ? type : '/art'}/${id}`}>
                            <NextImage
                                src={`https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_500_${image}?alt=media`}
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
            
        </>
    )
}
