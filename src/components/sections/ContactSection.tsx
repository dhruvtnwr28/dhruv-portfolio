import React, { useState } from 'react';
import { Mail, Copy, Check, Send, Sparkles, Github, ArrowUpRight, MessageSquareHeart } from 'lucide-react';
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

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f3d2a2', '#d8a7ff', '#f2b8c6', '#ffffff'],
    });

    setFormSent(true);
  };

  return (
    <section id="contact" className="relative w-full py-24 px-4 sm:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#f3d2a2]/20 text-[#f3d2a2] text-xs font-mono mb-4">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>START A CONVERSATION</span>
        </div>
        <h2 className="text-3xl sm:text-6xl font-megante tracking-normal text-white uppercase leading-tight">
          LET’S BUILD SOMETHING <span className="text-gradient-aurora italic">EXCEPTIONAL</span>
        </h2>
        <p className="text-[#a39ea8] max-w-2xl text-sm sm:text-base mt-3 leading-relaxed">
          Whether you have a product in mind, need a full-stack developer on your team, or just want to chat about WebGL and code — my inbox is always open.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Direct Email & Socials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#121019]/80 backdrop-blur-xl border border-[#f3d2a2]/20 hover:border-[#f3d2a2]/40 transition-colors shadow-lg">
            <div className="text-xs font-mono text-[#a39ea8] uppercase tracking-wider mb-2">
              DIRECT INBOX
            </div>
            <div className="text-lg font-mono font-bold text-white mb-4 break-all">
              {email}
            </div>

            <button
              onClick={copyEmail}
              onMouseEnter={() => sound.playHover()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f3d2a2] to-[#d8a7ff] text-black font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(243,210,162,0.25)] hover:shadow-[0_0_35px_rgba(243,210,162,0.5)] transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY EMAIL ADDRESS</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#121019]/80 backdrop-blur-xl border border-white/10 space-y-3">
            <div className="text-xs font-mono text-[#a39ea8] uppercase tracking-wider">
              ONLINE PRESENCE
            </div>

            <a
              href="https://github.com/dhruvtnwr28"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#f3d2a2]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 text-[#f3d2a2] group-hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-megante text-base text-white">GitHub</div>
                  <div className="font-mono text-xs text-[#a39ea8]">@dhruvtnwr28</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#a39ea8] group-hover:text-[#f3d2a2] transition-colors" />
            </a>

            <a
              href="mailto:dhruvtnwr28@gmail.com"
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#f3d2a2]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 text-[#d8a7ff] group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-megante text-base text-white">Direct Email</div>
                  <div className="font-mono text-xs text-[#a39ea8]">dhruvtnwr28@gmail.com</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#a39ea8] group-hover:text-[#d8a7ff] transition-colors" />
            </a>
          </div>
        </div>

        {/* Right Column: Clean Form */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#121019]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
            {formSent ? (
              <div className="py-12 flex flex-col items-center justify-center text-center font-sans">
                <div className="w-16 h-16 rounded-full bg-[#f3d2a2]/20 border border-[#f3d2a2]/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(243,210,162,0.3)]">
                  <Sparkles className="w-8 h-8 text-[#f3d2a2] animate-spin" />
                </div>
                <h3 className="font-megante text-3xl text-white mb-2">
                  MESSAGE RECEIVED!
                </h3>
                <p className="text-[#a39ea8] text-sm max-w-md mb-6 leading-relaxed">
                  Thanks for reaching out! I'll read this and get back to your email as soon as my code compiles.
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    setFormSent(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f3d2a2] text-xs font-mono transition-colors"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a39ea8] mb-1.5 uppercase">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#f3d2a2] font-sans text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#a39ea8] mb-1.5 uppercase">
                      YOUR EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#f3d2a2] font-sans text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a39ea8] mb-1.5 uppercase">
                    MESSAGE / PROJECT DETAILS
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me what you're working on, questions, or just send a hello..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#f3d2a2] font-sans text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => sound.playHover()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#f3d2a2] via-[#f2b8c6] to-[#d8a7ff] font-sans font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(243,210,162,0.3)] hover:shadow-[0_0_40px_rgba(243,210,162,0.5)] hover:scale-[1.01] transition-all duration-300"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>DISPATCH MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
