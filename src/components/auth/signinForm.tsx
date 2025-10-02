"use client";
import { useRouter } from "next/navigation";
import {  supabaseClient } from "@/lib/supabaseClient";
import { loginSchema, LoginSchema } from "@/lib/validations/signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { LuLockKeyhole, LuLockKeyholeOpen } from "react-icons/lu";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SigninForm() {
  const [view, setView] = useState<"password" | "text">("password");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    const { data: loginData, error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error("Invalid email or password.");
      return;
    }

    toast.success("Login successful!");
    router.push("/dashboard"); // middleware will allow access now
    console.log("Login Success", loginData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[350px] mx-auto space-y-6 md:bg-[#fff] md:p-5 md:shadow-md md:rounded-2xl"
    >
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl tracking-tight font-interDisplayMidium">
          Welcome Back
        </h1>
        <p className="text-md md:text-lg tracking-tight font-interDisplayLight">
          Login to start swarping again!
        </p>
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          id="email"
          placeholder="Email address*"
          {...register("email")}
          className="w-full rounded-xl border font-interDisplayLight border-gray-300 bg-gray-50 px-4 py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.email && (
          <p className="text-red-500 text-sm md:text-md">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type={view}
          id="password"
          placeholder="Password*"
          {...register("password")}
          className="w-full rounded-xl border font-interDisplayLight border-gray-300 bg-gray-50 px-4 py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="absolute right-4 top-[50%] transform -translate-y-[50%]">
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

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#111] text-white py-2 rounded-full font-interDisplayLight md:text-lg cursor-pointer hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Continue"}
        </button>
        <div className="mt-4">
          <p className="text-sm md:text-md font-interDisplayLight">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#111] font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
