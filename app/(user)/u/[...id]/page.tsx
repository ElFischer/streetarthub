import TitleImage from "@/components/title-image"

export const metadata = {
  title: "Profile",
}

export default async function ProfilePage() {

  return (
    <>
      <TitleImage />
      <div>Public Profile</div>
    </>
  )
}