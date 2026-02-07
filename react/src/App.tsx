import { useState } from "react";
import { captureSession } from "./capture/session";
import { searchBySession} from "./storage/sessionSearch";
import { restoreSession, restoreTabs } from "./capture/restore";

function App() {
  const [q, setQ] = useState("");
  const [groups, setGroups] = useState<Record<string, any[]>>({});
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  async function onSearch(v: string) {
    setQ(v);
    if (!v) return setGroups({});
    const g = await searchBySession(v);
    setGroups(g);
    const init: Record<string, Set<string>> = {};
    Object.keys(g).forEach(sid => (init[sid] = new Set()));
    setSelected(init);
  }

  function toggle(sid: string, tabId: string) {
    setSelected(prev => {
      const next = { ...prev };
      const s = new Set(next[sid]);
      s.has(tabId) ? s.delete(tabId) : s.add(tabId);
      next[sid] = s;
      return next;
    });
  }

  function restoreSelected(sid: string) {
    const ids = Array.from(selected[sid] || []);
    if (ids.length) restoreTabs(ids);
  }

  const selectedCount = (sid: string) => selected[sid]?.size || 0;
  const totalTabs = (sid: string) => groups[sid]?.length || 0;

  return (
    <div className="app min-h-[500px] w-96 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-4 shadow-2xl rounded-3xl border border-slate-200">
     
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
          TabVault
        </h1>
        <button 
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ring-2 ring-emerald-400/50"
          onClick={captureSession}
        >
         Capture
        </button>
      </div>

      
      <div className="relative">
        <input
          className="w-full px-4 py-3 bg-white/90 backdrop-blur-xl border-2 border-slate-200 hover:border-slate-300 focus:border-blue-400 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-2xl transition-all duration-300 text-sm placeholder-slate-400 font-medium"
          placeholder="Search saved tabs..."
          value={q}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      
      {Object.keys(groups).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
          <p className="text-lg font-medium mb-1">{q ? "No tabs found" : "Ready to capture sessions"}</p>
          <p className="text-sm">Type to search or hit Capture!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto -mr-2 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {Object.entries(groups).map(([sid, tabs]) => (
            <div key={sid} className="group/session bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl border border-white/50 hover:border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1">
             
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Session • {totalTabs(sid)} tabs
                </span>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 hover:scale-105"
                    onClick={() => restoreSession(sid)}
                  >
                    All
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-sm ${
                      selectedCount(sid)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/25 ring-2 ring-green-400/50'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    onClick={() => restoreSelected(sid)}
                  >
                    {selectedCount(sid)}/{totalTabs(sid)}
                  </button>
                </div>
              </div>

             
              <div className="space-y-2.5">
                {tabs.map(t => (
                  <label key={t.tabId} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/50 group-hover:bg-blue-50/50 cursor-pointer transition-all duration-200 hover:shadow-md">
                    <input
                      type="checkbox"
                      className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 mt-px shadow-sm hover:shadow-md transition-shadow duration-200"
                      checked={selected[sid]?.has(t.tabId) || false}
                      onChange={() => toggle(sid, t.tabId)}
                    />
                    <div className="min-w-0 flex-1">
                      <div 
                        className="font-semibold text-sm text-slate-900 truncate pr-2 group-hover:text-blue-800 transition-colors"
                        title={t.title}
                      >
                        {t.title || 'Untitled tab'}
                      </div>
                      <div 
                        className="text-xs font-mono text-slate-500 bg-slate-100/50 px-2 py-0.5 rounded-md truncate max-w-full"
                        title={t.url}
                      >
                        {t.url ? new URL(t.url).hostname : 'chrome://'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
