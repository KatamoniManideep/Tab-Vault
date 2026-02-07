import { db } from "./db";

export async function cleanUpStorage(
    maxAgeDays=14,
    maxTabs = 1000
){
    const now =Date.now();
    const ttl = maxAgeDays*24*60*60*1000;

    await db.tabs
        .where("timestamp")
        .below(now-ttl)
        .delete()

    const count = await db.tabs.count();
    if(count>maxTabs){
        const excess=count-maxTabs;
        const oldest = await db.tabs
            .orderBy("timestamp")
            .limit(excess)
            .toArray();

        await db.tabs.bulkDelete(oldest.map(t=>t.tabId));
    }

    
}