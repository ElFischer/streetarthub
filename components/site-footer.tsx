import * as React from "react"

import { siteConfig, footerNavigation } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <>
      {/* Footer */}
      <footer className={cn(className, 'mt-32 sm:mt-40')}>
        <div className="container-fluid flex flex-col items-center justify-between gap-4 py-10 md:h-20 md:flex-row md:py-0 ">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            {/* <Icons.logo /> */}
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{" "}
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Enrique
              </a>
              . Hosted on{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Vercel
              </a>
              . The source code is available on{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
          <div>
            <div className="flex space-x-6 md:order-2 content-center">
              {footerNavigation.social.map((item) => {
                const Icon = Icons[item.icon || "arrowRight"]
                return (
                  <Link key={item.name} title={'streetarthub on ' + item.name} href={item.href} target="_blank" className="text-gray-400 hover:text-gray-500 inline-flex items-center justify-center">
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </Link>
                )
              })}
              <ModeToggle />
            </div>

          </div>
        </div>
      </footer>
    </>

  )
}