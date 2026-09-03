import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PeerConnection, generatePin } from './peerManager';
import { QRCodeSVG } from 'qrcode.react';

/* ═══ Random Identity & Avatar Generator ═══ */
const ADJECTIVES = ['Cosmic', 'Solar', 'Astral', 'Nebula', 'Quantum', 'Lunar', 'Stellar', 'Galactic', 'Hyper', 'Orbit'];
const NOUNS = ['Voyager', 'Pilot', 'Nomad', 'Explorer', 'Pioneer', 'Ranger', 'Captain', 'Drifter', 'Guardian', 'Rover'];

function getOrGenerateUser() {
  try {
    const saved = localStorage.getItem('swift_user');
    if (saved) return JSON.parse(saved);
  } catch {}

  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  const newUser = {
    username: `${adj} ${noun} #${num}`,
    avatarId: Math.floor(Math.random() * 6),
  };
  try {
    localStorage.setItem('swift_user', JSON.stringify(newUser));
  } catch {}
  return newUser;
}

/* ═══ Space Vector Art Avatars ═══ */
const VectorAvatar = ({ id = 0, size = 44, className = '' }) => {
  const avatars = [
    // 0: Astronaut Helmet (Cyan/Blue)
    <g>
      <circle cx="24" cy="24" r="22" fill="url(#av-bg-0)" />
      <circle cx="24" cy="22" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
      <path d="M 16 21 Q 24 16 32 21 Q 30 29 24 29 Q 18 29 16 21 Z" fill="url(#av-visor-0)" />
      <rect x="18" y="34" width="12" height="6" rx="2" fill="#38bdf8" opacity="0.8" />
      <circle cx="20" cy="20" r="1.5" fill="#ffffff" opacity="0.8" />
    </g>,
    // 1: Saturn Ring Planet (Amber/Purple)
    <g>
      <circle cx="24" cy="24" r="22" fill="url(#av-bg-1)" />
      <ellipse cx="24" cy="24" rx="19" ry="6" fill="none" stroke="#fbbf24" strokeWidth="2.5" transform="rotate(-20 24 24)" />
      <circle cx="24" cy="24" r="11" fill="url(#av-body-1)" />
      <path d="M 12 25 A 19 6 0 0 0 35 21" stroke="#f59e0b" strokeWidth="2.5" fill="none" transform="rotate(-20 24 24)" />
    </g>,
    // 2: Space Rocket (Teal/Indigo)
    <g>
      <circle cx="24" cy="24" r="22" fill="url(#av-bg-2)" />
      <path d="M 24 9 Q 31 16 29 27 L 19 27 Q 17 16 24 9 Z" fill="#f8fafc" />
      <circle cx="24" cy="18" r="3" fill="#0284c7" />
      <path d="M 19 23 L 14 27 L 19 27 Z" fill="#f43f5e" />
      <path d="M 29 23 L 34 27 L 29 27 Z" fill="#f43f5e" />
      <polygon points="21,27 27,27 24,35" fill="#fb923c" />
    </g>,
    // 3: Orbital Alien Satellite (Emerald/Violet)
    <g>
      <circle cx="24" cy="24" r="22" fill="url(#av-bg-3)" />
      <rect x="19" y="19" width="10" height="10" rx="2" fill="#a78bfa" stroke="#c4b5fd" strokeWidth="1.5" />
      <line x1="12" y1="24" x2="19" y2="24" stroke="#c4b5fd" strokeWidth="2" />
      <line x1="29" y1="24" x2="36" y2="24" stroke="#c4b5fd" strokeWidth="2" />
      <rect x="9" y="20" width="4" height="8" rx="1" fill="#34d399" />
      <rect x="35" y="20" width="4" height="8" rx="1" fill="#34d399" />
      <circle cx="24" cy="24" r="2" fill="#22c55e" />
    </g>,
    // 4: Deep Space Constellation
    <g>
      <circle cx="24" cy="24" r="22" fill="url(#av-bg-4)" />
      <line x1="14" y1="16" x2="24" y2="13" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2,2" />
      <line x1="24" y1="13" x2="33" y2="20" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2,2" />
      <line x1="33" y1="20" x2="25" y2="33" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2,2" />
      <line x1="25" y1="33" x2="14" y2="28" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2,2" />
      <line x1="14" y1="28" x2="14" y2="16" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2,2" />
      <circle cx="14" cy="16" r="2.5" fill="#67e8f9" />
      <circle cx="24" cy="13" r="3" fill="#60a5fa" />
      <circle cx="33" cy="20" r="2.5" fill="#c084fc" />
      <circle cx="25" cy="33" r="3" fill="#38bdf8" />
      <circle cx="14" cy="28" r="2" fill="#a78bfa" />
    </g>,
    // 5: Solar Core / Pulsar
    <g>
      <circle cx="24" cy="24" r="22" fill="url(#av-bg-5)" />
      <circle cx="24" cy="24" r="12" fill="url(#av-core-5)" />
      <circle cx="24" cy="24" r="6" fill="#ffffff" opacity="0.9" />
      <line x1="24" y1="4" x2="24" y2="44" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2,3" opacity="0.7" />
      <line x1="4" y1="24" x2="44" y2="24" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2,3" opacity="0.7" />
    </g>
  ];

  const selected = avatars[id % avatars.length];

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id="av-bg-0" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0369a1"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
        <linearGradient id="av-visor-0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0284c7"/></linearGradient>
        <linearGradient id="av-bg-1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#581c87"/><stop offset="100%" stopColor="#1e1b4b"/></linearGradient>
        <linearGradient id="av-body-1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#b45309"/></linearGradient>
        <linearGradient id="av-bg-2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#065f46"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
        <linearGradient id="av-bg-3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#312e81"/><stop offset="100%" stopColor="#020617"/></linearGradient>
        <linearGradient id="av-bg-4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e293b"/><stop offset="100%" stopColor="#090d16"/></linearGradient>
        <linearGradient id="av-bg-5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#881337"/><stop offset="100%" stopColor="#18181b"/></linearGradient>
        <linearGradient id="av-core-5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f43f5e"/></linearGradient>
      </defs>
      {selected}
    </svg>
  );
};

/* ═══ Animated Space Orbital Background Component ═══ */
const SpaceOrbitalBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const starCount = Math.floor((width * height) / 4500);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        const flicker = Math.sin(t * star.speed * 100 + star.phase) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${star.alpha * flicker})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/2 right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '-2.5s' }} />
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_25px_8px_rgba(34,211,238,0.6)] animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-[180px] rounded-full border border-cyan-400/25 border-dashed animate-orbit-cw-fast">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        </div>
        <div className="absolute inset-[90px] rounded-full border border-blue-500/20 animate-orbit-ccw-medium" style={{ transform: 'rotate(25deg)' }}>
          <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-teal-400 shadow-[0_0_16px_rgba(99,102,241,0.8)]">
            <div className="absolute -top-2 -right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
          </div>
          <div className="absolute -bottom-1.5 left-1/3 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
        </div>
        <div className="absolute inset-0 rounded-full border border-indigo-400/15 animate-orbit-cw-slow" style={{ transform: 'rotate(-15deg)' }}>
          <div className="absolute -top-2.5 left-1/4 w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.7)]" />
          <div className="absolute bottom-12 right-1/4 w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.7)]" />
        </div>
      </div>
    </div>
  );
};

/* ═══ Icons ═══ */
const I = {
  Send: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Download: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Copy: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Upload: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Shield: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  File: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Trash: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  ArrowLeft: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Key: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  CopyPin: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Heart: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  AlertTriangle: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Sparkles: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
};

/* ═══ Helpers ═══ */
function fmtSize(b) {
  if (b == null || isNaN(b) || b === 0) return '0 B';
  const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i];
}

function copyText(text) {
  return navigator.clipboard?.writeText(text) || Promise.resolve();
}

/* ═══ UI Subcomponents ═══ */
const StatusBadge = ({ state }) => {
  const c = {
    disconnected: { l: 'Disconnected', dot: 'bg-gray-400', bg: 'bg-gray-500/20', t: 'text-gray-400', border: 'border-gray-500/30' },
    creating: { l: 'Creating session...', dot: 'bg-blue-400 animate-pulse', bg: 'bg-blue-500/20', t: 'text-blue-400', border: 'border-blue-500/30' },
    waiting: { l: 'Waiting for receiver', dot: 'bg-amber-400 animate-pulse', bg: 'bg-amber-500/20', t: 'text-amber-400', border: 'border-amber-500/30' },
    connecting: { l: 'Connecting...', dot: 'bg-blue-400 animate-pulse', bg: 'bg-blue-500/20', t: 'text-blue-400', border: 'border-blue-500/30' },
    connected: { l: 'Connected', dot: 'bg-green-400 animate-pulse', bg: 'bg-green-500/20', t: 'text-green-400', border: 'border-green-500/30' },
    error: { l: 'Error', dot: 'bg-red-400', bg: 'bg-red-500/20', t: 'text-red-400', border: 'border-red-500/30' },
  };
  const { l, dot, bg, t, border } = c[state] || c.disconnected;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${bg} ${t} ${border}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {l}
    </span>
  );
};

const PBar = ({ progress, color = 'blue' }) => {
  const g = color === 'green' ? 'from-green-500 to-emerald-400' : 'from-blue-500 to-cyan-400';
  const pct = progress == null || isNaN(progress) ? 0 : Math.min(progress, 100);
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${g} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
};

const QRBox = ({ data, label }) => (
  <div className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 animate-bounce-in">
    <div className="bg-white p-3 rounded-xl shadow-lg">
      <QRCodeSVG value={data} size={200} level="M" bgColor="#ffffff" fgColor="#0f172a" />
    </div>
    {label && <p className="text-xs text-white/40">{label}</p>}
  </div>
);

const PWAInstallBanner = ({ prompt, onInstall, onDismiss }) => {
  if (!prompt) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 animate-slide-up">
      <div className="glass p-4 flex items-center gap-3 shadow-2xl">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shrink-0">
          <I.Download className="text-white w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Install SwiftSync</p>
          <p className="text-xs text-white/50">Add to home screen</p>
        </div>
        <button onClick={onDismiss} className="p-2 text-white/40"><I.X className="w-4 h-4" /></button>
        <button onClick={onInstall} className="btn-primary text-xs py-2 px-4">Install</button>
      </div>
    </div>
  );
};

const PinDisplay = ({ pin }) => (
  <div className="flex gap-3 justify-center my-4">
    {pin.split('').map((d, i) => (
      <div key={i} className="w-12 h-16 sm:w-14 sm:h-20 bg-gradient-to-b from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white font-mono">
        {d}
      </div>
    ))}
  </div>
);

const PinInput = ({ value, onChange, onSubmit, disabled, error }) => {
  const refs = useRef([]);

  useEffect(() => {
    for (let i = 0; i < 6; i++) {
      if (!value[i]) { refs.current[i]?.focus(); break; }
    }
  }, []);

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;
    const digit = val.slice(-1);
    const newVals = value.split('');
    newVals[i] = digit;
    const result = newVals.join('');
    onChange(result);
    if (i < 5 && refs.current[i + 1]) refs.current[i + 1].focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newVals = value.split('');
      if (newVals[i]) {
        newVals[i] = '';
        onChange(newVals.join(''));
      } else if (i > 0) {
        newVals[i - 1] = '';
        onChange(newVals.join(''));
        if (refs.current[i - 1]) refs.current[i - 1].focus();
      }
    }
    if (e.key === 'ArrowLeft' && i > 0 && refs.current[i - 1]) {
      e.preventDefault();
      refs.current[i - 1].focus();
    }
    if (e.key === 'ArrowRight' && i < 5 && refs.current[i + 1]) {
      e.preventDefault();
      refs.current[i + 1].focus();
    }
    if (e.key === 'Enter' && value.length === 6 && onSubmit) onSubmit();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData?.getData('text') || '').replace(/[^0-9]/g, '').slice(0, 6);
    onChange(pasted);
    if (pasted.length === 6 && refs.current[5]) refs.current[5].focus();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {[0,1,2,3,4,5].map(i => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-12 h-14 sm:w-14 sm:h-16 bg-white/10 border border-white/20 rounded-xl text-center text-2xl font-bold font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            disabled={disabled}
          />
        ))}
      </div>
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      <button onClick={onSubmit} disabled={disabled || value.length !== 6} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
        <span className="flex items-center justify-center gap-2"><I.Key /> Connect</span>
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════ */
export default function App() {
  const [step, setStep] = useState('home'); // home | sender | receiver
  const [role, setRole] = useState(''); // sender | receiver
  const [connState, setConnState] = useState('disconnected');
  const [pin, setPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [transfers, setTransfers] = useState({});
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [copiedPin, setCopiedPin] = useState(false);

  // Identity States
  const [myProfile, setMyProfile] = useState(getOrGenerateUser);
  const [peerProfile, setPeerProfile] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const connRef = useRef(null);
  const fileRef = useRef(null);
  const tidRef = useRef(0);
  const wasEverConnectedRef = useRef(false);

  /* ─── PWA Install ─── */
  useEffect(() => {
    const h = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  const doInstall = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(() => setInstallPrompt(null));
  };

  const toast_ = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const hideSplash = () => {
    const el = document.getElementById('splash');
    if (!el) return;
    el.classList.add('fade-out');
    setTimeout(() => el.classList.add('hidden'), 600);
  };

  useEffect(() => { requestAnimationFrame(() => hideSplash()); }, []);

  const handlePeerConnected = useCallback((peerInfo) => {
    if (peerInfo) setPeerProfile(peerInfo);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 2200);
  }, []);

  /* ─── Auto-connect from URL PIN parameter ─── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPin = params.get('pin');
    if (urlPin && /^\d{6}$/.test(urlPin)) {
      setInputPin(urlPin);
      setRole('receiver');
      setStep('receiver');
      setError('');
      setTimeout(() => {
        connectWithPin(urlPin);
      }, 500);
    }
  }, []);

  const connectWithPin = useCallback(async (pinToUse) => {
    if (!pinToUse || pinToUse.length !== 6) return;
    setRole('receiver');
    setStep('receiver');
    setConnState('connecting');
    setError('');

    const pc = new PeerConnection(
      (s) => {
        setConnState(s);
        if (s === 'connected') {
          wasEverConnectedRef.current = true;
          handlePeerConnected();
        }
        if (s === 'error') {
          toast_('Connection lost');
          setConnState('disconnected');
        }
      },
      (file) => {
        const id = ++tidRef.current;
        setReceivedFiles(p => [{ id, name: file.name, size: file.size, type: file.type, blob: file, ts: Date.now() }, ...p]);
        toast_('Received: ' + file.name);
      },
      (fid, { progress, status, name, size }) => {
        setTransfers(p => ({ ...p, [fid]: { ...(p[fid] || {}), progress, status, name: name || (p[fid] || {}).name, size: size != null ? size : (p[fid] || {}).size } }));
      },
      (peerInfo) => {
        setPeerProfile(peerInfo);
      }
    );
    pc.setLocalProfile(myProfile);
    connRef.current = pc;

    try {
      await pc.startReceiver(pinToUse);
    } catch (err) {
      setError(err.message || 'Failed to connect');
      setConnState('disconnected');
    }
  }, [myProfile, handlePeerConnected]);

  /* ─── Start as SENDER ─── */
  const startSender = useCallback(async () => {
    const newPin = generatePin();
    setPin(newPin);
    setRole('sender');
    setStep('sender');
    setConnState('creating');
    setError('');

    const pc = new PeerConnection(
      (s) => {
        setConnState(s);
        if (s === 'connected') {
          wasEverConnectedRef.current = true;
          handlePeerConnected();
        }
        if (s === 'error') {
          toast_('Connection lost');
          setConnState('disconnected');
        }
      },
      (file) => {
        const id = ++tidRef.current;
        setReceivedFiles(p => [{ id, name: file.name, size: file.size, type: file.type, blob: file, ts: Date.now() }, ...p]);
        toast_('Received: ' + file.name);
      },
      (fid, { progress, status, name, size }) => {
        setTransfers(p => ({ ...p, [fid]: { ...(p[fid] || {}), progress, status, name: name || (p[fid] || {}).name, size: size != null ? size : (p[fid] || {}).size } }));
      },
      (peerInfo) => {
        setPeerProfile(peerInfo);
      }
    );
    pc.setLocalProfile(myProfile);
    connRef.current = pc;

    try {
      await pc.startSender(newPin);
    } catch (err) {
      setError(err.message || 'Failed');
      setConnState('disconnected');
    }
  }, [myProfile, handlePeerConnected]);

  const connectAsReceiver = useCallback(async () => {
    if (inputPin.length !== 6) return;
    await connectWithPin(inputPin);
  }, [inputPin, connectWithPin]);

  /* ─── Send files ─── */
  const sendFiles = async () => {
    const pc = connRef.current;
    if (!pc || selectedFiles.length === 0) return;
    try {
      const results = await pc.sendFiles(selectedFiles);
      results.forEach(({ fileId, name, size }) => {
        setTransfers(p => ({ ...p, [fileId]: { ...(p[fileId] || {}), name, size, progress: 0, status: 'sending' } }));
      });
    } catch {
      for (const f of selectedFiles) {
        const id = ++tidRef.current;
        setTransfers(p => ({ ...p, [id]: { name: f.name, size: f.size, progress: 0, status: 'error' } }));
      }
    }
    setSelectedFiles([]);
  };

  const downloadFile = (rf) => {
    const url = URL.createObjectURL(rf.blob);
    const a = document.createElement('a'); a.href = url; a.download = rf.name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  /* ─── Disconnect ─── */
  const disconnect = () => {
    if (connRef.current) { connRef.current.disconnect(); connRef.current = null; }
    setStep('home');
    setRole('');
    setConnState('disconnected');
    setPin('');
    setInputPin('');
    setError('');
    setSelectedFiles([]);
    setTransfers({});
    setPeerProfile(null);
    setShowCelebration(false);
    wasEverConnectedRef.current = false;
  };

  const qrUrl = (() => {
    const base = window.location.origin + window.location.pathname;
    return `${base}?pin=${pin}`;
  })();

  const activeCount = Object.values(transfers).filter(t => t.status === 'sending' || t.status === 'receiving').length;
  const wasDisconnected = wasEverConnectedRef.current && connState === 'disconnected';

  return (
    <div className="min-h-screen bg-slate-950 text-white relative flex flex-col overflow-x-hidden">
      
      {/* 🌌 Animated Orbital Background */}
      <SpaceOrbitalBackground />

      {/* 🚀 Well-Designed Connected Announcement Popup Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass p-6 max-w-sm w-full text-center border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.25)] animate-bounce-in relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-16 h-16 mx-auto mb-3 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center p-0.5 shadow-lg">
                <VectorAvatar id={peerProfile?.avatarId ?? 0} size={52} />
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              P2P Link Established
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mt-1">
              Connected with
            </h3>
            <p className="text-base font-semibold text-cyan-300 mt-0.5">
              {peerProfile?.username || 'Cosmic Peer'}
            </p>
            <p className="text-xs text-white/50 mt-3">
              Direct encrypted channel ready for instantaneous transfers.
            </p>
          </div>
        </div>
      )}

      {/* Non-intrusive Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl text-sm font-medium animate-fade-in shadow-xl bg-slate-900/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md max-w-[90vw]">
          {toast}
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 w-full flex-1">
        
        {/* Header & Local Profile Chip */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <VectorAvatar id={myProfile.avatarId} size={34} />
            <div className="text-left leading-tight">
              <p className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">You</p>
              <p className="text-xs font-semibold text-white/90 truncate max-w-[150px]">{myProfile.username}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-extrabold gradient-text tracking-tight">SwiftSync</h1>
            <p className="text-[10px] text-white/40">Secure P2P Orbit</p>
          </div>
        </div>

        {/* Nav bar */}
        {step !== 'home' && (
          <div className="flex items-center justify-between mb-6">
            {step !== 'connected' ? (
              <button onClick={disconnect} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                <I.ArrowLeft /> Back
              </button>
            ) : <div />}
            <StatusBadge state={connState} />
            {connState === 'connected' && (
              <button onClick={disconnect} className="btn-danger text-xs">Disconnect</button>
            )}
          </div>
        )}

        {/* ═══════ HOME ═══════ */}
        {step === 'home' && (
          <div className="animate-slide-up space-y-6">
            <div className="glass p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Quick & Simple</h2>
              <p className="text-white/50 text-sm">One device generates a PIN. The other enters it. Files transfer directly — no server, no uploads.</p>
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="flex-1 m-0 my-1 md:mr-1">
                <button onClick={startSender} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
                  <I.Send /> Send — Generate PIN/QR
                </button>
              </div>
              <div className="flex-1 m-0 my-1 md:ml-1">
                <button onClick={() => { setStep('receiver'); setRole('receiver'); setInputPin(''); setError(''); }} className="btn-secondary w-full flex items-center justify-center gap-2 text-base py-4">
                  <I.Download /> Receive — Enter PIN / Scan QR
                </button>
              </div>
            </div>

            <div className="glass p-6">
              <h3 className="text-sm font-semibold text-white/60 mb-4 text-center">How it works</h3>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 mx-auto mb-1 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold">1</div>
                  Generate PIN / QR
                </div>
                <div className="text-white/20">→</div>
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 mx-auto mb-1 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center font-bold">2</div>
                  Share PIN / QR
                </div>
                <div className="text-white/20">→</div>
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 mx-auto mb-1 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold">3</div>
                  Exchange Files
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ SENDER: Show PIN + QR ═══════ */}
        {step === 'sender' && connState === 'creating' && (
          <div className="animate-slide-up glass p-8 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-white/60">Setting up secure connection…</p>
          </div>
        )}

        {step === 'sender' && connState === 'waiting' && (
          <div className="animate-slide-up space-y-6">
            <div className="glass p-6 text-center">
              <h3 className="text-lg font-semibold mb-1">Share this PIN</h3>
              <p className="text-white/50 text-sm mb-2">Show the QR code or tell them the PIN</p>

              <PinDisplay pin={pin} />

              <div className="flex items-center justify-center gap-3 mt-2">
                <button onClick={() => { copyText(pin); setCopiedPin(true); setTimeout(() => setCopiedPin(false), 2000); }} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
                  {copiedPin ? <I.Check /> : <I.CopyPin />}
                  {copiedPin ? 'Copied!' : 'Copy PIN'}
                </button>
              </div>

              <div className="mt-6">
                <QRBox data={qrUrl} label="Scan to connect instantly" />
              </div>
            </div>

            <div className="glass p-4 border-amber-500/20">
              <p className="text-xs text-amber-400/80 text-center">⏳ Waiting for someone to connect with this PIN…</p>
            </div>
          </div>
        )}

        {/* ═══════ RECEIVER: Enter PIN ═══════ */}
        {step === 'receiver' && (connState === 'disconnected' || connState === 'error') && (
          <div className="animate-slide-up space-y-6">
            <div className="glass p-6">
              <h3 className="text-lg font-semibold mb-1 text-center">Enter PIN</h3>
              <p className="text-white/50 text-sm mb-6 text-center">Type the 6-digit PIN from the sending device</p>

              <PinInput value={inputPin} onChange={setInputPin} onSubmit={connectAsReceiver} disabled={connState === 'connecting'} error={error} />
            </div>
          </div>
        )}

        {step === 'receiver' && connState === 'connecting' && (
          <div className="animate-slide-up glass p-8 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-white/60">Connecting to sender…</p>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        )}

        {/* ═══════ CONNECTION LOST ═══════ */}
        {wasDisconnected && (
          <div className="animate-slide-up glass p-5 border-amber-500/30 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                <I.AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-300">Connection Lost</p>
                <p className="text-xs text-amber-400/60">
                  {role === 'sender' 
                    ? `${peerProfile?.username || 'The receiver'} has disconnected.` 
                    : `${peerProfile?.username || 'The sender'} has disconnected.`}
                </p>
              </div>
            </div>
            <button onClick={disconnect} className="mt-3 w-full btn-secondary text-sm py-2">Back to Home</button>
          </div>
        )}

        {/* ═══════ CONNECTED: Transfer UI with Connected Peer Card ═══════ */}
        {connState === 'connected' && (step === 'sender' || step === 'receiver') ? (
          <div className="animate-slide-up space-y-6">
            
            {/* Connected Peer Profile Bar */}
            <div className="glass p-3.5 border-cyan-500/30 flex items-center justify-between bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <VectorAvatar id={peerProfile?.avatarId ?? 1} size={42} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white truncate">
                      {peerProfile?.username || 'Paired Device'}
                    </p>
                  </div>
                  <p className="text-[11px] text-cyan-300/80 flex items-center gap-1">
                    <I.Sparkles className="w-3 h-3 text-cyan-400 inline" /> Direct P2P Channel
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60">
                  {role === 'sender' ? 'Target' : 'Source'}
                </span>
              </div>
            </div>

            {/* Active transfers */}
            {activeCount > 0 && (
              <div className="glass p-4 border-blue-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-300">{activeCount} active transfer{activeCount > 1 ? 's' : ''}</span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                </div>
                <div className="space-y-3">
                  {Object.entries(transfers).filter(([, t]) => t.status === 'sending' || t.status === 'receiving').map(([id, t]) => (
                    <div key={id}>
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span className="truncate mr-2">{t.name || 'Unknown file'}</span>
                        <span className="shrink-0">{Math.round(t.progress || 0)}%</span>
                      </div>
                      <PBar progress={t.progress} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Send panel */}
            <div className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <I.Upload className="w-5 h-5 text-blue-400" /> Send Files
              </h3>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" multiple onChange={e => setSelectedFiles(Array.from(e.target.files || []))} className="hidden" />
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><I.Upload /></div>
                <p className="text-sm text-white/70 mb-1">{selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected` : 'Tap to select files'}</p>
                <p className="text-xs text-white/40">{selectedFiles.length > 0 ? fmtSize(selectedFiles.reduce((s, f) => s + f.size, 0)) : 'Any file type, any size'}</p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5 border border-white/5">
                      <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 shrink-0"><I.File className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{f.name}</p><p className="text-xs text-white/40">{fmtSize(f.size)}</p></div>
                    </div>
                  ))}
                  <button onClick={sendFiles} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
                    <I.Send /> Send {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                  </button>
                </div>
              )}

              {/* History */}
              {Object.keys(transfers).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white/60 mb-2">Transfer History</h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                    {Object.entries(transfers).reverse().map(([id, t]) => (
                      <div key={id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5 border border-white/5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.status === 'sent' || t.status === 'received' ? 'bg-green-500/20 text-green-400' : t.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {t.status === 'sent' || t.status === 'received' ? <I.Check className="w-4 h-4" /> : t.status === 'error' ? <I.X className="w-4 h-4" /> : <I.Send className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{t.name || 'Unknown file'}</p><p className="text-xs text-white/40">{fmtSize(t.size)}</p></div>
                        {t.status === 'sent' || t.status === 'received' ? <PBar progress={t.progress} color="green" /> : t.status === 'sending' || t.status === 'receiving' ? <PBar progress={t.progress} /> : t.status === 'error' ? <span className="text-xs text-red-400">Failed</span> : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* ═══════ RECEIVED FILES ═══════ */}
        {receivedFiles.length > 0 && (
          <div className="animate-slide-up glass p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <I.Download className="w-5 h-5 text-green-400" /> Received Files {wasDisconnected && <span className="text-xs font-normal text-amber-400/80 ml-1">— available for download</span>}
              </h3>
              <button onClick={() => setReceivedFiles([])} className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1">Clear all</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
              {receivedFiles.map(f => (
                <div key={f.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 shrink-0"><I.Download className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{f.name}</p><p className="text-xs text-white/40">{fmtSize(f.size)}</p></div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => downloadFile(f)} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1"><I.Download className="w-4 h-4" /> Save</button>
                    <button onClick={() => setReceivedFiles(p => p.filter(x => x.id !== f.id))} className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-white/40 transition-all"><I.Trash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center mt-8 pb-8 px-4">
        <div className="space-y-2">
          <p className="text-xs text-white/30">
            <I.Shield className="inline w-3 h-3 mr-1" />
            Files transfer directly via WebRTC • End-to-end encrypted
          </p>
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} SwiftSync. Made with <I.Heart className="inline w-3 h-3 text-red-400 mx-0.5" /> by <span className="text-white/40 font-medium">Saurabh Panchal</span>
          </p>
        </div>
      </footer>

      <PWAInstallBanner prompt={installPrompt} onInstall={doInstall} onDismiss={() => setInstallPrompt(null)} />
    </div>
  );
}