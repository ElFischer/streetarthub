"use client"

import * as React from "react"
import Link from "next/link"

import { MainNavItem } from "@/types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
}

export function MobileNav({ items, children }: MobileNavProps) {
  if (!items || items.length === 0) return null

  return (
    <div className={cn("md:hidden")}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center space-x-2 rounded-md p-2" aria-label="Open menu">
          <Menu className="h-6 w-6" />
          <span className="font-heading text-xl font-bold inline-block leading-6">
            STREETARTHUB
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {items.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex w-full items-center text-sm font-medium",
                  item.disabled && "cursor-not-allowed opacity-60"
                )}
              >
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
          {children ? (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">{children}</div>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}