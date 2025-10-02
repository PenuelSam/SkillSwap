"use client";

import { supabaseClient } from "@/lib/supabaseClient";
import { signupSchema, SignupSchema } from "@/lib/validations/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuLockKeyhole, LuLockKeyholeOpen } from "react-icons/lu";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupForm() {
  const [view, setView] = useState<"password" | "text">("password");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupSchema) => {
    const { email, password } = values;

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Error signing up. Please try again.");
      return;
    }

    if (data.session) {
      // ✅ Session exists (no email confirmation required)
      toast.success("Signup successful! Welcome 🎉");
      router.push("/onboarding");
    } else {
      // ✅ No session returned (email confirmation required)
      toast.success("Check your email to confirm your account.");
      router.push("/login");
    }

    console.log("Signup Response:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[350px] mx-auto space-y-6 md:bg-[#fff] md:p-5 md:shadow-md md:rounded-2xl"
    >
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl tracking-tight font-interDisplayMedium">
          Welcome
        </h1>
        <p className="text-md md:text-lg tracking-tight font-interDisplayLight">
          Sign up with SkillSwap
        </p>
      </div>

      {/* Email Field */}
      <div>
        <input
          type="email"
          id="email"
          placeholder="Email address*"
          {...register("email")}
          className="w-full rounded-xl border font-interDisplayLight border-gray-300 bg-gray-50 px-4 py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.email && (
          <p className="text-red-500 text-sm md:text-md font-HelveticaReg">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <input
          type={view}
          id="password"
          placeholder="Password*"
          {...register("password")}
          className="w-full rounded-xl border font-interDisplayLight border-gray-300 bg-gray-50 px-4 py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <LuLockKeyhole
            fontSize={17}
            onClick={() => setView("text")}
            className={`${view === "password" ? "block" : "hidden"}`}
          />
          <LuLockKeyholeOpen
            fontSize={17}
            onClick={() => setView("password")}
            className={`${view === "password" ? "hidden" : "block"}`}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm md:text-md font-interDisplayLight">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#111] text-white py-2 font-interDisplayLight md:text-lg rounded-full cursor-pointer hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
        <div className="mt-4">
          <p className="text-sm md:text-md font-interDisplayLight">
            Already have an account?{" "}
            <Link href="/login" className="text-[#111] font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
