"use client"

// app/layout.tsx
import "../globals.css";
import SideBar from "@/components/SideBar";


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
    );
}
