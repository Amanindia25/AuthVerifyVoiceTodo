import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function Speaker({ text }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech Synthesis not supported");
      return;
    }
    if (!text) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`ml-2 p-2 rounded-full border ${
        speaking ? "bg-blue-100" : "bg-gray-100"
      } transition`}
      title="Listen"
    >
      {speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
