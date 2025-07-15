import { getTranscript } from "../../../test";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    const transcript = await getTranscript(videoId, 'en');
    const formattedTranscript = transcript.map((item) => ({
      text: item.text || "",
    }));
    return NextResponse.json(formattedTranscript);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
