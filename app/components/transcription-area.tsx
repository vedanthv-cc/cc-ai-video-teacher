"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Loader from "./loader";

interface TranscriptItem {
  text: string;
}

export default function TranscriptionArea({ videoId }: { videoId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTranscript = async () => {
    if (!isExpanded && transcript.length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/transcript?videoId=${videoId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transcript");
        }
        const data = await response.json();
        setTranscript(data);
      } catch (err) {
        setError("Failed to load transcript. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-8">
      <button
        onClick={toggleTranscript}
        className="w-full flex items-center justify-between bg-gray-800 p-4 rounded-lg text-blue-400 hover:bg-gray-700 transition-colors duration-200"
      >
        <span className="text-xl font-bold">Transcription</span>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {isExpanded && (
        <div className="mt-4 bg-gray-800 p-6 rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="h-24">
              <Loader />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : transcript.length > 0 ? (
            transcript.map((item, index) => (
              <p key={index} className="mb-4 last:mb-0 text-gray-300">
                {item.text}
              </p>
            ))
          ) : (
            <p className="text-gray-300">
              No transcription available for this video.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
