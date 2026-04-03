export type Level = "easy" | "medium" | "hard";
export type ProgressLevel = {
  level: Level;
  completedTopics: number;
  isLocked: boolean;
};

const api = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`/api/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await res.json().catch(() => ({}));
      const message =
        payload?.detail || payload?.error || `Request failed: ${res.status}`;
      throw new Error(message);
    }
    const errorText = await res.text();
    throw new Error(errorText || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  return (await res.text()) as T;
};

export const levelFromQuery = (value: string | null): Level => {
  if (value === "2") return "medium";
  if (value === "3") return "hard";
  return "easy";
};

export const generateTopic = (payload: {
  grade: number;
  level: Level;
  wordCount?: number;
  sentenceCount?: number;
  topic?: string;
}) =>
  api<{ sentences: string[] }>("topic", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getTopics = (grade: number, level: Level) =>
  api<{ grade: number; level: Level; topics: string[] }>(
    `topics?grade=${grade}&level=${level}`,
  );

export const generateAudio = async (text: string) => {
  const res = await fetch(`/api/audio-generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await res.json().catch(() => ({}));
      const message =
        payload?.detail || payload?.error || `Request failed: ${res.status}`;
      throw new Error(message);
    }

    const textError = await res.text();
    throw new Error(textError || `Request failed: ${res.status}`);
  }

  return res.blob();
};

export const spellcheck = (text: string) =>
  api<{
    originalText: string;
    incorrectWords?: string[];
    errors?: number;
    score?: number;
    hasErrors?: boolean;
    correctedText?: string;
  }>("spellcheck", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

export const getLeaderboard = () =>
  api<{
    topThree: {
      gold: { id: string; name: string; avatarUrl: string | null; score: number } | null;
      silver: { id: string; name: string; avatarUrl: string | null; score: number } | null;
      bronze: { id: string; name: string; avatarUrl: string | null; score: number } | null;
    };
    others: Array<{ id: string; name: string; avatarUrl: string | null; score: number }>;
  }>("leaderboard");

export const submitScore = (payload: {
  originalText: string;
  userText: string;
  errors?: number;
}) =>
  api<{
    score: number;
    mistakes: number;
    totalWords: number;
    totalScore: number;
    leaderboardScore?: number;
  }>("score", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getProgressStatus = (grade: number) =>
  api<ProgressLevel[]>(`progress/status?grade=${grade}`);

export const completeTopicProgress = (payload: {
  grade: number;
  level: Level;
  topicId: number;
}) =>
  api<{ success: boolean }>("progress/complete", {
    method: "POST",
    body: JSON.stringify(payload),
  });
