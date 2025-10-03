"use client";

import RightSidebar from "@/components/dashboard/rightBar";
import { Sidebar } from "@/components/dashboard/sideBar";
import { TopBar } from "@/components/dashboard/topBar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUser } from '@supabase/auth-helpers-react';

const pageTitles: Record<string, string> = {
  overview: "Overview",
  skills: "My Skills",
  matches: "Matches",
  messages: "Message",
  profile: "Profile",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
   const user = useUser();
const showRightSidebar = !pathname.startsWith('/dashboard/message');


  const currentUserId = user?.id || ''; // or handle null user case

const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [currentPage, setCurrentPage] = useState("overview");
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="flex md:flex-row flex-col h-screen">
        {/* Sidebar */}
        <Sidebar 
        isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Top Navigation */}
           {showRightSidebar && (
          <TopBar 
           pageTitle={pageTitles[currentPage] || "Overview"} 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
           )}

          {/* Dynamic Page Content */}
          <main className="flex-1 overflow-hidden ">{children}</main>
        </div>

        {showRightSidebar && (
        <RightSidebar
          userId={currentUserId}
          isChatExpanded={isChatExpanded}
          setIsChatExpanded={setIsChatExpanded}
        />
      )}
      </div>
    </div>
  );
}
