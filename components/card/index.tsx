import Link from "next/link"
import NextImage from "next/image"
import { useEffect, useRef } from 'react';
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

import { Dialog, DialogContent } from "./preview-dialog";
import useDialogWithRouting from '@/hooks/useDialogWithRouting';

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ImageGallery } from "./image-gallery";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ContentBlock from "./content-block";
import UserBlock from "./user-block";

export default function Card({ id, title, image, description, count, media, type, source, index, cover, post }: any) {

  /* const handleUpdatePost = async (width: any, height: any) => {
      let cover = [
          {
              url: image,
              width: width,
              height: height
          }
      ]
      console.log(cover)
      const newItemRef = doc(db, "streetart", id);
      await updateDoc(newItemRef, {
          cover: cover
      });
  }

  useEffect(() => {
      const img = new Image();
      img.src = `https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F${image}?alt=media`;
      img.onload = () => {
          if (!cover) {
              handleUpdatePost(img.width, img.height)
          }
      };
  }, [image, index]); */

  const { isOpen, openDialog, closeDialog } = useDialogWithRouting(id);

  return (
    <>
      <article className={`group relative `}>
        <div className="group relative">
          {type ? (
            <Link href={`${type ? type : '/art'}/${id}`}>
              <AspectRatio ratio={cover ? cover[0].width / cover[0].height : 5 / 4} className="bg-muted relative sm:group-hover:opacity-75">
                <NextImage
                  src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_500_${image}?alt=media`}
                  alt={title}
                  fill={true}
                  sizes="450px"
                  className="rounded-lg object-cover object-center cursor-pointer"
                  priority={true}
                  placeholder='blur'
                  blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
                />
                <span className="sr-only">View Article</span>
              </AspectRatio>
            </Link>
          ) : (
            <>
              {media && media.length > 1 ? (
                <div className="group relative">
                  <ImageGallery images={media} type={type} id={id} onImageClick={openDialog} isClickable={true} />
                </div>
              ) : (
                <AspectRatio ratio={cover ? cover[0].width / cover[0].height : 5 / 4} className="bg-muted relative">
                  <NextImage
                    src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F${image}?alt=media`}
                    alt={title}
                    fill={true}
                    sizes="450px"
                    className="sm:rounded-lg object-cover object-center"
                    onClick={openDialog}
                    priority={true}
                    placeholder='blur'
                    blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
                  />
                  <span className="sr-only">View Article</span>
                </AspectRatio>
              )}
              <div className="hidden sm:block absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer" onClick={openDialog}></div>

              <div className="hidden sm:block absolute top-0 left-0 p-4 opacity-0 group-hover:opacity-100 z-40" aria-hidden="true">
                <UserBlock post={post} />
              </div>
              <div className="hidden sm:block absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 z-40" aria-hidden="true">
                <Button variant={'ghost'} size="icon" className="rounded-md bg-white bg-opacity-75 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"><Icons.heart className="h-4 w-4" /></Button>
              </div>
              {source && (
                <div className="hidden sm:block absolute bottom-0 p-4 transition-opacity duration-150 ease-in-out opacity-0 group-hover:opacity-100 z-40" aria-hidden="true">
                  <Link href={source} target="_blank">
                    <Button variant={'ghost'} size="icon" className="rounded-md bg-white bg-opacity-75 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"><Icons.link className="h-4 w-4" /></Button>
                  </Link>
                </div>
              )}

            </>

          )}

        </div>
        <div className="mt-4 flex items-center justify-between space-x-8 font-medium text-gray-900 sm:px-0 px-8">
          <Link href={`${type ? type : '/art'}/${id}`} className="text-sm font-semibold leading-none truncate w-full max-w-[calc(100%-2rem)]">
            {title}
          </Link>
        </div>
      </article >
      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="flex flex-col gap-8 justify-center py-6 lg:py-10 ">
          <ContentBlock post={post} className="pb-5" />
          {media && media.length > 1 ? (
            <div className="group relative">
              <ImageGallery images={media} type={type} id={id} isClickable={false} />
            </div>
          ) : (
            <AspectRatio ratio={cover ? cover[0].width / cover[0].height : 5 / 4} className="bg-muted relative sm:group-hover:opacity-75">
              <NextImage
                src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F${image}?alt=media`}
                alt={title}
                fill={true}
                sizes="450px"
                className="sm:rounded-lg object-cover object-center"
                placeholder='blur'
                blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
              />
              <span className="sr-only">View Article</span>
            </AspectRatio>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
