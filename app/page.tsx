"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BarChart3, 
  FileText, 
  Users, 
  Zap, 
  Shield, 
  Download,
  Github,
  Linkedin
} from "lucide-react";

const Home = () => {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/images/logo.png" 
              alt="Zahlen Logo" 
              width={40} 
              height={40} 
            />
            <span className="text-2xl font-bold text-gray-900">Zählen</span>
          </div>
          
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session?.user ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-[#FFBF00]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FFBF00] flex items-center justify-center text-black font-semibold">
                    {session.user.name?.[0] || session.user.email?.[0] || "U"}
                  </div>
                )}
                <span className="hidden sm:block text-gray-700">Dashboard</span>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-black font-semibold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                Build Forms 
                <span className="block text-[#FFBF00]">That Actually</span>
                <span className="block">Work</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Create beautiful, responsive forms in minutes. Collect responses, analyze data, 
                and grow your business with our intuitive form builder.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={session ? "/dashboard" : "/sign-up"}>
                <Button className="bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-black font-semibold text-lg px-8 py-6 rounded-full flex items-center gap-2">
                  {session ? "Go to Dashboard" : "Start Building"}
                  <ArrowRight size={20} />
                </Button>
              </Link>
              
              <Link href="/getting-started">
                <Button variant="outline" className="border-2 border-gray-300 text-lg px-8 py-6 rounded-full hover:border-[#FFBF00] hover:text-[#FFBF00]">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFBF00]/20 to-orange-300/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-8 bg-[#FFBF00]/20 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-8 bg-[#FFBF00]/20 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-[#FFBF00] rounded flex-1 flex items-center justify-center">
                      <span className="text-black text-sm font-semibold">Submit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-16 h-16 bg-[#FFBF00]/20 rounded-full blur-sm animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-orange-300/20 rounded-full blur-md animate-pulse hidden lg:block"></div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to build amazing forms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From simple contact forms to complex surveys, Zählen has all the tools 
              you need to collect and manage responses effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#FFBF00]/10 to-orange-100/10 border border-[#FFBF00]/20">
              <div className="w-12 h-12 bg-[#FFBF00] rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Form Builder</h3>
              <p className="text-gray-600">
                Drag and drop interface with multiple field types. Create professional forms in minutes without coding.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">
                Track responses in real-time with detailed analytics and insights to understand your data better.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Share forms with your team, manage responses together, and collaborate seamlessly.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Built for speed and performance. Your forms load instantly and work perfectly on all devices.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security with SSL encryption. Your data is safe and always backed up.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <Download className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export & Integrate</h3>
              <p className="text-gray-600">
                Export responses to CSV, Excel, or integrate with your favorite tools via API.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Zählen Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFBF00] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Form</h3>
              <p className="text-gray-600">
                Use our intuitive drag-and-drop builder to create your perfect form in minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFBF00] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share & Collect</h3>
              <p className="text-gray-600">
                Share your form via link, embed it on your website, or send it directly to respondents.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFBF00] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyze Results</h3>
              <p className="text-gray-600">
                View responses in real-time, analyze data with built-in tools, and export when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-[#FFBF00] to-orange-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Ready to build your first form?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Join thousands of users who trust Zählen for their form building needs.
          </p>
          
          <Link href={session ? "/dashboard" : "/sign-up"}>
            <Button className="bg-black hover:bg-gray-800 text-white font-semibold text-lg px-8 py-6 rounded-full">
              {session ? "Go to Dashboard" : "Get Started Free"}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Image 
              src="/images/logo.png" 
              alt="Zahlen Logo" 
              width={32} 
              height={32} 
            />
            <span className="text-xl font-bold">Zählen</span>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="https://github.com/dipunjab/Zahlen-Form-Builder-" 
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={24} />
            </Link>
            <Link 
              href="https://www.linkedin.com/in/usmanghani-js/" 
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </Link>
          </div>

          <div className="text-sm text-gray-400 mt-4 md:mt-0">
            © 2025 Zählen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;