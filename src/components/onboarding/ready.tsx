import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  onBack: () => void;
};

function Ready({ onBack }: Props) {
      const router = useRouter();
  
  const handleClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="bg-white  shadow-md w-full p-10 rounded-2xl space-y-6 flex flex-col items-center">
      <h1 className="font-interDisplayLight tracking-tight text-2xl md:text-3xl text-gray-900 leading-snug text-center">
        You’re all set! 🎉
      </h1>
      <p className="font-interDisplayLight text-base md:text-lg leading-relaxed text-muted-foreground text-center max-w-md">
        Your profile is ready. Start exploring skills now.
      </p>

      {/* Next Steps Section */}
      <div className="w-full max-w-sm bg-gray-50 rounded-xl p-4 space-y-3">
        <h2 className="text-sm md:text-lg font-semibold font-interDisplayLight text-gray-700 uppercase tracking-wide">
          Next Steps
        </h2>
        <ul className="space-y-2 text-sm md:text-lg text-gray-600">
          <li className="flex items-start gap-2 font-interDisplayLight">
            <span className="bg-gradient-to-b from-[#E1E4E7] via-[#9BA8B4] to-[#4B5D6E] bg-clip-text text-transparent font-bold">✓</span>
            <span>Browse skills and find learning opportunities</span>
          </li>
          <li className="flex items-start gap-2 font-interDisplayLight">
            <span className="bg-gradient-to-b from-[#E1E4E7] via-[#9BA8B4] to-[#4B5D6E] bg-clip-text text-transparent font-bold">✓</span>
            <span>Create your first skill offering</span>
          </li>
          <li className="flex items-start gap-2 font-interDisplayLight">
            <span className="bg-gradient-to-b from-[#E1E4E7] via-[#9BA8B4] to-[#4B5D6E] bg-clip-text text-transparent font-bold">✓</span>
            <span>Connect with other skill swappers</span>
          </li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border px-4 py-2 hover:bg-gray-100 transition cursor-pointer  font-interDisplayLight"
        >
          Back
        </button>
        <button
          onClick={handleClick}
          className="rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800 transition cursor-pointer font-interDisplayLight"
        >
          Start Swapping
        </button>
      </div>
    </div>
  );
}

export default Ready;
