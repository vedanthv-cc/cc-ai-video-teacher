"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useEffect, useState } from "react";
import { Hand, Laugh, Loader2 } from "lucide-react";
import { YouTubePlayerHandle } from "./youtube-player";

interface ConversationProps {
  name: string;
  videoId: string;
  playerRef?: React.RefObject<YouTubePlayerHandle | null>;
}

export function Conversation({ name, videoId, playerRef }: ConversationProps) {
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected");
      setError(null);
    },
    onDisconnect: () => {
      console.log("Disconnected");
      setError(null);
    },
    onMessage: (message: any) => console.log("Message:", message),
    onError: (error: any) => {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    },
  });

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/transcript?videoId=${videoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch transcript");
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          const fullTranscript = data
            .map((item: { text: string }) => item.text)
            .join(" ");
          setTranscription(fullTranscript);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError("Failed to fetch transcript. Please try again.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  const raiseHand = useCallback(() => {
    setError(null);
    if (playerRef?.current) {
      playerRef.current.pauseVideo();
    }
    if (conversation.status !== "disconnected") {
      console.warn(
        "Conversation is already in progress or not properly disconnected."
      );
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        return conversation.startSession({
          agentId: process.env.NEXT_PUBLIC_AGENT_ID,
          dynamicVariables: {
            student_name: name,
            transcription: transcription,
          },
        });
      })
      .catch((error) => {
        console.error("Failed to start conversation:", error);
        setError("Failed to start conversation. Please try again.");
        if (playerRef?.current) {
          playerRef.current.playVideo();
        }
      });
  }, [conversation, name, transcription, playerRef]);

  const clearDoubt = useCallback(() => {
    setError(null);
    if (playerRef?.current) {
      playerRef.current.playVideo();
    }
    if (conversation.status !== "connected") {
      console.warn("No active conversation to stop.");
      return;
    }
    conversation.endSession().catch((error) => {
      console.error("Failed to stop conversation:", error);
      setError("Failed to stop conversation. Please try again.");
    });
  }, [conversation, playerRef]);

  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout;
    if (conversation.status === "connected") {
      heartbeatInterval = setInterval(() => {
        // Implement a method to keep the connection alive if necessary
      }, 15000);
    }
    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
  }, [conversation.status]);

  return (
    <div className="w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        Your Personalized AI Teacher
      </h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={raiseHand}
          disabled={conversation.status !== "disconnected" || isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <Hand className="w-5 h-5" />
          Raise Hand
        </button>
        <button
          onClick={clearDoubt}
          disabled={conversation.status !== "connected"}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-green-600 active:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <Laugh className="w-5 h-5" />
          Got it
        </button>
      </div>
      <div className="mt-6 text-center">
        <p className="flex items-center justify-center gap-2 text-gray-300 font-medium">
          Status:
          <span
            className={`font-semibold ${
              conversation.status === "connected"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {conversation.status.charAt(0).toUpperCase() +
              conversation.status.slice(1)}
          </span>
        </p>
        {error && (
          <p className="text-red-500 mt-2 bg-red-100/10 p-2 rounded-lg">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="flex items-center justify-center gap-2 mt-2 text-yellow-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading AI Teacher...
          </p>
        ) : (
          <p className="text-green-400 mt-2">AI Teacher loaded</p>
        )}
      </div>
    </div>
  );
}
