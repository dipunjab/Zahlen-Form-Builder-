"use client";

import { useState } from "react";
import { Smile, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

const FeedbackPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast("Feedback cannot be empty! 🤔");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/u/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      toast("Thanks for your feedback! 🎉");

      setMessage("");
    } catch (err: any) {
      toast("Failed to submit feedback");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-20 px-4 md:px-0 md:ml-40 font-sans"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >

      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#FFBF00] flex items-center justify-center gap-2">
          <Smile size={48} /> Got Opinions? Let’s Hear ‘Em!
        </h1>
        <p className="text-gray-700 text-lg mt-2">
          Your feedback fuels our coffee and our code ☕💻
        </p>
      </div>

      <form
        className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <label className="font-semibold text-gray-700">Your Feedback</label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#FFBF00]"
          rows={5}
          placeholder="Type your awesome feedback here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#FFBF00] text-white font-bold py-2 px-4 rounded hover:brightness-110 transition"
        >
          <ThumbsUp size={20} /> {loading ? "Sending..." : "Send Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
