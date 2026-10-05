'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, Sparkles, Tag, ArrowRight, X } from 'lucide-react';
import { CouponReward } from '../core/domain/storeTypes.js';

interface RewardsLockerProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedCoupons: CouponReward[];
  onApplyCoupon: (code: string) => void;
}

export const RewardsLocker: React.FC<RewardsLockerProps> = ({
  isOpen,
  onClose,
  unlockedCoupons,
  onApplyCoupon
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (coupon: CouponReward) => {
    navigator.clipboard.writeText(coupon.code);
    setCopiedId(coupon.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl text-slate-100">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Rewards Vault & Coupons</h3>
                <p className="text-xs text-slate-400">Your unlocked scratch card rewards ({unlockedCoupons.length})</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Coupon List */}
          {unlockedCoupons.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Tag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">No Coupons Unlocked Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Complete any flash sale purchase or test checkout to earn interactive scratch card rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {unlockedCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-gradient-to-r from-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-4 relative overflow-hidden space-y-3 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} DISCOUNT`}
                      </span>
                      <h4 className="text-base font-black text-white mt-1.5">{coupon.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{coupon.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="font-mono text-sm font-extrabold text-amber-300 tracking-widest px-2">
                      {coupon.code}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(coupon)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        {copiedId === coupon.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === coupon.id ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={() => {
                          onApplyCoupon(coupon.code);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        Apply <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
          Velora Rewards Locker • Instant Coupon Storage Engine
        </div>
      </div>
    </div>
  );
};
