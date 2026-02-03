import {db} from '../storage/db';

export async function restoreTab(tabId: string){
    const tab = await db.tabs.get(tabId);
    if(tab) return chrome.tabs.create({url: tab.url});
}

export async function restoreTabs(tabIds: string[]){
    const tabs = await db.tabs.bulkGet(tabIds);

    for(const tab of tabs){
        if(tab) chrome.tabs.create({url: tab.url});
    }
}

export async function restoreSession(sessionId: string){
    const tabs = await db.tabs.where("sessionId").equals(sessionId).toArray();
    for (const tab of tabs) chrome.tabs.create({url: tab.url})
}