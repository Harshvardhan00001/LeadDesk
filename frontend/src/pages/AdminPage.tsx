import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import {
  FiSearch,
  FiLogOut,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiMail,
  FiDollarSign,
  FiMessageSquare,
  FiCalendar,
  FiFilter
} from 'react-icons/fi';

interface Lead {
  _id: string;
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

const statusConfig: Record<Lead['status'], { badge: string; dot: string; icon: React.ReactNode }> = {
  New: {
    badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    dot: 'bg-rose-500 animate-pulse',
    icon: <FiClock className="w-3 h-3" />
  },
  Contacted: {
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30',
    dot: 'bg-amber-500',
    icon: <FiTrendingUp className="w-3 h-3" />
  },
  Closed: {
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-500/30',
    dot: 'bg-emerald-500',
    icon: <FiCheckCircle className="w-3 h-3" />
  },
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchLeads = async (searchQuery = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/leads?search=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      toast.error('Error loading leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads(search);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const updateStatus = async (id: string, newStatus: string) => {
    const previousLeads = [...leads];

    // Optimistic update
    setLeads(prev => prev.map(lead => lead._id === id ? { ...lead, status: newStatus as any } : lead));

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Lead status updated');
    } catch (err) {
      setLeads(previousLeads);
      toast.error('Error updating status');
    }
  };

  const filteredLeads = useMemo(() => {
    if (statusFilter === 'All') return leads;
    return leads.filter(lead => lead.status === statusFilter);
  }, [leads, statusFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus = { New: 0, Contacted: 0, Closed: 0 } as Record<Lead['status'], number>;
    leads.forEach(l => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = leads.filter(l => new Date(l.createdAt).getTime() >= oneWeekAgo).length;

    const closeRate = total > 0 ? Math.round((byStatus.Closed / total) * 100) : 0;

    return { total, byStatus, thisWeek, closeRate };
  }, [leads]);

  const statCards = [
    { label: 'Total Leads', value: stats.total, hint: 'All time volume', icon: <FiUsers className="w-5 h-5 text-indigo-500" /> },
    { label: 'New This Week', value: stats.thisWeek, hint: 'Last 7 days', icon: <FiClock className="w-5 h-5 text-rose-500" /> },
    { label: 'In Progress', value: stats.byStatus.Contacted, hint: 'Active contact', icon: <FiTrendingUp className="w-5 h-5 text-amber-500" /> },
    { label: 'Conversion Rate', value: `${stats.closeRate}%`, hint: 'Closed vs Total', icon: <FiCheckCircle className="w-5 h-5 text-emerald-500" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar
        brand="Admin Portal"
        rightSlot={
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-rose-500/40 hover:bg-rose-50/50 hover:text-rose-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-rose-600 dark:text-rose-400 font-semibold">
            Management System
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Lead Dashboard</h1>
        </div>

        {/* Stat Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(card => (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-medium">
                  {card.label}
                </span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800">
                  {card.icon}
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{card.value}</span>
              </div>
              <span className="mt-1 block font-mono text-xs text-slate-400 dark:text-zinc-500">
                {card.hint}
              </span>
            </div>
          ))}
        </div>

        {/* Filters & Search Toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-zinc-400 mr-1">
              <FiFilter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['All', 'New', 'Contacted', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${statusFilter === status
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Grid Layout */}
        {loading ? (
          <div className="py-24 text-center font-mono text-sm text-slate-400 dark:text-zinc-600 animate-pulse">
            Syncing leads database...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
            <FiUsers className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-zinc-700" />
            <p className="font-medium text-base">No leads found</p>
            <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">Try adjusting your search query or status filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map(lead => {
              const config = statusConfig[lead.status];
              return (
                <div
                  key={lead._id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                          {lead.name}
                        </h3>
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:underline dark:text-rose-400 mt-0.5"
                        >
                          <FiMail className="w-3.5 h-3.5" />
                          <span className="truncate">{lead.email}</span>
                        </a>
                      </div>

                      <div className="relative inline-flex items-center group">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead._id, e.target.value)}
                          className={`
      appearance-none cursor-pointer rounded-full border border-slate-200/80 
      bg-white/90 backdrop-blur-md px-3.5 py-1.5 pr-8 text-xs font-semibold 
      text-slate-700 shadow-sm transition-all duration-200
      hover:border-rose-300 hover:bg-white hover:shadow-md
      focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10
      ${config?.badge || ''}
    `}
                        >
                          <option value="New" className="bg-white text-slate-800 font-medium py-1">
                            New
                          </option>
                          <option value="Contacted" className="bg-white text-slate-800 font-medium py-1">
                            Contacted
                          </option>
                          <option value="Closed" className="bg-white text-slate-800 font-medium py-1">
                            Closed
                          </option>
                        </select>

                        {/* Modern SVG Chevron Arrow */}
                        <div className="absolute right-2.5 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-zinc-900/80 dark:border-zinc-800/60">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500 mb-1">
                          <FiDollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">Budget Range</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{lead.budgetRange}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500 mb-1">
                          <FiMessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">Message</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 line-clamp-3">
                          {lead.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                      <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">{lead.status}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}