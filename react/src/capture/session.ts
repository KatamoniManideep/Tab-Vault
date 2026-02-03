/// <reference types="chrome" />
import { db } from "../storage/db";
import { extractReadableText } from "./content";


export async function captureSession() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const sessionId=  crypto.randomUUID();

    await db.sessions.add({
        sessionId,
        createdAt: Date.now(),
        tabCount: tabs.length
    })

    for(const tab of tabs){
        let contentText="";

        if(tab.id && tab.url?.startsWith("http")){
            contentText = await extractReadableText(tab.id);
        }

        await db.tabs.add({
            tabId: crypto.randomUUID(),
            sessionId,
            url: tab.url || "",
            title: tab.title || "",
            favicon: tab.favIconUrl,
            timestamp: Date.now(),
            contentText
        });
    
    }
}