import { useState } from 'react';

interface ResizedImages {
    [key: number]: string;
}

function useImageResize() {
    const [images, setImages] = useState<ResizedImages>({});

    const resizeImage = (file: File) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const sizes = [350, 500, 960];
            const resizedImages: ResizedImages = {};

            sizes.forEach((size) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.width = size;
                canvas.height = (img.height * size) / img.width;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resizedImages[size] = canvas.toDataURL('image/webp', 0.8);
            });

            setImages(resizedImages);
        };
    };

    return [images, resizeImage] as const;
}

export default useImageResize;