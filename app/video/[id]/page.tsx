"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import YouTubePlayer, {
  type YouTubePlayerHandle,
} from "@/app/components/youtube-player";
import TranscriptionArea from "@/app/components/transcription-area";
import { Conversation } from "@/app/components/conversation";
import { motion } from "framer-motion";

export default function VideoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const params = useParams();
  const searchParams = useSearchParams();

  const videoId = params.id as string;
  const name = searchParams.get("name");
  const userName = decodeURIComponent(name || "Guest");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <header className="py-6 px-4 md:px-8 lg:px-12 backdrop-blur-md bg-white/10 fixed top-0 left-0 right-0 z-20">
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Code Craft's AI Teacher
          </h1>
        </header>

        <main className="pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
              Welcome, {userName}
            </h2>
            <p className="text-xl text-gray-300">
              Your personalized learning experience awaits.
            </p>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-2"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg bg-white/10">
                <YouTubePlayer ref={playerRef} videoId={videoId} />
              </div>
            </motion.div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-2xl"
              >
                <Conversation
                  name={userName}
                  videoId={videoId}
                  playerRef={playerRef}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-2xl"
              >
                <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Transcription
                </h3>
                <TranscriptionArea videoId={videoId} />
              </motion.div>
            </div>
          </div>
        </main>

        <footer className="py-6 px-4 md:px-8 lg:px-12 text-center text-gray-400 backdrop-blur-md bg-white/10">
          <p>&copy; 2023 Code Craft. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
