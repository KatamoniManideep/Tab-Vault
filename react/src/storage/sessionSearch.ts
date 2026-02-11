import {db} from './db';

export async function searchBySession(query: string){
    const tabs = await db.tabs.toArray();
    const q = query.toLowerCase();
    const sessions = await db.sessions.toArray();

    const sessionMap: Record<
    string,{meta: any,tabs : typeof tabs}
    >={};

    sessions.forEach(s =>{
        sessionMap[s.sessionId]={
            meta: s,
            tabs:[]
        };
    });

    for(const t of tabs){
        if((t.title+" "+t.url).toLowerCase().includes(q)){
            if(sessionMap[t.sessionId]){
                sessionMap[t.sessionId].tabs.push(t);
            }
        }
    }
        

    return Object.fromEntries(
        Object.entries(sessionMap).filter(([_, V]) =>V.tabs.length>0)
    );
}