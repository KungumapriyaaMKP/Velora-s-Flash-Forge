'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Trophy, Gift, Copy, Check, X, ArrowRight } from 'lucide-react';
import { CouponReward } from '../core/domain/storeTypes';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCouponUnlocked: (coupon: CouponReward) => void;
}

const REWARD_OPTIONS: Omit<CouponReward, 'id' | 'unlockedAt' | 'used'>[] = [
  {
    code: 'FORGE50',
    discountType: 'fixed',
    discountValue: 50,
    title: '$50 INSTANT REWARD',
    description: 'Flat $50 discount applied on your next purchase above $100.',
    expiresAt: '2026-12-31T23:59:59Z'
  },
  {
    code: 'FLASH30',
    discountType: 'percentage',
    discountValue: 30,
    title: '30% FLASH SALE BONUS',
    description: '30% OFF entire cart subtotal on any store item.',
    expiresAt: '2026-12-31T23:59:59Z'
  },
  {
    code: 'SUPER100',
    discountType: 'fixed',
    discountValue: 100,
    title: 'GOLDEN $100 CASHBACK',
    description: 'Special VIP Gold Reward! $100 credit added to your account.',
    expiresAt: '2026-12-31T23:59:59Z'
  }
];

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({ isOpen, onClose, onCouponUnlocked }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [reward, setReward] = useState<CouponReward | null>(null);
  const [copied, setCopied] = useState(false);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Pick random reward
      const chosen = REWARD_OPTIONS[Math.floor(Math.random() * REWARD_OPTIONS.length)];
      const newReward: CouponReward = {
        ...chosen,
        id: `reward_${Math.random().toString(36).substring(2, 9)}`,
        unlockedAt: new Date().toISOString(),
        used: false
      };
      setReward(newReward);
      setIsScratched(false);
      setCopied(false);

      setTimeout(initCanvas, 100);
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 180;

    // Draw metallic silver foil background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#64748b');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add foil pattern / text
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE TO REVEAL REWARD ✨', canvas.width / 2, canvas.height / 2 + 5);
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentCount = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparentCount++;
    }

    const percent = (transparentCount / (canvas.width * canvas.height)) * 100;
    if (percent > 35) {
      setIsScratched(true);
      if (reward) {
        onCouponUnlocked(reward);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleCopy = () => {
    if (reward) {
      navigator.clipboard.writeText(reward.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !reward) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl shadow-amber-500/20 relative overflow-hidden text-center text-slate-100">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 mb-3 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 tracking-wider">
          PAYMENT CONFIRMED!
        </h2>
        <p className="text-xs text-slate-300 mt-1 mb-6">
          Scratch the golden card below to unlock your surprise reward coupon code!
        </p>

        {/* Scratch Card Container */}
        <div className="relative w-[320px] h-[180px] mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 flex flex-col items-center justify-center p-4">
          {/* Underneath Revealed Content */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-black/40 px-3 py-0.5 rounded-full border border-amber-400/30">
              {reward.title}
            </span>
            <div className="text-3xl font-black font-mono text-white tracking-widest my-1 drop-shadow-md">
              {reward.code}
            </div>
            <p className="text-[11px] text-amber-100/90 max-w-[260px] mx-auto leading-tight">
              {reward.description}
            </p>
          </div>

          {/* Interactive Scratch Canvas Overlay */}
          {!isScratched && (
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="absolute inset-0 cursor-pointer touch-none"
            />
          )}
        </div>

        {/* Revealed Actions */}
        {isScratched ? (
          <div className="mt-6 space-y-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Coupon Unlocked & Saved to Rewards Locker!
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Code!' : 'Copy Code'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1"
              >
                Done <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 mt-4 italic">
            Drag mouse or touch to scratch off the foil coating above
          </p>
        )}
      </div>
    </div>
  );
};
