import { useState, useMemo, useEffect } from "react";
import { 
  Search, Terminal, Cpu, Database, Zap, 
  HardDrive, Download, Activity, AlertTriangle 
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import LogsTable from "../components/LogTable";

const SystemLogs = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const [logs] = useState([
    { id: "SYS-001", component: "API Gateway", event: "Rate Limit Exceeded", level: "Warning", node: "US-EAST-1", time: "2026-02-19 14:02" },
    { id: "SYS-002", component: "Database", event: "Auto-Scale Triggered", level: "Info", node: "DB-PRIMARY", time: "2026-02-19 14:15" },
    { id: "SYS-003", component: "Auth Service", event: "SSL Certificate Renewal", level: "Success", node: "GLOBAL-AUTH", time: "2026-02-19 14:30" },
    { id: "SYS-004", component: "Search Engine", event: "Elasticsearch Timeout", level: "Error", node: "SEARCH-02", time: "2026-02-19 14:45" },
    { id: "SYS-005", component: "Vector DB", event: "Embedding Sync Complete", level: "Success", node: "AI-NODE-5", time: "2026-02-19 15:00" },
  ]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = log.component.toLowerCase().includes(search.toLowerCase()) || log.event.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === "All" || log.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [logs, search, levelFilter]);

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  const columns = [
    { 
      label: "Node ID", 
      key: "id", 
      render: (v) => <span className="font-mono text-blue-400 text-xs font-bold">{v}</span> 
    },
    { label: "Component", key: "component", render: (v) => <span className="font-semibold">{v}</span> },
    { label: "Event Message", key: "event", render: (v) => <span className="text-slate-400">{v}</span> },
    { 
      label: "Level", 
      key: "level",
      render: (val) => {
        const styles = {
          Success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          Info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          Warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          Error: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[val]}`}>
            {val.toUpperCase()}
          </span>
        );
      }
    },
    { label: "Origin", key: "node", render: (v) => <span className="text-slate-500 text-xs italic">{v}</span> },
    { label: "Timestamp", key: "time", render: (v) => <span className="text-slate-500 text-xs font-mono">{v}</span> }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 p-6 text-slate-300">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <Terminal className="text-blue-500" size={28} />
              <h2 className="text-3xl font-bold text-white tracking-tight">System Archive</h2>
            </div>
            <p className="text-slate-400 text-sm mt-1">Infrastructure telemetry for search engines and API clusters.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              HEALTH: 99.9%
            </span>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-600/20 flex items-center gap-2">
              <Download size={18} /> Export Logs
            </button>
          </div>
        </div>

        {/* SYSTEM STATS GRID - MATCHING THE ANALYTICS STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SysStat label="Avg CPU Load" value="24%" icon={<Cpu className="text-blue-500"/>} iconBg="bg-blue-500/10" />
          <SysStat label="Queries/Sec" value="1.2k" icon={<Activity className="text-emerald-500"/>} iconBg="bg-emerald-500/10" />
          <SysStat label="API Latency" value="88ms" icon={<Zap className="text-amber-500"/>} iconBg="bg-amber-500/10" />
          <SysStat label="Storage Used" value="62%" icon={<HardDrive className="text-purple-500"/>} iconBg="bg-purple-500/10" />
        </div>

        {/* SEARCH & FILTERS SECTION */}
        <div className="bg-[#1a1f2e] border border-slate-800 rounded-2xl p-4 flex gap-4 shadow-xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter system events, node IDs, or components..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f1219] text-white border border-slate-800 focus:border-blue-500 outline-none transition-all"
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="bg-[#0f1219] border border-slate-800 text-white rounded-xl px-6 py-3 outline-none appearance-none pr-10 cursor-pointer"
              value={levelFilter} 
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Error">Error Only</option>
              <option value="Warning">Warning Only</option>
              <option value="Success">Success Only</option>
            </select>
            <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-[#1a1f2e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <LogsTable logs={paginatedLogs} columns={columns} />
        </div>

      </div>
    </DashboardLayout>
  );
};

// Internal Helper to match the "Boxed Icon" style from your first image
const SysStat = ({ label, value, icon, iconBg }) => (
  <div className="bg-[#1a1f2e] border border-slate-800 p-6 rounded-2xl flex justify-between items-center group hover:border-slate-600 transition-all">
    <div>
      <p className="text-sm font-medium text-slate-400 mb-1 group-hover:text-slate-300 transition-colors">{label}</p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl shadow-inner ${iconBg}`}>
      {icon}
    </div>
  </div>
);

export default SystemLogs;