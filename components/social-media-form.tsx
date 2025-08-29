"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { SocialMediaAccountSchema } from "@/lib/models/User"
import { updateUserSocialAccounts } from "@/lib/firebase/social"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const socialMediaFormSchema = z.object({
  socialMediaAccounts: z.array(SocialMediaAccountSchema),
})

type FormData = z.infer<typeof socialMediaFormSchema>

interface SocialMediaFormProps {
  user: {
    id: string
    socialMediaAccounts: any[]
  }
}

export function SocialMediaForm({ user }: SocialMediaFormProps) {
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  const { register, handleSubmit, control, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(socialMediaFormSchema),
    defaultValues: {
      socialMediaAccounts: user.socialMediaAccounts.length > 0 
        ? user.socialMediaAccounts 
        : [{ platform: "twitter", username: "", profileUrl: "", enabled: false }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialMediaAccounts",
  })

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    try {
      const success = await updateUserSocialAccounts(user.id, data.socialMediaAccounts)
      
      if (!success) {
        throw new Error("Failed to update social media accounts")
      }

      toast({
        description: "Your social media accounts have been updated.",
      })
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Your settings could not be saved. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addAccount = () => {
    append({ 
      platform: "twitter", 
      username: "", 
      profileUrl: "", 
      enabled: false 
    })
  }

  const platformOptions = [
    { value: "twitter", label: "Twitter/X", icon: "twitter" },
    { value: "instagram", label: "Instagram", icon: "instagram" },
    { value: "facebook", label: "Facebook", icon: "facebook" },
    { value: "linkedin", label: "LinkedIn", icon: "linkedin" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Social Media Accounts</h3>
            <p className="text-sm text-muted-foreground">
              Connect your social media accounts to automatically share your posts.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addAccount}>
            <Icons.plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <div className="grid gap-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Account {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`socialMediaAccounts.${index}.platform`}>
                      Platform
                    </Label>
                    <Select
                      value={watch(`socialMediaAccounts.${index}.platform`)}
                      onValueChange={(value) => 
                        setValue(`socialMediaAccounts.${index}.platform` as any, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map((platform) => {
                          const IconComponent = Icons[platform.icon as keyof typeof Icons]
                          return (
                            <SelectItem key={platform.value} value={platform.value}>
                              <div className="flex items-center">
                                <IconComponent className="mr-2 h-4 w-4" />
                                {platform.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`socialMediaAccounts.${index}.username`}>
                      Username
                    </Label>
                    <Input
                      id={`socialMediaAccounts.${index}.username`}
                      placeholder="@username"
                      {...register(`socialMediaAccounts.${index}.username`)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`socialMediaAccounts.${index}.profileUrl`}>
                      Profile URL
                    </Label>
                    <Input
                      id={`socialMediaAccounts.${index}.profileUrl`}
                      placeholder="https://twitter.com/username"
                      {...register(`socialMediaAccounts.${index}.profileUrl`)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`socialMediaAccounts.${index}.accessToken`}>
                      API Access Token
                    </Label>
                    <Input
                      id={`socialMediaAccounts.${index}.accessToken`}
                      type="password"
                      placeholder="Your API access token"
                      {...register(`socialMediaAccounts.${index}.accessToken`)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for automatic posting. Keep this secure.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id={`socialMediaAccounts.${index}.enabled`}
                    type="checkbox"
                    {...register(`socialMediaAccounts.${index}.enabled`)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label 
                    htmlFor={`socialMediaAccounts.${index}.enabled`}
                    className="text-sm font-normal"
                  >
                    Enable automatic posting for this account
                  </Label>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t pt-6">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Getting API Access Tokens
            </h4>
            <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Twitter/X:</strong> Create an app at developer.twitter.com and get your Bearer Token</p>
              <p><strong>Instagram:</strong> Use Meta for Developers to get access tokens</p>
              <p><strong>Facebook:</strong> Create an app at developers.facebook.com</p>
              <p><strong>LinkedIn:</strong> Register your app at developer.linkedin.com</p>
            </div>
          </div>
        </div>

        <Button type="submit" className={cn(buttonVariants())} disabled={isSaving}>
          {isSaving && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Social Media Settings
        </Button>
      </div>
    </form>
  )
}
