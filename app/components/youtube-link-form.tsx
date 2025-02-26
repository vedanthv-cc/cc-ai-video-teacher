"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function YouTubeLinkForm() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const videoId = extractVideoId(youtubeLink);
    if (videoId) {
      const encodedName = encodeURIComponent(userName.trim() || "Guest");
      router.push(`/video/${videoId}?name=${encodedName}`);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const extractVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">
          Start Learning
        </h2>
        <p className="text-gray-400 text-center">
          Enter your name and a YouTube video link to begin
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="youtube-link"
            className="block text-sm font-medium text-gray-100"
          >
            YouTube Video Link
          </label>
          <input
            type="url"
            id="youtube-link"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-100"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="John Doe"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
        >
          Load Video
        </button>
      </form>
    </div>
  );
}
