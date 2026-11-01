import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';
import { sound } from '../../utils/audio';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTerminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<Array<{ type: 'cmd' | 'resp' | 'error'; text: string | React.ReactNode }>>([
    { type: 'resp', text: '⚡ DHRUV_OS v4.2.0 [Quantum Cyber Terminal Initialized]' },
    { type: 'resp', text: 'Type "help" to list available telemetry commands or "matrix" for rain effect.' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandIndex, setCommandIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playTerminal();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, matrixActive]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    sound.playClick();
    setCmdHistory((prev) => [...prev, cmd]);
    setCommandIndex(-1);

    const newHistory = [...history, { type: 'cmd' as const, text: `$ ${cmd}` }];

    switch (trimmed) {
      case 'help':
        newHistory.push({
          type: 'resp',
          text: (
            <div className="space-y-1 text-slate-300 font-mono text-xs">
              <p className="text-cyan-400 font-bold">AVAILABLE COMMANDS:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pl-2">
                <div><span className="text-emerald-400 font-semibold">whoami</span> - Identity, vision & background</div>
                <div><span className="text-emerald-400 font-semibold">skills</span> - Core full-stack & 3D capabilities</div>
                <div><span className="text-emerald-400 font-semibold">projects</span> - Production artifacts & repositories</div>
                <div><span className="text-emerald-400 font-semibold">contact</span> - Instant direct transmission link</div>
                <div><span className="text-emerald-400 font-semibold">matrix</span> - Stream digital code rain</div>
                <div><span className="text-emerald-400 font-semibold">clear</span> - Flush terminal buffer</div>
                <div><span className="text-emerald-400 font-semibold">sudo</span> - Elevate quantum privileges</div>
                <div><span className="text-emerald-400 font-semibold">exit</span> - Close terminal deck</div>
              </div>
            </div>
          ),
        });
        break;

      case 'whoami':
        newHistory.push({
          type: 'resp',
          text: (
            <div className="space-y-1 text-slate-300 text-xs">
              <p className="text-cyan-300 font-bold">DHRUV TANWAR — FULL STACK DEVELOPER & CREATIVE ARCHITECT</p>
              <p>Specialized in crafting bleeding-edge web applications, high-concurrency MERN backends, real-time 3D WebGL experiences, and ultra-fluid interactive interfaces.</p>
              <p className="text-slate-400">Philosophy: Performance without compromise; visual ambition without latency.</p>
            </div>
          ),
        });
        break;

      case 'skills':
        newHistory.push({
          type: 'resp',
          text: (
            <div className="space-y-2 text-xs">
              <p className="text-cyan-400 font-bold">CORE CAPABILITIES MATRIX:</p>
              <div className="space-y-1 pl-2">
                <p><span className="text-purple-400 font-semibold">[Frontend/3D]:</span> React, Next.js, Three.js, React Three Fiber, GLSL Shaders, Tailwind CSS, GSAP, Framer Motion</p>
                <p><span className="text-emerald-400 font-semibold">[Backend/MERN]:</span> Node.js, Express.js, MongoDB, RESTful APIs, WebSockets, JWT/OAuth</p>
                <p><span className="text-blue-400 font-semibold">[DevOps/Tooling]:</span> Git, Docker, Vite, Linux/Bash, Vercel, CI/CD</p>
              </div>
            </div>
          ),
        });
        break;

      case 'projects':
        newHistory.push({
          type: 'resp',
          text: (
            <div className="space-y-2 text-xs">
              <p className="text-cyan-400 font-bold">SELECTED DEPLOYMENTS:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><span className="text-emerald-300 font-semibold">Nexus AI Hub</span> — Real-time conversational multi-agent interface with streaming telemetry.</li>
                <li><span className="text-emerald-300 font-semibold">HyperSpatial 3D Engine</span> — Procedural WebGL world with dynamic physics & shader lighting.</li>
                <li><span className="text-emerald-300 font-semibold">MERN Cloud Vault</span> — Encrypted distributed file management with role-based access.</li>
                <li><span className="text-emerald-300 font-semibold">Quantum Crypt</span> — Real-time crypto portfolio tracker with WebSocket live feeds.</li>
              </ul>
              <p className="text-slate-400">Scroll to the Projects section to inspect interactive 3D holograms!</p>
            </div>
          ),
        });
        break;

      case 'contact':
        newHistory.push({
          type: 'resp',
          text: (
            <div className="space-y-1 text-xs">
              <p className="text-cyan-400 font-bold">DIRECT TRANSMISSION FREQUENCIES:</p>
              <p>Email: <a href="mailto:dhruvtnwr28@gmail.com" className="text-cyan-300 underline">dhruvtnwr28@gmail.com</a></p>
              <p>GitHub: <a href="https://github.com/dhruvtnwr28" target="_blank" rel="noreferrer" className="text-cyan-300 underline">github.com/dhruvtnwr28</a></p>
            </div>
          ),
        });
        break;

      case 'matrix':
        setMatrixActive(true);
        newHistory.push({
          type: 'resp',
          text: <span className="text-emerald-400 font-mono">Initiating Neural Matrix Stream... [Type any key or command to pause]</span>,
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'sudo':
      case 'sudo su':
        newHistory.push({
          type: 'resp',
          text: <span className="text-rose-400">Permission denied: dhruv_guest is not in the sudoers file. This incident will be reported to Dhruv.</span>,
        });
        break;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for a list of directives.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = commandIndex === -1 ? cmdHistory.length - 1 : Math.max(0, commandIndex - 1);
      setCommandIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex === -1) return;
      const nextIdx = commandIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setCommandIndex(-1);
        setInputVal('');
      } else {
        setCommandIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md transition-all">
      <div
        className={`w-full flex flex-col rounded-xl overflow-hidden border border-cyan-500/30 bg-[#060a14]/95 shadow-[0_0_50px_rgba(0,240,255,0.2)] font-mono transition-all duration-300 ${
          isMaximized ? 'h-[95vh] max-w-full' : 'h-[540px] max-w-3xl'
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c1222] border-b border-cyan-500/20 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer hover:bg-rose-400" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer hover:bg-amber-400" onClick={() => setIsMaximized(!isMaximized)} />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              dhruv@quantum-core: ~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-slate-400 hover:text-cyan-300 p-1"
              title={isMaximized ? 'Minimize' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-rose-400 p-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto space-y-2 text-xs sm:text-sm text-slate-200"
          onClick={() => inputRef.current?.focus()}
        >
          {matrixActive && (
            <div className="py-2 text-emerald-400 text-xs opacity-75 font-mono select-none overflow-hidden leading-tight">
              01000100 01001000 01010010 01010101 01010110 00100000 01010100 01000001 01001110 01010111 01000001 01010010<br/>
              01110001 01110101 01100001 01101110 01110100 01110101 01101101 00100000 01110011 01111001 01110011 01110100<br/>
              01100101 01101101 01110011 00100000 01101111 01101110 01101100 01101001 01101110 01100101 00100001 00100001
            </div>
          )}

          {history.map((item, idx) => (
            <div key={idx} className="leading-relaxed">
              {item.type === 'cmd' ? (
                <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="text-emerald-400">➜</span>
                  <span className="text-purple-400 font-bold">~</span>
                  {item.text}
                </div>
              ) : item.type === 'error' ? (
                <div className="text-rose-400 pl-4">{item.text}</div>
              ) : (
                <div className="pl-4 text-slate-300">{item.text}</div>
              )}
            </div>
          ))}

          {/* Active Command Line Input */}
          <div className="flex items-center gap-2 pt-1 text-slate-200">
            <span className="text-emerald-400 font-bold">➜</span>
            <span className="text-purple-400 font-bold">~</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-cyan-300 font-mono caret-cyan-400 placeholder-slate-600 text-xs sm:text-sm"
              placeholder="type 'help' or command..."
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <button
              onClick={() => handleCommand(inputVal)}
              className="text-slate-500 hover:text-cyan-400 p-1"
              title="Execute"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-1.5 bg-[#080d19] border-t border-cyan-500/15 text-[11px] text-slate-500 flex justify-between items-center select-none font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PORT 3000 // QUANTUM CORE LIVE</span>
          </div>
          <div className="hidden sm:block text-slate-400">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">Esc</kbd> to exit
          </div>
        </div>
      </div>
    </div>
  );
};
