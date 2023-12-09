import React from 'react'
import Image from "next/image"
import { getCurrentUser } from '@/lib/session'
import { Icons } from './icons'
import { Button } from './ui/button'

const profile = {
    name: 'Ricardo Cooper',
    email: 'ricardo.cooper@example.com',
    avatar:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    backgroundImage:
        '/images/title.jpeg',
    fields: [
        ['Phone', '(555) 123-4567'],
        ['Email', 'ricardocooper@example.com'],
        ['Title', 'Senior Front-End Developer'],
        ['Team', 'Product Development'],
        ['Location', 'San Francisco'],
        ['Sits', 'Oasis, 4th floor'],
        ['Salary', '$145,000'],
        ['Birthday', 'June 8, 1990'],
    ],
}

export default async function ProfileHeader({ user }: any) {

    const currentUser = await getCurrentUser()

    return (
        <div className='mb-12'>
            <div className="h-32 w-full lg:h-80 relative">
                <Image fill className="object-cover object-center" src={profile.backgroundImage} alt={profile.name} />
            </div>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                    <div className="flex h-24 w-24 sm:h-32 sm:w-32 relative">
                        <Image fill className="object-cover object-center rounded-full ring-4 ring-white" src={user.image} alt={user.name} />
                    </div>
                    {currentUser && currentUser.id === user.id ? (
                        <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl ">{user.name}</h1>
                            </div>
                            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <Button
                                    variant={'secondary'}
                                    className='rounded-lg'
                                >
                                    <Icons.settings className="h-5 w-5 mr-2" />
                                    Edit profile
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl ">{user.name}</h1>
                            </div>
                            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <Button
                                    variant={'secondary'}
                                    size={'icon'}
                                    className='rounded-lg'
                                >
                                    <Icons.share className="h-5 w-5" aria-hidden="true" />
                                </Button>
                                <Button className='rounded-lg'>
                                    <span>Follow</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
                    <h1 className="font-heading text-4xl">{user.name}</h1>
                </div>
            </div>
        </div>
    )
}
