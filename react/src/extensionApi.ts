import { captureSession } from "./capture/session";
import { db, type Session, type Tab } from "./storage/db";

export async function listSessions(): Promise<Session[]> {
  return db.sessions.toArray();
}

export async function getTabsForSession(sessionId: string): Promise<Tab[]> {
  return db.tabs.where("sessionId").equals(sessionId).toArray();
}

export async function deleteSession(sessionId: string) {
  const tabs = await db.tabs.where("sessionId").equals(sessionId).toArray();
  await Promise.all(tabs.map(t => db.tabs.delete(t.tabId)));
  await db.sessions.delete(sessionId);
}

declare global {
  interface Window {
    tabVault?: {
      captureSession: typeof captureSession;
      listSessions: typeof listSessions;
      getTabsForSession: typeof getTabsForSession;
      deleteSession: typeof deleteSession;
    };
  }
}

// Attach a minimal API to the window so extension code (popup/content)
// can call into the app logic when the page is running in a web context.
if (typeof window !== "undefined") {
  window.tabVault = {
    captureSession,
    listSessions,
    getTabsForSession,
    deleteSession,
  };
}

export default {
  captureSession,
  listSessions,
  getTabsForSession,
  deleteSession,
};
