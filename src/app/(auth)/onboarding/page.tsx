"use client";

import { OfferSkillsForm } from "@/components/onboarding/offerSkills";
import { ProfileForm } from "@/components/onboarding/profileForm";
import Ready from "@/components/onboarding/ready";
import { WantSkillsForm } from "@/components/onboarding/wantSkills";
import Welcome from "@/components/onboarding/welcome";
import { useState } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { id: 2, label: "Profile Info" },
    { id: 3, label: "Skills You Can Offer" },
    { id: 4, label: "Skills You Want to Learn" },
  ];

  return (
    <div className="w-full h-[100dvh] flex flex-col lg:flex-row">
      {/* Left Panel with Chain Progress (Desktop Only) */}
      <div className="hidden lg:flex flex-col w-[400px] bg-white shadow-md p-10">
        <h1 className="text-3xl font-bold mb-8 font-interDisplayItalic text-black">
          SkillSwap
        </h1>

        <div className="relative flex flex-col items-start space-y-8">
          {steps.map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div key={s.id} className="flex items-center space-x-4 relative">
                {/* Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? "bg-black border-black text-white"
                      : isActive
                      ? "bg-white border-black text-black"
                      : "bg-gray-200 border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>

                {/* Label */}
                <span
                  className={`text-base font-interDisplayMid font-medium transition-colors ${
                    isActive || isCompleted ? "text-black" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-6 w-[2px] h-10 ${
                      isCompleted ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full  h-[100dvh] flex flex-col items-center bg-[#F9FAFB] p-6">
        {/* Progress bar (Mobile Only) */}
        <div className="w-full max-w-md flex gap-2 mb-6 lg:hidden">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                step >= i + 1 ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="w-full max-w-md flex-1 flex items-center justify-center">
          {step === 1 && <Welcome onNext={() => setStep(2)} />}
          {step === 2 && (
            <ProfileForm onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <OfferSkillsForm onNext={() => setStep(4)} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <WantSkillsForm onNext={() => setStep(5)} onBack={() => setStep(3)} />
          )}
          {step === 5 && (
            <Ready onNext={() => setStep(5)} onBack={() => setStep(4)} />
          )}
        </div>
      </div>
    </div>
  );
}
