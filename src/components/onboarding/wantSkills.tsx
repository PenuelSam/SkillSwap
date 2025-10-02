"use client";

import { saveOfferSkills, saveWantSkills } from "@/lib/actions/onboarding";
import { OfferSkillsData, offerSkillsSchema, WantSkillsData } from "@/lib/validations/onboarding/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
    onNext: () => void;
    onBack: () => void;
};

const AVAILABLE_SKILLS = [
    "Guitar",
  "CSS Grid",
  "Cooking",
  "Public Speaking",
  "Photography",
  "JavaScript",
]

export function WantSkillsForm({ onNext, onBack }: Props) {
    const form = useForm<OfferSkillsData>({
        resolver: zodResolver(offerSkillsSchema),
        defaultValues: { skills: [] },
    });

    const { handleSubmit, setValue, watch, formState: { errors } } = form;

    const selectedSkills = watch("skills");

    function toggleSkill(skill: string) {
        const current = selectedSkills || [];
        if(current.includes(skill)) {
            setValue("skills", current.filter((s: string) => s !== skill));
        } else {
            setValue("skills", [...current, skill]);
        }
    }

    async function onSubmit(data: WantSkillsData) {
       try{
        await saveWantSkills(data.skills);
        onNext();
       } catch (err) {
        console.error("Error saving offer skills:", err);
        
       }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white  shadow-md w-full p-10 rounded-2xl space-y-4 flex flex-col gap-4 ">
           <div className="text-center  flex flex-col ">
                <h2 className="font-interDisplayLight tracking-tight text-2xl md:text-3xl text-gray-900 leading-snug">What do you want to learn?</h2>
            <p className="font-interDisplayLight text-base md:text-lg leading-relaxed text-muted-foreground">Choose as many as you like.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = selectedSkills?.includes(skill);
                    return (
                        <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-full border px-4 py-2 text-sm md:text-lg transition font-interDisplayLight ${
                            isSelected ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black" 
                        }`}
                        >
                            {skill}
                        </button>
                    )
                })}

            </div>

            {errors.skills && (
                <p className="text-red-500 text-sm md:text-md font-interDisplayLight">{errors.skills.message}</p>
            )}

            <div className="flex justify-between pt-4">
                <button
                type="button"
                onClick={onBack}
                className="rounded-full border px-4 py-2 hover:bg-gray-100 cursor-pointer md:text-lg font-interDisplayLight"
                >
                    Back
                </button>
                <button
                type="submit"
                className="rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800 cursor-pointer md:text-lg font-interDisplayLight"
                >
                    Next
                </button>

            </div>
        </form>
    )
}