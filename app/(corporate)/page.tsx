import Image from "next/image"
import Link from "next/link"
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { WorldMapNavigation } from "@/components/map/world-map-navigation"
import { getAllCountries } from "@/lib/firebase/places"

const categories = [
  {
    name: 'Stencil Art',
    href: '/collections/stencil',
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F0ktt7giDnSXcxzJqHdiE_0.JPG?alt=media',
  },
  {
    name: 'Graffiti',
    href: '/collections/graffiti',
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F6F99a4HWvpIchTe0ixid_0.JPG?alt=media',
  },
  {
    name: 'Wheatpaste',
    href: '/collections/wheatpaste',
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2FAiFeCfypWTpZoclJIXsp_0.JPG?alt=media',
  },
  {
    name: 'Tape Art',
    href: '/collections/tape%20art',
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2FPR552smuf9LUZ4xtmTN4_0.JPG?alt=media',
  },
  {
    name: 'Installation',
    href: '/collections/installation',
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2FYFYejF7VOkHrdANalM8a_0.JPG?alt=media'
  },
]

const jobOpenings = [
  {
    id: 1,
    role: 'Unleash Creativity through Code',
    href: '#',
    description:
      "We're looking for dedicated developers, designers, and innovators to enhance the Streetart experience on our platform. Join our tech-savvy team and help us push the boundaries of our website.",
    salary: '$75,000 USD',
    location: 'San Francisco, CA',
  },
  {
    id: 2,
    role: 'Spreading Streetart Vibes Worldwide',
    href: '#',
    description:
      "Join our marketing crew and help us spread the Streetart enthusiasm worldwide. We're searching for social media wizards, content creators, and branding enthusiasts.",
    salary: '$125,000 USD',
    location: 'San Francisco, CA',
  },
  {
    id: 3,
    role: 'Fueling Streetart Dreams',
    href: '#',
    description:
      "Support the Streetart movement as part of our sponsorship team. Whether you're passionate about partnerships, fundraising, or sponsor outreach, we want your expertise.",
    salary: '$105,000 USD',
    location: 'San Francisco, CA',
  },
  {
    id: 4,
    role: 'Transforming Streets into Canvases',
    href: '#',
    description:
      'Calling all Streetart visionaries! Join us as an artist and transform urban landscapes into breathtaking art pieces. Your creativity is our inspiration.',
    salary: '$105,000 USD',
    location: 'San Francisco, CA',
  },
]

export default async function IndexPage() {
  const coll = collection(db, "streetart");
  const snapshot = await getCountFromServer(coll);
  const imageCount = snapshot.data().count

  const acoll = collection(db, "artists");
  const asnapshot = await getCountFromServer(acoll);
  const artistCount = asnapshot.data().count

  const ucoll = collection(db, "users");
  const usnapshot = await getCountFromServer(ucoll);
  const userCount = usnapshot.data().count

  const countries = await getAllCountries();

  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden h-[calc(100vh-5rem)]">
        <div className="pt-16 sm:pt-24 lg:pt-40"> {/* pb-80 sm:pb-40 lg:pb-48  */}
          <div className="relative container lg:static">
            <div className="z-10 relative lg:absolute">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-lg md:max-w-2xl">
                We’re a passionate group of people collecting streetart from around the world.
              </h1>
              <p className="my-10 text-lg leading-8 text-muted-foreground max-w-lg">
                Immerse yourself in a world of urban creativity, where graffiti, stencil art, murals, and so much more converge. Join our passionate community as we curate, celebrate, and explore the vibrant tapestry of Streetart from across the globe.
              </p>
              {/* <div className="space-x-4">
                <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                  Login
                </Link>
                <Link href="Login" className="text-sm font-semibold leading-6 text-gray-900">
                  Get started <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  Login
                </Link>
              </div> */}
            </div>
            <div className="mt-10 pl-10 lg:p-0">
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 top-0 md:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  {/* Mobile BG */}
                  <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />

                  {/* Image grid */}
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">

                      <div className="h-44 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F01h0FCbKPJLhJsPIRE5x_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F2YghBvctKwgLYVyqE4YD_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F2ZC95ik0LMl4gvhtciXP_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="h-32 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F31GveOMegJKThL32GGXS_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F2zfWsMa7nWoBuCw74zZO_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F3Oi0zrNvkAH37XmTQLS8_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F3TGaAFqPAW3BbfsWnt2y_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-44 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F3bnG42EN0dTs9eH5IQYl_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F3cdCYzWV3YtmDcx7FD05_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg relative opacity-20 lg:opacity-100">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F3glqZTo1awOiygPaZPcX_0.JPG?alt=media"
                          sizes="500"
                          alt=""
                          fill={true}
                          className="object-cover object-center"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category section */}
      <section className="pt-24 sm:pt-32 container">
        <div className="sm:flex sm:items-center sm:justify-between lg:pb-5">
          <div className="lg:col-end-1 lg:w-full lg:max-w-2xl">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Curate Your Streetart Experience</h2>
            <p className="mt-6 text-xl leading-8 text-muted-foreground">
              Whether you&rsquo;re curating your own collections or exploring our curated categories. Discover, curate, and immerse yourself in the boundless creativity of Streetart.
            </p>
          </div>
          <Link href="/collections" className="self-end hidden text-sm font-semibold hover:text-orange-500 lg:block">
            Browse all collections
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-4 flow-root">
          <div className="-my-2">
            <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
              <div className="absolute flex space-x-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    title={category.name + ' - streetarthub'}
                    className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <Image src={category.imageSrc} alt={category.name + ' - streetarthub'} fill={true} sizes="500" className="h-full w-full object-cover object-center" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-20"
                    />
                    <span className="relative mt-auto text-center text-xl font-bold text-white tracking-tight font-heading">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 lg:hidden">
          <Link href="/collections" className="block text-sm font-semibold hover:text-orange-500">
            Browse all collections
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </section>

      {/* World Map Navigation Section */}
      <section className="mt-32 sm:mt-40 container">
        <div className="sm:flex sm:items-center sm:justify-between lg:pb-5">
          <div className="lg:col-end-1 lg:w-full lg:max-w-2xl">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Explore Streetart Worldwide
            </h2>
            <p className="mt-6 text-xl leading-8 text-muted-foreground">
              Discover urban art from around the globe. Click on a country to explore its street art scene.
            </p>
          </div>
          <Link href="/places" className="self-end hidden text-sm font-semibold hover:text-orange-500 lg:block">
            Browse all places
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-16">
          <WorldMapNavigation countries={countries} />
        </div>

        <div className="mt-16 px-4 lg:hidden">
          <Link href="/places" className="block text-sm font-semibold hover:text-orange-500">
            Browse all places
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Artists section */}
      <section className="mt-32 overflow-hidden sm:mt-40">
        <div className="container lg:flex relative">
          <div className="hidden lg:block absolute lg:right-8 z-10">
            <Link href="/artists" title="Browse all artists - streetarthub" className="text-sm font-semibold hover:text-orange-500 my-10">
              Browse all artists
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
          <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-x-10 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
            <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Artists - The Creative Soul of Our Portal</h2>
              <p className="mt-6 text-xl leading-8 text-muted-foreground">
                Step into the world of remarkable artists, the driving force behind our Streetart portal. Explore their unique creations, share their artwork, and immerse yourself in the artistic essence of the streets.
              </p>
              <p className="my-6 text-base leading-7 text-muted-foreground">
                In our Streetart portal, we proudly showcase the incredibly talented artists who infuse urban landscapes with their artistic brilliance. Our Artists&rsquo; Corner is a tribute to their creative spirit. Here, you can discover a gallery filled with their captivating works, find inspiration, and connect with the visionary artists who breathe life into the streets. Whether you&rsquo;re an artist looking to share your talents or an enthusiast eager to explore and appreciate Streetart, this is your platform to embrace the heart and soul of street artistry.
              </p>
              <div className="lg:hidden absolute z-10">
                <Link href="/artists" title="Browse all artists - streetarthub" className="text-sm font-semibold hover:text-orange-500 my-10">
                  Browse all artists
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
              <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                <Image src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2FIoNSbx0PCwqMswiCK8IT_0.JPG?alt=media" alt="" width={1200} height={1200} className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover" />
              </div>
              <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                  <Image src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2FV58A1TWc69lAO97VjDdJ_0.JPG?alt=media" alt="" width={1200} height={1200} className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover" />
                </div>
                <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                  <Image src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2FQ4eIXpUvPL7iq429qHC1_0.JPG?alt=media" alt="" width={1200} height={1200} className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover" />
                </div>
                <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                  <Image src="https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2Fjacl3gl1fz0BOtWOXRbO_0.JPG?alt=media" alt="" width={1200} height={1200} className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-32 sm:mt-40 container">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            We approach Streetart as something that enriches our lives and adds value to the world.
          </h2>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            At our Streetart portal, we have a unique perspective on this vibrant art form. We don&apos;t just see Streetart as visual aesthetics; we view it as a powerful force that enriches our lives and contributes meaningfully to the world around us. Join us on a journey where creativity knows no bounds, where walls become canvases, and where Streetart becomes a source of inspiration, transformation, and connection.
          </p>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
            <p className="flex-none text-3xl font-bold tracking-tight text-gray-900">{userCount} user</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-lg font-semibold tracking-tight text-gray-900">Our Streetart Community</p>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Join a thriving community of passionate individuals who share a love for Streetart. Discover, connect, and create alongside thousands of fellow enthusiasts.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
            <p className="flex-none text-3xl font-bold tracking-tight text-white">{imageCount} posts</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-lg font-semibold tracking-tight text-white">
                A Tapestry of Streetart Creations
              </p>
              <p className="mt-2 text-base leading-7 text-gray-400">
                Explore a vast collection of Streetart masterpieces. With a growing number of posts, our platform is a canvas for artists and admirers alike.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
            <p className="flex-none text-3xl font-bold tracking-tight text-white">{artistCount} artists</p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-lg font-semibold tracking-tight text-white">Celebrating Streetart Talents</p>
              <p className="mt-2 text-base leading-7 text-gray-100">
                Our platform boasts a diverse roster of talented Streetart artists. Join this creative melting pot and be inspired by their unique visions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer section */}
      <section className="mt-32 sm:mt-40 container">
        <div className="mx-auto flex max-w-2xl flex-col items-end justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
          <div className="w-full lg:max-w-xl lg:flex-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              We’re always looking for awesome people to join us
            </h2>
            <p className="mt-6 text-xl leading-8 text-muted-foreground">
              We&apos;re always on the lookout for amazing people to join our Streetart community. Whether you&apos;re an artist, a tech enthusiast, a storyteller, or just love Streetart, there&apos;s a place for you to make a colorful impact with us!
            </p>
            <Image
              src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1344&h=1104&q=80"
              width={1344}
              height={1104}
              alt=""
              className="mt-16 aspect-[6/5] w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-[34.5rem]"
            />
          </div>
          <div className="w-full lg:max-w-xl lg:flex-auto">
            <h3 className="sr-only">Job openings</h3>
            <ul className="-my-8 divide-y divide-gray-100">
              {jobOpenings.map((opening) => (
                <li key={opening.id} className="py-8">
                  <dl className="relative flex flex-wrap gap-x-3">
                    <dt className="sr-only">Role</dt>
                    <dd className="w-full flex-none text-lg font-semibold tracking-tight ">
                      <a href={opening.href}>
                        {opening.role}
                        <span className="absolute inset-0" aria-hidden="true" />
                      </a>
                    </dd>
                    <dt className="sr-only">Description</dt>
                    <dd className="mt-2 w-full flex-none text-base leading-7 text-muted-foreground">{opening.description}</dd>
                    {/* <dt className="sr-only">Salary</dt>
                    <dd className="mt-4 text-base font-semibold leading-7 ">{opening.salary}</dd>
                    <dt className="sr-only">Location</dt>
                    <dd className="mt-4 flex items-center gap-x-3 text-base leading-7 text-gray-500">
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300" aria-hidden="true">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      {opening.location}
                    </dd> */}
                  </dl>
                </li>
              ))}
            </ul>
            {/* <div className="mt-8 flex border-t border-gray-100 pt-8">
              <a href="#" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                View all openings <span aria-hidden="true">&rarr;</span>
              </a>
            </div> */}
          </div>
        </div>
      </section>

      {/* Logo cloud */}
      {/* <div className="mx-auto mt-32 sm:mt-40 border-y">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:px-16">
          <h2 className="font-heading mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Proudly Open Source
          </h2>
          <p className="mx-auto my-6 max-w-[42rem] leading-normal sm:text-xl sm:leading-8 text-gray-300">
            I&apos;m building a web app with Next.js 13 and open sourcing
            everything. Follow along as we figure this out together.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
          <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div
              className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
              style={{
                clipPath:
                  'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
              }}
            />
          </div>
        </div>
      </div> */}
    </>
  )
}
