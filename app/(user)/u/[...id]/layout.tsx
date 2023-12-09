import Link from "next/link"

import { notFound } from "next/navigation"
import { MainNav } from "@/components/main-nav"

import { corporateConfig } from "@/config/corporate"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { UserAccountNav } from "@/components/user-account-nav"
import { getCurrentUser } from "@/lib/session"
import { SiteFooter } from "@/components/site-footer"

interface CorporateLayoutProps {
  children: React.ReactNode
}

export default async function CorporateLayout({
  children,
}: CorporateLayoutProps) {

  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={corporateConfig.mainNav} />
          {user ? (
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
                id: user.id,
              }}
            />
          ) : (
            <nav>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1 container">{children}</main>
      <SiteFooter />
    </div>
  )
}
