"use client";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { loginSchema, LoginSchema } from "@/lib/validations/signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function SigninForm() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginSchema) => {
       

        const { data: loginData, error } = await supabaseClient.auth.signInWithPassword({ email: data.email, password: data.password })

        if(error) {
            console.error("Invalid Credentials", error.message);
            return;
        }

        router.push("/dashboard");
        console.log("Login Success", loginData);
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input 
        type="email" 
        id="email" 
        placeholder="Enter your email" 
        {...register("email")} 
        className="w-full border p-2 rounded" 
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Password Field */}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input 
        type="password" 
        id="password" 
        placeholder="Enter your password" 
        {...register("password")} 
        className="w-full border p-2 rounded" 
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* Submit Button */}

      <div>
        <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-2 rounded cursor-pointer hover:bg-gray-800 disabled:opacity-50"
        >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </form>
  )
}
