"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchema } from "@/lib/validations/onboarding/profile";
import { updateProfileAction } from "@/lib/actions/onboarding";
import { supabaseClient } from "@/lib/supabaseClient";
import { useTransition, useState } from "react";
import Image from "next/image";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl shadow">
      <h2 className="md:text-[28px] text-[20px] tracking-tight font-HelveticaBold">Edit Profile</h2>

      {/* Avatar Upload */}
      <div>
        <label className="md:text-[18px] text-[16px] tracking-tight font-HelveticaMid">Avatar</label>
        <input
          type="file"
          accept="image/*"
          className="md:text-[18px] text-[16px] font-HelveticaLight"
          onChange={(e) => {
            if (e.target.files?.[0]) uploadAvatar(e.target.files[0]);
          }}
        />
        {uploading && <p className="md:text-[18px] text-[16px] font-HelveticaLight text-gray-500">Uploading...</p>}
        {watch("avatar_url") && (
          <Image
            src={watch("avatar_url") || ""}
            alt="Avatar Preview"
            className="mt-2 w-20 h-20 rounded-full object-cover"
            width={80}
            height={80}
            quality={100}
            unoptimized={true}
          />
        )}
      </div>

      {/* Display Name */}
      <div>
        <label className="md:text-[18px] text-[16px] tracking-tight font-HelveticaMid">Display Name</label>
        <input
          {...register("display_name")}
          className="w-full border rounded px-3 py-2 md:text-[18px] text-[16px] font-HelveticaLight"
        />
        {errors.display_name && <p className="text-red-500 text-sm">{errors.display_name.message}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className="md:text-[18px] text-[16px] tracking-tight font-HelveticaMid">Bio</label>
        <textarea
          {...register("bio")}
          rows={3}
          className="w-full border rounded px-3 py-2 md:text-[18px] text-[16px] font-HelveticaLight"
        />
      </div>

      {/* Location */}
      <div>
        <label className="md:text-[18px] text-[16px] tracking-tight font-HelveticaMid">Location</label>
        <input {...register("location")} className="w-full border rounded px-3 py-2 md:text-[18px] text-[16px] font-HelveticaLight" />
      </div>

      {/* Social Links */}
      <div>
        <label className="md:text-[18px] text-[16px] tracking-tight font-HelveticaMid">LinkedIn</label>
        <input {...register("socials.linkedin")} className="w-full border rounded px-3 py-2 md:text-[18px] text-[16px] font-HelveticaLight" />
      </div>

      <div>
        <label className="md:text-[18px] text-[16px] tracking-tight font-HelveticaMid">Twitter</label>
        <input {...register("socials.twitter")} className="w-full border rounded px-3 py-2 md:text-[18px] text-[16px] font-HelveticaLight" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 md:text-[18px] text-[16px] tracking-tight font-HelveticaMid"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
