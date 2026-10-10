import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileJson, Check, Copy } from 'lucide-react';
import { JobOpening } from '../types';
import { storageService } from '../services/storageService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOpening[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  jobs,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csvContent = storageService.exportToCSV(jobs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `support_your_indies_jobs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(jobs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `support_your_indies_jobs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCSV = () => {
    const csvContent = storageService.exportToCSV(jobs);
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Export Open Dataset</h3>
              <p className="text-xs text-slate-400">Download current indie studio openings and metadata</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <p className="font-semibold text-slate-200 mb-1">Standardized Columns Included:</p>
            <p className="font-mono text-[11px] text-slate-400 leading-relaxed">
              Studio Size, Studio Type, Work Arrangement, Hiring Status, Title, Studio Name, Discipline, Engine, Location, Direct Apply URL, Proof Source URL, Verification Status, Vouches.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadCSV}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/50 transition-all text-center group"
            >
              <FileSpreadsheet className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-white">Download CSV</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Excel & Google Sheets compatible</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/50 transition-all text-center group"
            >
              <FileJson className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold text-white">Download JSON</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Programmatic API integration</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyCSV}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'CSV Copied to Clipboard!' : 'Copy raw CSV'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
