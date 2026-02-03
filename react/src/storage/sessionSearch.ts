import {db} from './db';

export async function searchBySession(query: string){
    const tabs = await db.tabs.toArray();
    const q = query.toLowerCase();

    const matches = tabs.filter(t =>
    (t.title + " " + t.url).toLowerCase().includes(q)
    );

    const grouped: Record<string , typeof matches> ={};

    for(const tab of matches){
        if(!grouped[tab.sessionId]) grouped[tab.sessionId]=[];
        grouped[tab.sessionId].push(tab);
    }

    return grouped;
}