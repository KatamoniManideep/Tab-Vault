import { useState } from "react";
import { captureSession } from "./capture/session";
import { searchBySession } from "./storage/sessionSearch";
import { restoreSession, restoreTabs } from "./capture/restore";

function App() {
  const [q, setQ] = useState("");
  const [groups, setGroups] = useState<Record<string, any[]>>({});
  const [selected,setSelected]= useState<Record<string,Set<string>>>({})

  async function onSearch(v: string) {
    setQ(v);
    if (!v) return setGroups({});
    const g=await searchBySession(v);
    setGroups(g);

    const init: Record<string,Set<string>> ={};
    Object.keys(g).forEach(sid => (init[sid] = new Set()))
    setSelected(init);
  }

  function toggle(sid: string, tabId:string){
    setSelected(prev =>{
      const next ={...prev};
      const s= new Set(next[sid]);

      s.has(tabId) ? s.delete(tabId) : s.add(tabId);
      next[sid] =s;
      return next;
    });
  }

  function restoreSelected(sid: string){
    const ids = Array.from(selected[sid] || []);
    if(ids.length) restoreTabs(ids);
  }

  return (
    <div className="app">
      <h3>TabVault</h3>
      <button onClick={captureSession}>Capture Session</button>

      <input
        placeholder="Search tabs..."
        value={q}
        onChange={e => onSearch(e.target.value)}
        style={{ width: "100%", marginTop: 8 }}
      />

      {Object.entries(groups).map(([sid, tabs]) => (
        <div key={sid} style={{ marginTop: 10, borderTop: "1px solid #ddd", paddingTop: 6 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => restoreSession(sid)}>Restore All</button>
            <button onClick={() => restoreSelected(sid)}>Restore Selected</button>
          </div>

          {tabs.map(t => (
            <label key={t.tabId} style={{ display: "block", marginTop: 6 }}>
            
              <input
                type="checkbox"
                checked={selected[sid]?.has(t.tabId) || false}
                onChange={() => toggle(sid, t.tabId)}
              />
              <span style={{ marginLeft: 6 }}>{t.title}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
