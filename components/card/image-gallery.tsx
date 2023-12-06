import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Image from 'next/image';
import Link from "next/link";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { is } from "date-fns/locale";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export const ImageGallery = ({ images, type, id, onImageClick, isClickable }: any) => {

    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        const nextPage = page + newDirection;

        if (nextPage >= 0 && nextPage < images.length) {
            setPage([nextPage, newDirection]);
        }
    };

    return (
        <>
            <div className="group relative">
                <div className="aspect-h-4 aspect-w-4 flex justify-center align-middle overflow-hidden bg-background">
                    <AnimatePresence initial={false} custom={direction}>
                        {[page - 1, page, page + 1].map((p) => (
                            images[p] && (
                                <motion.div
                                    key={p}
                                    initial={{ x: p === page ? '0%' : p < page ? '-100%' : '100%' }}
                                    animate={{ x: p === page ? '0%' : p < page ? '-100%' : '100%' }}
                                    exit={{ x: p < page ? '-100%' : '100%' }}
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    dragPropagation={false}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);

                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    
                                >
                                    <div className={`absolute inset-0 ${p === page ? 'z-10' : 'z-0'}`}>
                                        <Image
                                            src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F${images[p]}?alt=media`}
                                            alt={`Gallery Image ${p}`}
                                            fill={true}
                                            sizes="450px"
                                            className={`sm:rounded-lg object-cover object-center ${isClickable ? 'cursor-pointer' : ''}`}
                                            priority={true}
                                            onClick={isClickable ? () => onImageClick() : undefined}
                                            placeholder='blur'
                                            blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
                                        />
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
                <div className="absolute p-4 z-10 bottom-0 left-0 right-0 flex justify-center gap-2 w-full">
                    {images.map((_: any, index: any) => (
                        <motion.div
                            key={index}
                            className={`w-[0.4rem] h-[0.4rem] rounded-full bg-white backdrop-blur backdrop-filter  ${page === index ? "" : "bg-opacity-75"}`}
                            animate={page === index ? { scale: 1.1 } : ""}
                        ></motion.div>
                    ))}
                </div>
                {page !== 0 && (
                    <div className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 p-4 z-10 transition-opacity duration-150 ease-in-out opacity-0 group-hover:opacity-100">
                        <Button onClick={() => paginate(-1)} variant={'ghost'} size="icon" className="rounded-full bg-white bg-opacity-75 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"><Icons.chevronLeft className="h-4 w-4" /></Button>
                    </div>
                )}

                {page !== images.length - 1 && (
                    <div className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 p-4 z-10 transition-opacity duration-150 ease-in-out opacity-0 group-hover:opacity-100">
                        <Button onClick={() => paginate(1)} variant={'ghost'} size="icon" className="rounded-full bg-white bg-opacity-75 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"><Icons.chevronRight className="h-4 w-4" /></Button>
                    </div>
                )}
            </div>
        </>
    );
};
