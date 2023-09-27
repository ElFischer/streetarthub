'use client'
import React from 'react'
import Image from "next/image"

export default function TitleImage() {
    return (
        <div>
            <Image src="/images/title.jpeg" alt="Next.js Logo" width={1400} height={100} className='rounded-md'/>
        </div>
    )
}
