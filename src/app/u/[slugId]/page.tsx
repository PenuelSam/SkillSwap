import MessageButton from "@/components/chat/messageButton";
import { supabaseDirect } from "@/lib/supabaseDirect";
import Image from "next/image";
import Link from "next/link";
import { IoArrowBack } from 'react-icons/io5';

type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  socials: Record<string, string> | null;
  about?: string | null;
};

type SkillPost = {
  id: string;
  title: string;
  type: "want" | "offer";
  tags: string[] | null;
};

// 👇 Ensure this route is always rendered fresh (no static cache)
export const dynamic = "force-dynamic";

// ✅ SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ slugId: string }>}) {
 const { slugId } = await params;

   // 💡 ADD THIS SAFETY CHECK
   if (!slugId || !slugId.includes('-')) {
     return {
       title: "Profile not found | SkillSwap",
        description: "This user profile does not exist on SkillSwap.",
      };
    }


   // ⭐️ NEW & CORRECT LOGIC ⭐️
 const parts = slugId.split("-");
 const slug = parts[0]; 
 const id = parts.slice(1).join("-"); // Takes all parts *after* the first one and joins them back
  const { data: profile } = await supabaseDirect
    .from("profiles")
    .select("display_name, bio, avatar_url")
    .eq("id", id)
    .single();

  if (!profile) {
    return {
      title: "Profile not found | SkillSwap",
      description: "This user profile does not exist on SkillSwap.",
    };
  }

  return {
    title: `${profile.display_name} | SkillSwap`,
    description: profile.bio || "View this user's skills and interests on SkillSwap.",
    openGraph: {
      title: `${profile.display_name} | SkillSwap`,
      description: profile.bio || "",
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: {
      card: "summary",
      title: `${profile.display_name} | SkillSwap`,
      description: profile.bio || "",
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

// ✅ Main page
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slugId: string }>;
}) {
 const { slugId } = await params;

 console.log("slugId:", slugId);

 // 💡 ADD THIS SAFETY CHECK
    if (!slugId || !slugId.includes('-')) {
        return <p className="text-center">Profile not found or invalid URL.</p>;
    }
    
   // ⭐️ NEW & CORRECT LOGIC ⭐️
 const parts = slugId.split("-");
 const slug = parts[0]; 
 const id = parts.slice(1).join("-"); // Takes all parts *after* the first one and joins them back

   console.log("Extracted ID & slug:", slug, id);

  // Fetch profile
  const { data: profile, error } = await supabaseDirect
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Fetched profile:", profile, "Error:", error);

  if (!profile) {
    return <p className="text-center">Profile not found.</p>;
  }

  // Fetch skills
  const { data: skillsData } = await supabaseDirect
    .from("skill_posts")
    .select("*")
    .eq("user_id", id);

  const skills = skillsData || [];
  const wants = skills.filter((s) => s.type === "want");
  const offers = skills.filter((s) => s.type === "offer");

  return (
  <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center   p-4">
    {/* Back Button */}
    <div className="w-full max-w-4xl mx-auto flex justify-start mb-4">
      <button
        // onClick={() => window.history.back()}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        <IoArrowBack size={24} />
      </button>
    </div>
    {/* Profile Card */}
   <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-start gap-6">
           {/* Avatar */}
           <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
             {profile.avatar_url ? (
               <Image
                 src={profile.avatar_url}
                 alt={profile.display_name || "User Avatar"}
                  width={100}
                  height={100}
                 className="w-full h-full object-cover"
                 unoptimized={true}
               />
             ) : (
               <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                 No Image
               </div>
             )}
           </div>
   
           {/* Info */}
           <div className="flex-1">
             <h1 className="md:text-[36px] text-[28px] tracking-tight font-HelveticaBold">
               {profile.display_name || "Anonymous"}
             </h1>
             <p className="md:text-[18px] text-[16px] font-HelveticaLight">
               @{profile.display_name}
             </p>
             <p className="md:text-[18px] text-[16px] font-HelveticaLight">
               {profile.bio}
             </p>
             <p className="md:text-[18px] text-[16px] font-HelveticaLight">
               {profile.location}
             </p>
   
             {/* Current Role Pill */}
             <span className="inline-block mt-3 px-3 py-1 rounded-full bg-gray-100 text-sm font-HelveticaLight">
               Software Engineer
             </span>
           </div>
   
           {/* Actions */}
          {/* Add Send Message button */}
          <MessageButton profileId={profile.id} />
         </div>

    {/* Activity */}
    <div className="w-full max-w-4xl mx-auto mt-5 bg-white p-6 rounded-xl shadow flex justify-around text-center">
      <div>
        <p className="text-2xl font-HelveticaBold">{offers.length}</p>
        <p className="text-sm font-HelveticaLight text-gray-500">Skills Offered</p>
      </div>
      <div>
        <p className="text-2xl font-HelveticaBold">{wants.length}</p>
        <p className="text-sm font-HelveticaLight text-gray-500">Skills Wanted</p>
      </div>
      <div>
        <p className="text-2xl font-HelveticaBold">{skills.length}</p>
        <p className="text-sm font-HelveticaLight text-gray-500">Total Posts</p>
      </div>
    </div>

    {/* About & Socials */}
    <div className="w-full max-w-4xl mx-auto mt-5 grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="md:text-[28px] text-[20px] tracking-tight font-HelveticaBold border-b-2 border-gray-200 pb-2">
          About
        </h2>
        <p className="md:text-[18px] text-[16px] font-HelveticaLight mt-4">
          {profile.about || profile.bio || "No about info provided."}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="md:text-[28px] text-[20px] font-HelveticaBold border-b-2 border-gray-200 pb-2">
          Socials
        </h2>
        <div className="flex gap-4 mt-4">
          {profile.socials?.linkedin && (
            <a href={profile.socials.linkedin} className="text-blue-600">
              LinkedIn
            </a>
          )}
          {profile.socials?.twitter && (
            <a href={profile.socials.twitter} className="text-blue-400">
              Twitter
            </a>
          )}
        </div>
      </div>
    </div>

    {/* Skills */}
    <div className="w-full max-w-4xl mx-auto mt-5 grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="md:text-[28px] text-[20px] font-HelveticaBold border-b-2 border-gray-200 pb-2">
          Skills to Teach
        </h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {offers.flatMap((s) => s.tags || []).map((tag) => (
            <span
              key={tag}
              className="md:text-[14px] text-[12px] font-HelveticaLight px-3 py-1 rounded-full border text-gray-700 bg-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="md:text-[28px] text-[20px] font-HelveticaBold border-b-2 border-gray-200 pb-2">
          Skills to Learn
        </h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {wants.flatMap((s) => s.tags || []).map((tag) => (
            <span
              key={tag}
              className="md:text-[14px] text-[12px] font-HelveticaLight px-3 py-1 rounded-full border text-gray-700 bg-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}
