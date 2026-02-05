import {db} from './db'

function tokenize(text: string){
    return text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}



export async function searchTabs(query: string){

    const queryTokens= tokenize(query);

    const tabs = await db.tabs.toArray();

    return tabs
    .map(tab =>{
        const tabTokens= tokenize(`${tab.title} ${tab.url}`);
        const contentTokens =tokenize(tab.contentText || "");

        let score=0;

        for(const token of queryTokens){
            if(tabTokens.includes(token)) score+=3;
            else if( contentTokens.includes(token)) score++;
        }

        return {tab,score};
    })

    .filter(r=> r.score>0)
    .sort((a,b)=>b.score-a.score)
    .map(r=> r.tab);
}