"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage(""); // Clear message on submission
    setLoading(true);
    try {
      const storedOtp = localStorage.getItem("signupOtp");
      if (otp !== storedOtp) {
        setError("Invalid OTP");
        setLoading(false);
        return;
      }
      // OTP is valid, create user
      const user = JSON.parse(localStorage.getItem("signupUser"));
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, isVerified: true }),
      });
      let data;
      if (res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("Server error: " + text);
      }
      if (!res.ok || !data.success)
        throw new Error(data.message || "Signup failed");
      setMessage("Signup successful! Redirecting to sign in...");
      localStorage.removeItem("signupOtp");
      localStorage.removeItem("signupUser");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setError("");
    setMessage(""); // Clear message on resend
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("signupUser"));
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      let data;
      if (res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("Server error: " + text);
      }
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to resend OTP");
      localStorage.setItem("signupOtp", data.otp);
      setMessage("OTP resent!");
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
          Verify OTP
        </h2>
        <Input
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={handleChange}
          maxLength={6}
          required
          className="tracking-widest text-center text-lg focus:border-gray-900 focus:ring-gray-900"
        />
        <Button
          type="submit"
          className="w-full py-2.5 font-semibold rounded-lg shadow-md transition duration-200 bg-gray-900 text-white hover:bg-black"
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
        <div className="text-center text-sm text-gray-700 mt-4">
          Didn&apos;t get the code?{" "}
          <a
            href="#"
            onClick={handleResend}
            className="text-gray-900 hover:underline font-medium"
          >
            Resend OTP
          </a>
        </div>
        {error && (
          <div className="text-center text-red-600 bg-gray-100 p-3 rounded-lg border border-gray-300 mt-4">
            {error}
          </div>
        )}
        {message && (
          <div className="text-center text-gray-900 bg-gray-100 p-3 rounded-lg border border-gray-300 mt-4">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
