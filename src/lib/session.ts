export type PlayerSession = {
  nickname: string;
  createdAt: number;
};

const SESSION_KEY = 'eeia-cup-session-v1';

export function getSessionKey() {
  return SESSION_KEY;
}

export function readSession(): PlayerSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PlayerSession;

    if (!parsed.nickname || typeof parsed.nickname !== 'string') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: PlayerSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}
