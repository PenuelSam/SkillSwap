import React from 'react'

function Welcome({ onNext }: { onNext: () => void }) {
    const handleClick = () => {
        onNext();
    }

  return (
    <div className="bg-white  shadow-md w-full  p-10 rounded-2xl space-y-4 flex flex-col items-center">
                <h1 className="font-interDisplayLight font-bold tracking-tight text-2xl md:text-3xl  text-gray-900 leading-snug">Welcome to SkillSwap</h1>
                 <p className="font-interDisplayLight text-base md:text-lg  leading-relaxed text-muted-foreground">Learn. Teach. Connect.</p>
                <button
                  onClick={handleClick}
                  className="mt-6 bg-black font-interDisplayLight cursor-pointer text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
                >
                  Get Started
                  
                </button>
    </div>
  )
}

export default Welcome
