import React from "react";

import { useState } from "react";

export default function Authentication() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:9000/login"
      : "http://localhost:9000/register";

    const payload = isLogin
      ? { username, password }
      : { name, username, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Success:", data);

        if (isLogin) {
          localStorage.setItem("token", data.jwtToken);
        }
      } else {
        console.log("Error:", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-linear-to-br from-indigo-600/30 to-slate-900">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-indigo-400">VidSync</span>
          </h1>
          <p className="text-slate-300">
            Connect instantly with high-quality video calls. No installs, no
            hassle.
          </p>

          <img
            src="https://illustrations.popsy.co/gray/video-call.svg"
            alt="Video Conferencing"
            className="mt-8 w-full max-w-md mx-auto opacity-90"
          />
        </div>
      </div>

      {/* RIGHT SIDE*/}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          {/* Toggle */}
          <div className="flex mb-6 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${
                isLogin ? "bg-indigo-600" : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${
                !isLogin ? "bg-indigo-600" : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Welcome back " : "Create your account "}
          </h2>

          {/* FORM */}
          <form className="flex flex-col gap-4">
            {/* Signup only field */}
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-indigo-500"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            )}

            <input
              type="text"
              placeholder="username"
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-indigo-500"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-indigo-500"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            {/* Submit */}
            <button className="mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition">
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          {/* Switch text */}
          <p className="text-sm text-slate-400 mt-6 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 ml-2 cursor-pointer hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
