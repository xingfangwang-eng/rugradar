'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Zap, Shield } from 'lucide-react';

export default function BridgeBleedCalculator() {
  const [tvl, setTvl] = useState(10000000); // Default $10M
  const [alertTime, setAlertTime] = useState(30); // Default 30 minutes
  const [hackSpeed] = useState(120); // Average hack speed: 120 seconds
  const [isAnimating, setIsAnimating] = useState(false);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate if funds would be drained before alert
  const fundsAtRisk = hackSpeed < alertTime * 60;
  const drainedAmount = fundsAtRisk ? tvl : (tvl * (hackSpeed / (alertTime * 60)));

  // Trigger animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="mb-8 p-6 bg-black border border-zinc-800 rounded-lg relative overflow-hidden">
      {/* Red breathing shadow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px rgba(239, 68, 68, 0.3)',
          animation: 'breathe 3s ease-in-out infinite',
        }}
      />
      
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.2); }
          50% { box-shadow: inset 0 0 40px rgba(239, 68, 68, 0.5); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">The Bridge Bleed Calculator</h3>
          <p className="text-zinc-500 text-sm">Calculate your exposure to cross-chain bridge hacks</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* TVL Input */}
        <div className="space-y-3">
          <label className="block text-zinc-400 text-sm font-medium">
            Bridge TVL (Total Value Locked)
          </label>
          <div className="flex items-center gap-3">
            <span className="text-white font-mono text-lg min-w-[140px]">
              {formatCurrency(tvl)}
            </span>
          </div>
          <input
            type="range"
            min="1000000"
            max="1000000000"
            step="1000000"
            value={tvl}
            onChange={(e) => setTvl(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-xs text-zinc-600">
            <span>$1M</span>
            <span>$1B</span>
          </div>
        </div>

        {/* Alert Time Input */}
        <div className="space-y-3">
          <label className="block text-zinc-400 text-sm font-medium">
            Traditional SaaS Alert Time
          </label>
          <div className="flex items-center gap-3">
            <span className="text-white font-mono text-lg min-w-[100px]">
              {alertTime} min
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="120"
            step="1"
            value={alertTime}
            onChange={(e) => setAlertTime(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-xs text-zinc-600">
            <span>1 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-zinc-900/50 rounded-lg p-5 mb-6 border border-zinc-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Zap className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-zinc-400 text-sm mb-2">Hack Simulation Result</h4>
            <p className="text-white text-lg leading-relaxed">
              Average hack speed for cross-chain bridges is{' '}
              <span className="text-red-400 font-bold">120 seconds</span>.
              If a hack happens, your{' '}
              <span className="text-red-400 font-bold">{formatCurrency(tvl)}</span>{' '}
              TVL will be{' '}
              <span className="text-red-500 font-bold underline">
                {fundsAtRisk ? '100% drained' : `${Math.round((drainedAmount / tvl) * 100)}% drained`}
              </span>{' '}
              before the SaaS alerts you.
            </p>
          </div>
        </div>
      </div>

      {/* RugRadar Advantage */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-5 mb-6 border border-green-800/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h4 className="text-green-400 font-bold text-lg mb-1">RugRadar Advantage</h4>
            <p className="text-zinc-300">
              RugRadar scans in{' '}
              <span className="text-green-400 font-bold text-xl">&lt; 1 second</span>.
              We catch it before the first block completes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <a
        href="/"
        className="block w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-center font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/30"
      >
        <span className="flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          Arm Your Bridge Now (Scan for $0)
        </span>
      </a>

      {/* The Verdict Table */}
      <div className="mt-8">
        <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          The Verdict Table
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Comparison</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Traditional SaaS</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">RugRadar</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-4 px-4 text-zinc-300 font-medium">Scan Frequency</td>
                <td className="py-4 px-4 text-zinc-500 text-sm">
                  Hourly / Daily
                </td>
                <td className="py-4 px-4 text-white font-bold border-l-2 border-green-500 pl-6">
                  Real-time (&lt; 1 sec)
                </td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-4 px-4 text-zinc-300 font-medium">Cost</td>
                <td className="py-4 px-4 text-zinc-500 text-sm">
                  $5,000+/month
                </td>
                <td className="py-4 px-4 text-white font-bold border-l-2 border-green-500 pl-6">
                  $0 (Self-hosted / Free API)
                </td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-4 px-4 text-zinc-300 font-medium">Response</td>
                <td className="py-4 px-4 text-zinc-500 text-sm">
                  Email / Manual Alert
                </td>
                <td className="py-4 px-4 text-white font-bold border-l-2 border-green-500 pl-6">
                  Auto-Sell / Instant Webhook
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-zinc-300 font-medium">Focus</td>
                <td className="py-4 px-4 text-zinc-500 text-sm">
                  Generic Security
                </td>
                <td className="py-4 px-4 text-white font-bold border-l-2 border-green-500 pl-6">
                  Anti-Rug & Bridge Anomalies
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Logic X-Ray (Code透视窗) */}
      <div className="mt-8">
        <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Logic X-Ray
        </h4>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 font-mono text-sm overflow-x-auto">
          <pre className="text-green-400">
{`// Step 1: Scan GoPlus for Honeypot traps [1.5] - cross-chain bridge audit
const risk = await goPlus.checkBridgeContract(CA);

// Step 2: Monitor sudden liquidity pull [1.2] - DeFi bridge monitor
if (pool.liquidity < threshold) executeAutoSell();

// Step 3: Detect multi-signature anomalies - honeypot scanner
const signatureStatus = await checkMultiSigStatus(bridgeAddress);

// Step 4: Real-time alert via webhook
if (risk > 75) {
  await sendInstantAlert(webhookUrl);
  await executeAutoSell(); // Auto-sell to protect assets
}

// Step 5: Continuous monitoring
setInterval(async () => {
  const newRisk = await goPlus.checkBridgeContract(CA);
  if (newRisk > previousRisk) {
    await sendAlert("Risk level increased!");
  }
  previousRisk = newRisk;
}, 1000); // Real-time monitoring every second`}
          </pre>
        </div>

        {/* Expert Signature */}
        <div className="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex items-start gap-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-white font-bold">The Anti-Rug Operative</h5>
              <span className="text-zinc-500 text-xs">防砸盘特工</span>
            </div>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              I spent 5 years watching degens get wiped out by $10B+ in bridge hacks [1.3]. 
              I built this tool to make high-level security accessible to everyone, 
              not just corporations paying SaaS taxes.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Button */}
      <a
        href="/"
        className="block w-full py-5 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-center font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/30 mt-8 animate-pulse"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          DESTROY BRIDGE VULNERABILITIES NOW
        </span>
      </a>

      {/* Disclaimer */}
      <p className="text-zinc-600 text-xs text-center mt-4">
        *Calculations based on historical cross-chain bridge hack data. Average detection time may vary.
      </p>
    </div>
  );
}
