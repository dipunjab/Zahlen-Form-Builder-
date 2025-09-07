"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Settings,
  Trash2,
  MessageSquare,
  Plus,
  Info,
  User,
} from "lucide-react";
import Link from "next/link";
import { Form } from "@/types/form";
import SidebarWorkspace from "./subSideBarComp/SidebarWorkspace";

const SIDEBAR_WIDTH = "w-56";


const SideBar: React.FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [forms, setForms] = useState<Form[]>([]);


  useEffect(() => {
    if (!session?.user?._id) return;

    const fetchForms = async () => {
      try {
        const res = await fetch(`/api/form?userId=${session.user._id}`);
        const data = await res.json();
        if (data.success) {
          setForms(data.forms);
        }
      } catch (error) {
        console.error("Failed to fetch forms:", error);
      }
    };

    fetchForms();
  }, [session]);



  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const avatarSrc = session?.user?.image || "/icons/Group 3.png";



  return (
    <div className="fixed z-10">
      <button
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        className={` ${isOpen ? "hidden" : ""} lg:hidden fixed top-3 left-3 z-[60] bg-[#FFBF00] p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBF00]`}
      >
        <div className="w-5 h-4 relative">
          <span
            className={`block absolute left-0 right-0 h-[2px] bg-black transform transition-all duration-200 ${isOpen ? "rotate-45 top-1.5" : "top-0"
              }`}
          />
          <span
            className={`block absolute left-0 right-0 h-[2px] bg-black transform transition-all duration-200 ${isOpen ? "opacity-0" : "top-1.5"
              }`}
          />
          <span
            className={`block absolute left-0 right-0 h-[2px] bg-black transform transition-all duration-200 ${isOpen ? "-rotate-45 top-1.5" : "top-3"
              }`}
          />
        </div>
      </button>

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <aside
        aria-label="Main sidebar"
        className={`fixed top-0 left-0 h-screen z-50 border-r-4 border-[#FFBF00] ${SIDEBAR_WIDTH}
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-screen
          bg-[#FFBF00] lg:bg-white text-black`}
      >
        <div className="flex flex-col h-full gap-3 px-3 py-3">
          <div className="flex flex-col gap-2">
            <div className="mb-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border flex-shrink-0">
                  <Image
                    src={avatarSrc}
                    alt={session?.user?.name || "User"}
                    width={36}
                    height={36}
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-4 truncate">
                    {session?.user?.name || "User"}
                  </p>
                </div>

                <div
                  className="p-1 rounded hover:bg-gray-200 cursor-pointer transition"
                  title="Account info"
                >
                  <div className="w-4 h-4 relative">
                    <User size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav>
              <ul className="flex flex-col gap-1">
                <li>
                  <a
                    href="/dashboard"
                    className="group flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 hover:translate-x-1 transition-transform transform cursor-pointer text-sm"
                    title="Dashboard"
                  >
                    <div className="w-4 h-4 relative flex-shrink-0">
                      <Image src="/icons/Group 3.png" alt="dashboard" width={16} height={16} />
                    </div>
                    <span>Dashboard</span>
                  </a>
                </li>

                <li>
                  <a
                    href="/settings"
                    className="group flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 transition-transform transform cursor-pointer text-sm"
                    title="Settings"
                  >
                    <span className="inline-block transition-transform duration-300 group-hover:rotate-90">
                      <Settings size={14} />
                    </span>
                    <span>Settings</span>
                  </a>
                </li>

                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-1 w-full text-left flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 transition cursor-pointer text-sm"
                    title="Logout"
                  >
                    <Trash2 size={14} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Workspace header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Image src="/icons/workspace.png" alt="info" width={18} height={18} />
                <span>Workspace</span>
              </div>
              <Link href="/form/createform" aria-label="Create form">
                <button className="p-1 rounded hover:bg-gray-100 transition cursor-pointer">
                  <Plus size={14} />
                </button>
              </Link>
            </div>

            {/* Forms (compact) */}
            <SidebarWorkspace forms={forms} setForms={setForms} />

          </div>


          <div className="flex flex-col gap-2">
            <div className="font-semibold text-sm">Product</div>
            <div className="flex flex-col gap-1">
              <Link href="/submit-feedback" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition cursor-pointer text-sm">
                <MessageSquare size={14} /> Feedback
              </Link>
            </div>

            <div className="mt-1 font-semibold text-sm">Help</div>
            <div className="flex flex-col gap-1">
              <Link href="/getting-started" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition cursor-pointer text-sm">
                <div className="w-4 h-4 relative">
                  <Image src="/icons/Arrowbold.png" alt="info" width={18} height={18} />
                </div>
                Getting Started
              </Link>
              <Link href="/contact-us" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition cursor-pointer text-sm">
                <Info size={14} /> Contact Support
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
