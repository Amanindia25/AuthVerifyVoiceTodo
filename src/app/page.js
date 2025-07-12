"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/todo");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4 sm:p-8 lg:p-12 overflow-x-hidden">
      <h1 className="text-sm sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-down px-2 w-full break-words">
        Welcome to AuthVerifyVoiceTodo!
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mb-10 leading-relaxed animate-fade-in-up px-4">
        This is a powerful Todo application designed to make your task
        management intuitive and efficient. You can easily add your todos using
        voice commands, listen to your tasks, mark them as complete, and
        organize your daily activities with ease.
      </p>
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md space-y-5 animate-fade-in-up delay-100 px-4">
        <Button
          onClick={handleStart}
          className="w-full py-3 sm:py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out bg-gray-900 text-white hover:bg-black"
        >
          Tap here to add Todo
        </Button>
      </div>
    </div>
  );
}
