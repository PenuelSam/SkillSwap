"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchema } from "@/lib/validations/onboarding/profile";
import { updateProfileAction } from "@/lib/actions/onboarding";
import { supabaseClient } from "@/lib/supabaseClient";
import { useTransition, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EditProfileForm({ profile }: { profile: ProfileSchema | null }) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
   const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      socials: profile?.socials || {},
      avatar_url: profile?.avatar_url || "",
    },
  });

  async function uploadAvatar(file: File) {
  try {
    setUploading(true);
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Create a unique file path 
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`; // ✅ no "avatars/" prefix

    const { error: uploadError } = await supabaseClient.storage
      .from("avatars") // ✅ bucket name only
      .upload(filePath, file, { 
        contentType: file.type,
        upsert: true 
      });

    if (uploadError) throw uploadError;

    const { data } = supabaseClient.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    setValue("avatar_url", publicUrl, { shouldValidate: true });
  } catch (err) {
    console.error("Upload error:", err);
  } finally {
    setUploading(false);
  }
}
  const onSubmit = (data: ProfileSchema) => {
    startTransition(async () => {
     const { error } = await updateProfileAction(data);
            if (!error) {
                router.refresh(); 
            }
    });
  };

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto pb-20 md:my-6 p-6   md:p-8 md:pb-4 bg-white md:rounded-2xl shadow-sm">
  <h2 className="text-xl md:text-2xl font-bold  font-HelveticaMid mb-6">Edit Profile</h2>

  <div className="w-full md:h-[350px] md:overflow-y-auto">
  {/* Avatar Upload */}
  <div className="flex flex-col items-center mb-6">
    <label className="text-sm font-medium font-HelveticaMid mb-2">Avatar</label>
    <input
      type="file"
      accept="image/*"
      className="hidden"
      id="avatar-upload"
      onChange={(e) => {
        if (e.target.files?.[0]) uploadAvatar(e.target.files[0]);
      }}
    />
    <label
      htmlFor="avatar-upload"
      className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
    >
      {watch("avatar_url") ? (
        <Image
          src={watch("avatar_url") || ""}
          alt="Avatar Preview"
          className="w-full h-full rounded-full object-cover"
          width={96}
          height={96}
          quality={100}
          unoptimized={true}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      )}
    </label>
    {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
  </div>

  {/* Display Name */}
  <div className="mb-6">
    <label className="text-sm font-medium font-HelveticaMid mb-2 block">Display Name</label>
    <input
      {...register("display_name")}
      className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg  font-HelveticaReg"
    />
    {errors.display_name && <p className="text-red-500 text-sm mt-2">{errors.display_name.message}</p>}
  </div>

  {/* Bio */}
  <div className="mb-6">
    <label className="text-sm font-medium font-HelveticaMid mb-2 block">Bio</label>
    <textarea
      {...register("bio")}
      rows={3}
      className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg font-HelveticaReg"
    />
  </div>

  {/* Location */}
  <div className="mb-6">
    <label className="text-sm font-medium font-HelveticaMid mb-2 block">Location</label>
    <input
      {...register("location")}
      className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg font-HelveticaReg"
    />
  </div>

  {/* Social Links */}
  <div className="mb-6">
    <label className="text-sm font-medium font-HelveticaMid mb-2 block">LinkedIn</label>
    <input
      {...register("socials.linkedin")}
      className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg font-HelveticaReg"
    />
  </div>

  <div className="mb-6">
    <label className="text-sm font-medium font-HelveticaMid mb-2 block">Twitter</label>
    <input
      {...register("socials.twitter")}
      className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg font-HelveticaReg"
    />
  </div>
  </div>

  

    
      
   
  <button
    type="submit"
    disabled={isPending}
    className="w-full py-2 px-4 bg-black text-white cursor-pointer rounded-lg hover:bg-gray-800 font-HelveticaMid"
  >
    {isPending ? "Saving..." : "Save Changes"}
  </button>
    

  

  
</form>

  );
}
