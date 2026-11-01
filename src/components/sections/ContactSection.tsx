import React, { useState } from 'react';
import { Mail, Copy, Check, Send, Sparkles, Github, Radio, MessageSquare, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const email = 'dhruvtnwr28@gmail.com';

  const copyEmail = () => {
    sound.playSuccess();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    // Trigger high-impact cyberpunk confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#a855f7', '#38bdf8', '#ffffff'],
    });

    setFormSent(true);
  };

  return (
    <section id="contact" className="relative w-full py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>MODULE // 04: DIRECT TRANSMISSION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          INITIATE <span className="text-gradient-cyan">CONTACT</span>
        </h2>
        <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-2">
          Ready to build groundbreaking software systems or scale next-gen interactive products? Send an encrypted transmission or copy my direct frequency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Direct Frequency Pill & Socials (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Copy Email Card */}
          <div className="p-6 rounded-2xl bg-[#090e1a]/80 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PRIMARY FREQUENCY // DIRECT</span>
            </div>
            <div className="text-lg font-mono font-bold text-white mb-4 break-all">
              {email}
            </div>

            <button
              onClick={copyEmail}
              onMouseEnter={() => sound.playHover()}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>FREQUENCY COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY EMAIL FREQUENCY</span>
                </>
              )}
            </button>
          </div>

          {/* Social Links & Telemetry */}
          <div className="p-6 rounded-2xl bg-[#090e1a]/80 backdrop-blur-xl border border-white/10 space-y-4">
            <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
              NETWORK CHANNELS
            </div>

            <a
              href="https://github.com/dhruvtnwr28"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">GitHub Repository</div>
                  <div className="font-mono text-xs text-slate-400">@dhruvtnwr28</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            <a
              href="mailto:dhruvtnwr28@gmail.com"
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 text-purple-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">Electronic Mail</div>
                  <div className="font-mono text-xs text-slate-400">dhruvtnwr28@gmail.com</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* Right Column: High-Tech Transmitter Form (3 cols) */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1a]/90 backdrop-blur-xl border border-white/10 relative overflow-hidden shadow-2xl">
            {formSent ? (
              <div className="py-12 flex flex-col items-center justify-center text-center font-mono">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">
                  TRANSMISSION ACKNOWLEDGED
                </h3>
                <p className="text-slate-300 text-sm max-w-md mb-6 font-sans">
                  Your message has entered the high-priority queue. Expect a swift response directly to your inbox.
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    setFormSent(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-mono font-semibold transition-colors"
                >
                  TRANSMIT ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 font-mono text-xs">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    SECURE TRANSMITTER DECK
                  </span>
                  <span className="text-slate-500">ENCRYPTION: ACTIVE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      IDENTIFIER // YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Mercer"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      RETURN FREQUENCY // EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    PAYLOAD // TRANSMISSION DETAILS
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your initiative, engineering requirements, or timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => sound.playHover()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 font-mono font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] hover:scale-[1.01] transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH TRANSMISSION</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
