import { ClientType, Innertube } from 'youtubei.js/web';

export async function getTranscript(videoId = 'e8krKpuaby8', lang = 'en') {
  try {
    // Suppress console warnings from youtubei.js
    const originalConsoleError = console.error;
    console.error = () => {};
    
    const yt = await Innertube.create({
      client_type: ClientType.WEB,
      lang: lang,
      fetch: async (input, url) => {
        return fetch(input, url);
      },
    });
    
    const info = await yt.getInfo(videoId);
    const scriptInfo = await info.getTranscript();
    
    // Restore console.error
    console.error = originalConsoleError;
    
    if (!scriptInfo?.transcript?.content?.body?.initial_segments) {
      return [];
    }
    
    return scriptInfo.transcript.content.body.initial_segments
      .filter((segment) => segment.snippet.text && segment.snippet.text.trim() !== '')
      .map((segment) => ({
        text: segment.snippet.text,
        startMs: segment.start_ms,
        endMs: segment.end_ms,
      }));
  } catch (error) {
    console.error('Error getting transcript:', error);
    return [];
  }
}