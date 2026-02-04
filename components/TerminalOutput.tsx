
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { TerminalMessage, Sender } from '../types';

interface TerminalOutputProps {
  messages: TerminalMessage[];
  isLoading: boolean;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex flex-col gap-6 p-6 pb-28 overflow-y-auto h-full font-mono text-sm sm:text-base">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col ${msg.isError ? 'text-red-500' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-1 py-0.5 tracking-tighter uppercase ${
              msg.sender === Sender.SYSTEM ? 'bg-yellow-600 text-black' : 
              msg.sender === Sender.USER ? 'bg-cyan-600 text-white' : 
              'bg-emerald-600 text-black'
            }`}>
              {msg.sender}
            </span>
            <span className="text-[10px] text-zinc-600 font-bold">
              [{msg.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
            </span>
            <div className="flex-1 h-[1px] bg-zinc-900"></div>
          </div>
          
          <div className="pl-2 border-l border-zinc-900/50">
            {msg.sender === Sender.USER ? (
              <span className="text-cyan-400 font-medium">{" >> "}{msg.content}</span>
            ) : (
              <div className={`grid-response leading-relaxed ${msg.sender === Sender.LINK ? 'border border-emerald-500/20 bg-emerald-500/5 p-4 rounded shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'text-zinc-300'}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {msg.sources && msg.sources.length > 0 && (
            <div className="mt-3 ml-2 border-t border-emerald-900/30 pt-2 text-[10px] text-emerald-600">
              <div className="font-bold uppercase tracking-[0.2em] mb-2 text-emerald-500/70">── Network Nodes Detected ──</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {msg.sources.map((s, idx) => (
                  <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <span className="opacity-50">#</span>{s.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex flex-col animate-pulse opacity-80">
           <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-1 py-0.5 bg-emerald-600 text-black uppercase">
              {Sender.LINK}
            </span>
            <span className="text-[10px] text-zinc-600 font-bold tracking-widest">UPLINK_ESTABLISHING...</span>
            <div className="flex-1 h-[1px] bg-emerald-900/30"></div>
          </div>
          <div className="pl-2 border-l border-emerald-900/50">
            <div className="text-emerald-500 italic border border-emerald-500/20 bg-emerald-500/5 p-4 rounded text-sm">
              <span className="inline-block animate-bounce mr-1">⚡</span> 
              Bypassing firewalls, Sir... Decrypting global nodes... Scanning the Grid...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalOutput;
