
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalMessage, Sender } from './types';
import { geminiService } from './services/gemini';
import TerminalOutput from './components/TerminalOutput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Initial System Message
    const initialMsg: TerminalMessage = {
      id: 'init-0',
      sender: Sender.SYSTEM,
      content: 'Connection established. Handshake verified. User: **samiurrabbialexcareer**. \n\nBlack3Panther Engine v1.0.4 successfully initialized. All global mesh nodes are available for decryption. \n\nWhat data do you need from The Grid, Sir?',
      timestamp: new Date(),
    };
    setMessages([initialMsg]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userCommand = input.trim();
    setInput('');

    const userMsg: TerminalMessage = {
      id: `usr-${Date.now()}`,
      sender: Sender.USER,
      content: userCommand,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const response = await geminiService.queryGrid(userCommand);

    const aiMsg: TerminalMessage = {
      id: `ai-${Date.now()}`,
      sender: Sender.LINK,
      content: response.text,
      timestamp: new Date(),
      sources: response.sources,
      isError: response.text.includes('[SYSTEM ERROR]'),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col relative crt select-none overflow-hidden text-cyan-500">
      {/* Top HUD */}
      <header className="h-16 border-b border-cyan-900/50 bg-black/90 flex items-center justify-between px-6 z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-ping absolute opacity-75"></div>
              <div className="relative w-3 h-3 bg-red-600 rounded-full border border-red-400 shadow-[0_0_10px_#ef4444]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.3em] text-red-500 leading-none">SECURE_LINK</span>
              <span className="text-[9px] font-bold text-zinc-600 tracking-widest">ACTIVE_BYPASS</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-cyan-950"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-cyan-800 uppercase leading-none">Node Origin</span>
            <span className="text-[11px] font-bold text-cyan-400 tracking-tighter">B3P_CONSOLE_MAIN</span>
          </div>
        </div>

        <div className="flex items-center gap-8 relative z-10">
          <div className="hidden md:flex flex-col items-end leading-none">
            <span className="text-[9px] font-bold text-cyan-900">PACKET_THROUGHPUT</span>
            <span className="text-xs font-mono text-cyan-700">1.24 TB/PS</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-black tracking-[0.2em] text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Black3Panther Engine</span>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent to-cyan-500 mt-1"></div>
          </div>
        </div>
      </header>

      {/* Terminal Content Area */}
      <main className="flex-1 relative flex flex-col min-h-0 bg-[#020202]">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TerminalOutput messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>

        {/* Console Input */}
        <div className="p-4 bg-black border-t border-cyan-900/20 relative z-10 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleCommand} className="relative group">
              <div className="absolute -inset-1 bg-cyan-500/10 rounded-lg blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-black border border-cyan-900/50 rounded p-1 pl-4">
                <span className="text-cyan-500 font-bold mr-3 select-none">{" >> "}</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inject data request, Sir..."
                  className="flex-1 bg-transparent border-none outline-none text-cyan-300 font-mono text-sm sm:text-base py-2 placeholder:text-cyan-950 placeholder:italic"
                  autoFocus
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className={`px-6 py-2 bg-cyan-950/30 border-l border-cyan-900 text-[10px] font-black tracking-widest uppercase text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all ${isLoading ? 'opacity-30 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'SYNCING' : 'EXECUTE'}
                </button>
              </div>
            </form>
            <div className="mt-2 flex justify-between px-1">
              <span className="text-[8px] text-cyan-950 font-bold uppercase tracking-widest">Neural Encryption: AES-2048</span>
              <span className="text-[8px] text-cyan-950 font-bold uppercase tracking-widest">Protocol: Gemini_Flash_3.0</span>
            </div>
          </div>
        </div>
      </main>

      {/* Grid Overlay Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#06b6d4 0.5px, transparent 0)', backgroundSize: '30px 30px' }}></div>
      </div>
    </div>
  );
};

export default App;
