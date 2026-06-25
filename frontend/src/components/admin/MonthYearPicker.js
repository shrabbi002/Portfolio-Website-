'use client';
import { useState, useRef, useEffect } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function MonthYearPicker({ value, onChange, placeholder = 'Select date' }) {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const ref = useRef(null);

    // Parse "January 2023" -> { month: 0, year: 2023 }
    const parsed = value ? (() => {
        const parts = value.match(/(\w+)\s+(\d{4})/);
        if (parts) {
            const mIdx = MONTH_FULL.findIndex(m => m.startsWith(parts[1]));
            return mIdx >= 0 ? { month: mIdx, year: parseInt(parts[2]) } : null;
        }
        return null;
    })() : null;

    useEffect(() => {
        if (parsed) setYear(parsed.year);
    }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selectMonth = (monthIdx) => {
        onChange(`${MONTH_FULL[monthIdx]} ${year}`);
        setOpen(false);
    };

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    return (
        <div className="relative" ref={ref}>
            {/* Trigger button */}
            <button type="button" onClick={() => setOpen(!open)}
                className="input-field w-full text-left flex items-center justify-between gap-2 cursor-pointer hover:border-white/20 transition-colors">
                <span className={value ? 'text-white' : 'text-white/30'}>
                    {value || placeholder}
                </span>
                <svg className={`w-5 h-5 text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            </button>

            {/* Calendar dropdown */}
            {open && (
                <div className="absolute top-full left-0 mt-2 w-72 z-50 rounded-2xl border border-white/10 bg-dark-800 shadow-2xl shadow-black/50 animate-slideDown overflow-hidden">
                    {/* Year navigation */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-dark-900/50">
                        <button type="button" onClick={() => setYear(y => y - 1)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                        </button>
                        <span className="font-heading font-bold text-lg text-white">{year}</span>
                        <button type="button" onClick={() => setYear(y => y + 1)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                        </button>
                    </div>

                    {/* Month grid */}
                    <div className="grid grid-cols-3 gap-1.5 p-3">
                        {MONTHS.map((m, i) => {
                            const isSelected = parsed && parsed.month === i && parsed.year === year;
                            const isCurrent = currentMonth === i && currentYear === year;
                            const isFuture = year > currentYear || (year === currentYear && i > currentMonth);

                            return (
                                <button key={m} type="button"
                                    onClick={() => !isFuture && selectMonth(i)}
                                    disabled={isFuture}
                                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${isSelected
                                            ? 'bg-gradient-to-r from-primary-500 to-violet-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                                            : isFuture
                                                ? 'text-white/10 cursor-not-allowed'
                                                : isCurrent
                                                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20'
                                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}>
                                    {m}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-2 px-3 pb-3">
                        <button type="button"
                            onClick={() => { setYear(currentYear); selectMonth(currentMonth); }}
                            className="flex-1 py-1.5 rounded-lg bg-white/[0.03] text-white/40 text-xs font-medium hover:bg-white/[0.06] hover:text-white/60 transition-colors">
                            Today
                        </button>
                        <button type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            className="flex-1 py-1.5 rounded-lg bg-white/[0.03] text-white/40 text-xs font-medium hover:bg-white/[0.06] hover:text-white/60 transition-colors">
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
