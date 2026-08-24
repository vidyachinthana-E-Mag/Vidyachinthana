"use client";
import React from 'react';
import { Radio, Zap } from 'lucide-react';

export function BreakingNews() {
  const newsItems = [
    'Quantum Teleportation of entangled photon states achieved across 120km Sri Lankan coastal fiber network.',
    'Coral Genome Blueprint completed: University of Colombo reveals gene pathways resilient to thermal spikes.',
    'Sinhala-LLM Research Consortium publishes 14B parameter multilingual scientific foundation model.',
    'Neuromorphic bio-chips demonstrate 400x energy efficiency in real-time EEG brain-computer decoding.',
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 my-3 z-10 relative">
      <div className="liquid-glass rounded-2xl px-4 py-2 flex items-center shadow-sm border border-slate-200/80 dark:border-slate-800">
        {/* Ticker Label Capsule */}
        <div className="flex items-center flex-shrink-0 bg-blue-600/10 dark:bg-cyan-400/20 text-blue-600 dark:text-cyan-300 border border-blue-600/20 dark:border-cyan-400/30 px-3 py-1 rounded-full mr-4 z-10 font-mono text-[11px] font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 mr-2 animate-ping" />
          <Radio className="w-3.5 h-3.5 mr-1" />
          <span>Live Dispatch</span>
        </div>

        {/* Scrolling Ticker Line */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-[scroll-left_40s_linear_infinite] hover:[animation-play-state:paused] items-center text-xs font-mono text-slate-700 dark:text-slate-300">
            {newsItems.concat(newsItems).map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-default">
                  {item}
                </span>
                <span className="mx-4 text-blue-600/40 dark:text-cyan-400/40 font-bold">///</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
