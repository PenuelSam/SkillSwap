"use client";

import Link from "next/link";
import { BiMessage, BiX, BiLogOut, BiSearch } from "react-icons/bi";
import { BsPeople, BsPerson } from "react-icons/bs";
import { RiHome2Line } from "react-icons/ri";
import {MdBuild} from "react-icons/md";
import {GiSkills} from "react-icons/gi";
import { GiEnvelope } from "react-icons/gi";
import {AiOutlineUsergroupAdd} from "react-icons/ai";
import { FaStar, FaHandshake, FaRegStar } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

export const Sidebar = ({
  isOpen,
  setIsOpen,
  currentPage,
  setCurrentPage,
}: SidebarProps) => {
  const router = useRouter();

  const navigationItems = [
    { icon: RiHome2Line, label: "Home", key: "/" },
    { icon: BiSearch, label: "Explore", key: "/" },
    { icon: FaRegStar, label: "My Skills", key: "skills" },
    { icon: AiOutlineUsergroupAdd, label: "Matches", key: "matches" },
    { icon: HiOutlineEnvelope, label: "Messages", key: "message" },
    { icon: BsPerson, label: "Profile", key: "profile" },
  ];

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:top-0 bottom-0 right-0 left-0 z-50 md:h-full md:w-64 w-full bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        
        lg:static lg:z-auto
      `}
      >
        <div className="flex md:flex-col md:h-full">
          {/* Logo */}
          <div className="hidden md:flex items-center justify-between  h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-HelveticaBlack text-black">SkillSwap</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <BiX size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 md:py-4 flex md:flex-col ">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} href={`/dashboard/${item.key}`}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.key);
                      setIsOpen(false);
                    }}
                    className={`
                    w-full flex items-center px-3 py-2.5 text-sm font-HelveticaLight md:text-[16px] text-[20px] rounded-lg
                    transition-colors duration-200 cursor-pointer
                    ${
                      currentPage === item.key
                        ? "bg-gray-100 text-black"
                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                    }
                  `}
                  >
                    <Icon fontSize={30} className="mr-3 md:hidden" />
                    <Icon fontSize={28} className="mr-3 hidden md:inline" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Logout button at bottom */}
          <div className="px-4 py-4 hidden md:flex border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 cursor-pointer py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <BiLogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
