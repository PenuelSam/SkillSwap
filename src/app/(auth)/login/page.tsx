"use client"

import SigninForm from "@/components/auth/signinForm"

function page() {
  return (
    <div className='w-full h-[100dvh] md:bg-[#F9FAFB] flex justify-center items-center p-2'>   
      <SigninForm />
    </div>
  )
}

export default page
