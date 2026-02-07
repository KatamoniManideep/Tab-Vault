export function hashText(text: string){
    let h=0;
    for(let i=0;i<text.length;i++){
        h=(h<<5) -h+ text.charCodeAt(i);
        h|=0;
    }
    return h.toString();
}