import React from "react";
import { Link } from "react-router-dom";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="text-xl font-bold tracking-tight">
          🎥 <span className="text-indigo-400">VidSync</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="">
            <button className="px-4 py-2 text-sm border border-white/20 rounded-lg text-slate-300 hover:text-white hover:border-white/40 transition-colors">
              Join as Guest
            </button>
          </Link>
          <Link to="/auth">
            <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
              Log in
            </button>
          </Link>

          <Link to="/auth">
            <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-medium">
              Sign up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 gap-6">
        <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">
          Free during beta
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-2xl">
          Video calls that <span className="text-indigo-400">just work</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          Crystal-clear video meetings for teams of all sizes. No downloads, no
          friction — just click and connect.
        </p>

        <div className="flex gap-3 mt-2">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-colors">
            Start for free
          </button>
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-colors">
            See how it works
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 pb-28">
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-3xl max-w-xl mx-auto py-12 px-8">
          <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-slate-400 mb-6">
            Free forever for small teams. No credit card needed.
          </p>
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-colors">
            Create free account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-slate-500 text-sm">
        © 2026 VidSync · Privacy · Terms
      </footer>
    </div>
  );
}
