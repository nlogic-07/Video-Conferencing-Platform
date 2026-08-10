import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [meetingCode, setMeetingCode] = useState("");
  const navigate = useNavigate();

  const handleJoinVideoCall = () => {
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="text-xl font-bold tracking-tight">
          🎥 <span className="text-indigo-400">VidSync</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-white/20 rounded-lg text-slate-300 hover:text-white hover:border-white/40 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.05 13A9 9 0 1 0 6 5.3L3 8"
              />
            </svg>
            History
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-32 gap-6">
        <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
          Welcome back
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl">
          Providing quality video calls,{" "}
        </h1>

        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          Enter a meeting code below to jump into your next session — fast,
          reliable, and friction-free.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md">
          <input
            onChange={(e) => setMeetingCode(e.target.value)}
            value={meetingCode}
            type="text"
            placeholder="Meeting Code"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
          <button
            onClick={handleJoinVideoCall}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-colors whitespace-nowrap"
          >
            Join
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-slate-500 text-sm">
        © 2026 VidSync · Privacy · Terms
      </footer>
    </div>
  );
}
