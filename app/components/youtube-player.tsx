"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import YouTube from "react-youtube";

export interface YouTubePlayerHandle {
  pauseVideo: () => void;
  playVideo: () => void;
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, { videoId: string }>(
  ({ videoId }, ref) => {
    const [player, setPlayer] = useState<any>(null);

    useImperativeHandle(ref, () => ({
      pauseVideo: () => player?.pauseVideo(),
      playVideo: () => player?.playVideo(),
    }));

    return (
      <div className="aspect-video w-full flex items-center justify-center bg-black/50">
        <YouTube
          videoId={videoId}
          onReady={(e) => setPlayer(e.target)}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
            },
          }}
          className="w-full aspect-video"
          iframeClassName="w-full h-full"
        />
      </div>
    );
  }
);

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
