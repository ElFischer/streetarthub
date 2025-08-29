import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { SocialMediaForm } from "@/components/social-media-form"

export const metadata = {
  title: "Social Media",
  description: "Manage your social media accounts and sharing settings.",
}

export default async function SocialPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Social Media"
        text="Connect and manage your social media accounts for automatic sharing."
      />
      <div className="grid gap-10">
        <SocialMediaForm user={{ 
          id: user.id, 
          socialMediaAccounts: user.socialMediaAccounts || [] 
        }} />
      </div>
    </DashboardShell>
  )
}

