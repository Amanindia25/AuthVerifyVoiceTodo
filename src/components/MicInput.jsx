import React, { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

export default function MicInput({ onResult }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      if (onResult) onResult(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleMicClick}
      className={`ml-2 p-2 rounded-full border
        ${
          listening
            ? "bg-gray-900 text-white shadow-lg ring-2 ring-gray-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
        transition-all duration-200 ease-in-out
      `}
      title={listening ? "Stop Listening" : "Add by Voice"}
    >
      {listening ? (
        <Mic size={20} className="text-white" />
      ) : (
        <MicOff size={20} className="text-gray-700" />
      )}
    </button>
  );
}
