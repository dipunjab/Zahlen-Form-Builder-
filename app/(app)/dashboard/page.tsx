"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Loading from "@/components/Loading";
import FormsTable from "@/components/FormsTable";

type Form = {
  _id: string;
  title: string;
  description?: string;
  cover?: string;
  logo?: string;
  color?: string;
  published: boolean;
  createdAt: string;
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {

    const fetchForms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/form?userId=${session?.user._id}`);
        const data = await res.json();
        if (data.success) setForms(data.forms);
      } catch (err) {
        console.error("Error fetching forms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [session]);

  if (status === "loading") {
    return <Loading message="Loading session..." />;
  }

  return (
    <>
      {/* Top Right Nav Buttons */}
      <div className="fixed top-0 right-0 flex gap-3 justify-center items-center p-4 z-10">
        <button className="flex gap-2 p-2">
          Search{" "}
          <Image
            src="/icons/search.png"
            alt="Search Icon"
            width={20}
            height={20}
          />
        </button>
        <Link href="/" className="p-2">
          <Image
            src="/icons/Group 3.png"
            alt="Home Icon"
            width={30}
            height={30}
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <Loading message="Loading forms..." />
        ) : forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <Image
              src="/images/zahlen.png"
              alt="No form Image"
              width={300}
              height={200}
              className="max-w-full h-auto"
            />

            <h2 className="text-[#868080] text-xl md:text-2xl mt-6">
              Whoa! Your dashboard is feeling a little lonely…
            </h2>

            <p className="text-[#868080] text-base md:text-lg mt-2 max-w-xl">
              No forms here… yet! Imagine all the awesome forms you could
              create. Click below and let the form magic begin!
            </p>

            <Button className="bg-[var(--app-color)] text-black font-semibold mt-6 px-6 py-4 text-sm md:text-base">
              <Plus className="mr-2" />
              <Link href="/form/createform">Create Form</Link>
            </Button>
          </div>
        ) : (
          <FormsTable forms={forms} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
