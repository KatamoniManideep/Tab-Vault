/// <reference types="chrome" />
import { db } from "../storage/db";

export async function captureSession() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const sessionId=  crypto.randomUUID();

    await db.sessions.add({
        sessionId,
        createdAt: Date.now(),
        tabCount: tabs.length
    })

    await db.tabs.bulkAdd(
        tabs.map(t => ({
            tabId: crypto.randomUUID(),
            sessionId,
            url: t.url || "",
            title: t.title || "",
            favicon: t.favIconUrl,
            timestamp: Date.now()
        }))
    )
}