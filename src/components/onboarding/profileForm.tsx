"use client";

import { updateProfileAction } from "@/lib/actions/onboarding";
import { profileSchema, ProfileSchema } from "@/lib/validations/onboarding/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

type Props = {
    onNext: () => void;
    onBack: () => void;
};


export function ProfileForm({ onNext, onBack }: Props) {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = (data: ProfileSchema) => {
        startTransition(async () => {
            try {
                await updateProfileAction(data);
                onNext(); //go to Step 2
            } catch (err) {
                console.error(err);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white  shadow-md w-full p-10 rounded-2xl space-y-4 flex flex-col gap-4 ">
            <div className="text-center  flex flex-col">
                <h1 className="font-interDisplayLight tracking-tight text-2xl md:text-3xl text-gray-900 leading-snug">Tell us about yourself</h1>
                <p className="font-interDisplayLight text-base md:text-lg leading-relaxed text-muted-foreground">This helps others know who they’re learning from.</p>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="display_name " className="font-interDisplayLight md:text-lg">Display Name</label>
                <input
                    type="text"
                    id="display_name"
                    {...register("display_name")}
                    placeholder="Display Name"
                    className="w-full rounded-xl border font-interDisplayLight border-gray-300 bg-gray-50 px-4 py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.display_name && <span className="font-interDisplayLight text-red-500">{errors.display_name.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="bio" className="font-interDisplayLight md:text-lg">Bio</label>
                <textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Tell us about yourself (optional)"
                    rows={4}
                   className="w-full rounded-xl border font-interDisplayLight border-gray-300 bg-gray-50 px-4 py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.bio && <p className="font-interDisplayLight">{errors.bio.message}</p>}
            </div>

            


            <div className="flex justify-between pt-4">
                <button
                type="button"
                onClick={onBack}
                className="rounded-full border px-4 py-2 hover:bg-gray-100 cursor-pointer md:text-lg font-interDisplayLight"
                >
                    Back
                </button>
               <button type="submit" disabled={isPending}  className="rounded-full bg-black cursor-pointer md:text-lg text-white px-4 py-2 hover:bg-gray-800 font-interDisplayLight">
                {isPending ? "Saving..." : "Next"}
            </button>

            </div>

        </form>
    )

}