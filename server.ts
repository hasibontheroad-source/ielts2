import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK with required aistudio-build header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// --- API Endpoints ---

// 1. IELTS Writing Evaluation with Thinking Mode (gemini-4-argon with ThinkingLevel.HIGH)
app.post('/api/gemini/score-writing', async (req: Request, res: Response) => {
  try {
    const { taskType, promptTitle, promptQuestion, essayText } = req.body;
    if (!essayText || typeof essayText !== 'string' || essayText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide a valid essay with at least 20 words.' });
    }

    const systemInstruction = `You are an elite, certified British Council & IDP Senior IELTS Academic Writing Examiner.
Evaluate the user's Academic IELTS essay strictly against the official IELTS 9-band descriptors:
1. Task Achievement / Task Response (TR)
2. Coherence and Cohesion (CC)
3. Lexical Resource (LR)
4. Grammatical Range and Accuracy (GRA)

Return a strictly valid JSON object with the following schema:
{
  "taskResponse": number (0.0 to 9.0 in 0.5 increments),
  "coherenceCohesion": number (0.0 to 9.0 in 0.5 increments),
  "lexicalResource": number (0.0 to 9.0 in 0.5 increments),
  "grammaticalRangeAccuracy": number (0.0 to 9.0 in 0.5 increments),
  "overallBand": number (0.0 to 9.0 in 0.5 increments),
  "wordCount": number,
  "summary": string,
  "criterionFeedback": {
    "tr": string,
    "cc": string,
    "lr": string,
    "gra": string
  },
  "strengths": string[],
  "areasForImprovement": string[],
  "vocabularyUpgrades": [
    { "original": string, "improved": string, "reason": string }
  ],
  "correctedModelParagraph": string
}`;

    const prompt = `Task Type: ${taskType || 'Task 2'}
Prompt: ${promptTitle || ''}
Question: ${promptQuestion || ''}

Candidate's Submission:
"""
${essayText}
"""

Evaluate this essay in depth. Follow the JSON schema strictly.`;

    let response;
    try {
      // First attempt with gemini-4-argon with ThinkingLevel.HIGH (No maxOutputTokens per instructions)
      response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
    } catch (modelError: any) {
      console.warn('gemini-4-argon fallback to gemini-3.8-flash:', modelError?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
    }

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Writing scoring error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to score essay.' });
  }
});

// 2. IELTS Speaking Evaluation
app.post('/api/gemini/score-speaking', async (req: Request, res: Response) => {
  try {
    const { topic, partNumber, transcript } = req.body;
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'Valid speech transcript is required.' });
    }

    const systemInstruction = `You are a certified IELTS Speaking Examiner. Evaluate the candidate's spoken response transcript strictly according to the official IELTS Speaking Band Descriptors:
1. Fluency and Coherence (FC)
2. Lexical Resource (LR)
3. Grammatical Range and Accuracy (GRA)
4. Pronunciation & Delivery (estimated based on phonological phrasing and idiomatic naturalness)

Return valid JSON:
{
  "fluencyCoherence": number,
  "lexicalResource": number,
  "grammaticalRangeAccuracy": number,
  "pronunciation": number,
  "overallBand": number,
  "feedback": string,
  "keyStrengths": string[],
  "corrections": [
    { "said": string, "suggested": string, "explanation": string }
  ],
  "modelBand9Answer": string
}`;

    const prompt = `Part: ${partNumber || 2}
Topic: ${topic || 'General IELTS Speaking'}
Candidate's Spoken Transcript:
"""
${transcript}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Speaking scoring error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to score speaking response.' });
  }
});

// 3. Audio Transcription (gemini-3.5-transcribe)
app.post('/api/gemini/transcribe', async (req: Request, res: Response) => {
  try {
    const { base64Audio, mimeType = 'audio/webm' } = req.body;
    if (!base64Audio) {
      return res.status(400).json({ error: 'base64Audio is required' });
    }

    const cleanBase64 = base64Audio.replace(/^data:[^;]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: 'Transcribe this spoken response accurately, retaining natural hesitation markers, pauses, and grammatical structures for IELTS assessment.',
          },
        ],
      },
    });

    return res.json({ transcript: response.text || '' });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to transcribe audio' });
  }
});

// 4. Text-To-Speech (gemini-3.8-flash-tts / gemini-3.8-flash-lite-tts)
app.post('/api/gemini/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Puck', style = 'British Council IELTS Examiner, formal and clear' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: String(text).slice(0, 1500),
                speechMetadata: {
                  style,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });
    } catch (ttsErr: any) {
      console.warn('Falling back to gemini-3.8-flash-lite-tts:', ttsErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: String(text).slice(0, 1500) }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
    }

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio data generated' });
    }

    return res.json({ audioBase64: base64Audio, format: 'audio/wav' });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});

// 5. Search Grounding for Real-Time Exam Intel (gemini-3.8-flash with googleSearch)
app.post('/api/gemini/search-trends', async (req: Request, res: Response) => {
  try {
    const { query = 'latest IELTS Academic exam questions 2024 2025 speaking cue cards writing task 2 topics' } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Search for verified and recent IELTS Academic exam intelligence: ${query}.
Synthesize:
1. Recent exam topics reported by test-takers across Writing Task 1 & 2
2. Current quarter Speaking cue card trends
3. Scoring shifts or Cambridge updates
Provide sources and clean bullet points.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const text = response.text || '';
    const groundingMetadata = candidate?.groundingMetadata;

    return res.json({
      content: text,
      sources: groundingMetadata?.groundingChunks || [],
      webSearchQueries: groundingMetadata?.webSearchQueries || [],
    });
  } catch (error: any) {
    console.error('Search grounding error:', error);
    return res.status(500).json({ error: error?.message || 'Search grounding failed' });
  }
});

// 6. Image Generation for Academic Visual Prompts (gemini-nano-banana-2.1 / gemini-3.1-flash-lite-image)
app.post('/api/gemini/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '16:9', imageSize = '1K' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let response;
    try {
      // First attempt with nano banana 2.1
      response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '16:9',
            imageSize: (imageSize as any) || '1K',
          },
        },
      });
    } catch (imgErr: any) {
      console.warn('Falling back to gemini-3.1-flash-lite-image:', imgErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });
    }

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image was returned from the model.' });
    }

    return res.json({ imageUrl, aspectRatio, imageSize });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate visual chart image' });
  }
});

// --- WebSocket Live API for Simulated IELTS Speaking Interview ---
const wss = new WebSocketServer({ server: httpServer, path: '/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to IELTS Examiner Live WebSocket');
  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction: `You are an official British Council Cambridge IELTS Speaking Examiner conducting a real-time spoken exam.
Maintain a polite, formal, yet encouraging British or international examiner persona.
Follow standard IELTS Speaking protocols:
- Part 1: Greet the candidate, check identification, ask 3-4 warm-up questions on familiar topics.
- Part 2: Introduce the cue card topic clearly.
- Part 3: Discuss abstract concepts and follow-up opinions.
Keep your spoken responses concise (15 to 30 seconds max) to give the candidate maximum speaking time. Speak naturally.`,
      },
      callbacks: {
        onmessage: (message: any) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Error forwarding audio to Live API:', err);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try {
          session.close();
        } catch (_) {}
      }
    });
  } catch (liveErr: any) {
    console.error('Failed to initialize Live API session:', liveErr?.message);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: 'Live API connection error. Standard audio recording available.' }));
    }
  }
});

// --- Vite Middleware Integration ---
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`IELTS Ready server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
