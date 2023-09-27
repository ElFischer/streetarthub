'use client'

import Image from 'next/image'

function CustomImageRenderer({ data }: any) {
  const src = data.file.url

  return (
    <div className='relative max-w-3xl py-6 lg:py-10'>
      <Image
        src={src}
        alt='image_alt_TODO'
        width={720}
        height={405}
        className="my-8 rounded-md bg-muted transition-colors"
        priority
      />
    </div>
  )
}

export default CustomImageRenderer