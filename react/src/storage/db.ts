import Dexie,{type Table} from 'dexie';

export interface Session{
    sessionId:string;
    createdAt:number;
    tabCount:number;
}

export interface Tab{
    tabId: string;
    sessionId: string;
    url: string;
    title: string;
    favicon?:string;
    timestamp:number;
    contentText?: string;
    contentHash?: string;
}

class TabArchieveDB extends Dexie {
    sessions!: Table<Session, string>;
    tabs!: Table<Tab, string>;

    constructor() {
        super("tab_archiver");
        this.version(1).stores({
            sessions: "sessionId, createdAt",
            tabs: "tabId, sessionId, url"
        });

        this.version(2).stores({
            sessions: "sessionId, createdAt",
            tabs: "tabId, sessionId, url, contestHash"
        })

    }
}

export const db= new TabArchieveDB();