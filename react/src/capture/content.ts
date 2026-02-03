export async function extractReadableText(tabId: number){
    const [{result}] = await chrome.scripting.executeScript({
        target: {tabId},
        func: ()=>{
            document.querySelectorAll("script,style,noscript").forEach(e=> e.remove());
            return document.body?.innerText || "";
        }
    });

    return (result ?? "")
        .replace(/\s+/g," ")
        .trim()
        .slice(0,20000);
}