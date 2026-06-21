import Link from "next/link";
import css from "./ProfilePage.module.css";
import Image from "next/image";
import { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page for NoteHub application",
  keywords: ["profile", "user", "account", "NoteHub"],
  applicationName: "NoteHub",
  alternates: {
    canonical: "/profile",
  },
  openGraph: {
    type: "profile",
    url: "/profile",
    title: "Profile | NoteHub",
    description: "User profile page for NoteHub application",
  },
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <div className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt="User Foto"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
}
