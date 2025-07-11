"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // State for success messages
  const router = useRouter();

  // Effect to clear messages after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // Message disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage(""); // Clear message on submission
    if (form.password !== form.repassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      let data;
      if (res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("Server error: " + text);
      }
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to send OTP");
      setMessage("OTP sent successfully! Please check your email."); // Success message
      // Store user info and OTP in localStorage for verification step
      localStorage.setItem("signupUser", JSON.stringify(form));
      localStorage.setItem("signupOtp", data.otp);
      router.push("/verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md space-y-6 transform transition-all duration-300 ease-in-out hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
          Sign Up
        </h2>
        <Input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={togglePassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <div className="relative">
          <Input
            name="repassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.repassword}
            onChange={handleChange}
            required
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center bg-gray-100 p-3 rounded-lg border border-gray-300">
            {error}
          </div>
        )}
        {message && (
          <div className="text-gray-900 text-sm text-center bg-gray-100 p-3 rounded-lg border border-gray-300">
            {message}
          </div>
        )}
        <Button
          type="submit"
          className="w-full py-2.5 font-semibold rounded-lg shadow-md transition duration-200 bg-gray-900 text-white hover:bg-black"
        >
          {loading ? "Sending OTP..." : "Sign Up"}
        </Button>
        <div className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-gray-900 hover:underline font-medium"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
