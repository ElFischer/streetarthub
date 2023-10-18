"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
function useParallax(distance: any) {
    const { scrollYProgress } = useScroll();
    return useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
}

function MyImage({ src, alt, speed }: any) {
    const y = useParallax(100);

    return (
        <motion.div style={{ y }} >
            <div className="h-64 relative group transform translate-y-11 scale-125">
                <Image
                    fill={true}
                    alt='Mountains'
                    src={src}
                    className="object-cover group-hover:opacity-75 "
                />
            </div>
        </motion.div>
    );
}

export default function Hero() {
    return (
        <div className="grid grid-cols-4 items-center gap-4 md:gap-6">
            <div className="overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/10 ">
                <MyImage src="https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F01h0FCbKPJLhJsPIRE5x_0.JPG?alt=media&token=e5b95880-9544-4d44-9a1a-227e8866e2dd&_gl=1*1n305tt*_ga*MTMyMzA0OTg0MS4xNjk0NTg4MTIw*_ga_CW55HF8NVT*MTY5NzIwODQ4NS40OS4xLjE2OTcyMDg1NDAuNS4wLjA." alt="Image 1" speed={30} />
            </div>
            <div data-rellax-speed="2" className="rellax transform-gpu space-y-4 md:space-y-6" style={{ transform: 'translate3d(0px, -113px, 0px)' }}>
                <div className="h-48 overflow-hidden rounded-xl shadow-2xl shadow-black/10">
                    <Image data-rellax-speed="1" className="rellax transform-gpu" src="https://via.placeholder.com/800x983" alt="tailus developer portfolio homepage screenshot" width="800" height="983" style={{ transform: 'translate3d(0px, -80px, 0px)' }} />
                </div>
                <Image className="rounded-xl shadow-2xl shadow-black/10" src="https://via.placeholder.com/800x1108" alt="tailus creative designer portfolio homepage screenshot" width="800" height="1108" />
                <div className="relative h-48 overflow-hidden rounded-xl shadow-2xl shadow-black/10">
                    <div className="absolute -inset-x-1 top-0 z-[1]">
                        <Image className="w-full backdrop-blur" src="https://via.placeholder.com/2880x154" alt="tailus astrolus premium template header screenshot" width="2880" height="154" />
                    </div>
                    <Image data-rellax-speed="1" className="rellax transform-gpu -mt-1" src="https://via.placeholder.com/800x983" alt="tailus astrolus free template header screenshot" width="800" height="983" style={{ transform: 'translate3d(0px, -80px, 0px)' }} />
                </div>
            </div>
            <div className="space-y-4 md:space-y-6">
                <div className="h-56 overflow-hidden rounded-xl shadow-2xl shadow-black/10">
                    <Image data-rellax-speed="1" className="rellax transform-gpu" src="https://via.placeholder.com/800x1334" alt="tailus design agency portfolio homepage screenshot" width="800" height="1334" style={{ transform: 'translate3d(0px, -72px, 0px)' }} />
                </div>
                <div className="h-80 w-full overflow-hidden rounded-xl shadow-2xl shadow-black/10 xl:h-[26rem]">
                    <Image data-rellax-speed="1" className="rellax transform-gpu" src="https://via.placeholder.com/801x2477" alt="tailus alt template case study page screenshot" width="801" height="2477" style={{ transform: 'translate3d(0px, -53px, 0px)' }} />
                </div>
            </div>
            <div data-rellax-speed="-1" className="rellax transform-gpu space-y-4 md:space-y-6" style={{ transform: 'translate3d(0px, 51px, 0px)' }}>
                <div className="overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/10">
                    <Image src="https://via.placeholder.com/800x1226" alt="tailus ampire template solution page screenshot" width="800" height="1226" />
                </div>
                <div className="overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/10">
                    <Image src="https://via.placeholder.com/800x1226" alt="tailus ampire template pricing page screenshot" width="800" height="1226" />
                </div>
            </div>
        </div>
    );
}

