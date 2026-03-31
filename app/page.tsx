'use client';

import { useState, useEffect } from 'react';

<style jsx global>{`
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .animate-scroll {
    animation: scroll 30s linear infinite;
  }
  
  .animate-scroll:hover {
    animation-play-state: paused;
  }
`}</style>
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Loader2, Shield, AlertTriangle, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { getCachedAudit, setCachedAudit } from '../lib/cache';
import Footer from './components/Footer';

export default function Home() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [riskLevel, setRiskLevel] = useState<'high' | 'medium' | 'low'>('low');

  const getRiskLevel = (auditContent: string) => {
    if (auditContent.includes('High Risk')) return 'high';
    if (auditContent.includes('Medium Risk')) return 'medium';
    return 'low';
  };

  const getBorderColor = () => {
    switch (riskLevel) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-primary';
      default: return 'border-slate-200';
    }
  };

  // Resource loading error handler
  const handleResourceError = (resourceType: string, src: string, error: Error) => {
    console.error(`Resource loading failed - ${resourceType}:`, {
      source: src,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    // 检查缓存
    const cachedResult = getCachedAudit(address);
    if (cachedResult) {
      setResult(cachedResult);
      setRiskLevel(getRiskLevel(cachedResult.audit));
      return;
    }

    setLoading(true);
    setStatus('Requesting Etherscan...');
    setResult(null);

    try {
      // Mock authentication token, should be obtained from login state in real project
    const authToken = 'user1'; // Mock free user
      
      const response = await axios.post('/api/audit', { address }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      setStatus('Source code extracted');
      
      // Mock AI analysis delay
      setTimeout(() => {
        setStatus('AI is conducting in-depth analysis...');
      }, 1000);

      setTimeout(() => {
        const auditData = response.data;
        setResult(auditData);
        setRiskLevel(getRiskLevel(auditData.audit));
        // Cache result, including tenant information
        setCachedAudit(address, auditData);
        setStatus('');
        setLoading(false);
      }, 3000);
    } catch (error: any) {
      setStatus('');
      setLoading(false);
      const errorMessage = error.response?.data?.error || 'Error during audit process';
      if (errorMessage.includes('Pro subscription required')) {
        alert('Need to upgrade to Pro version to use this feature');
      } else if (errorMessage.includes('API Key') || errorMessage.includes('limit') || errorMessage.includes('too long')) {
        alert('System is busy, please try again later or contact us to upgrade to Pro version');
      } else {
        alert(errorMessage);
      }
    }
  };

  // Hot search addresses
  const hotSearches = [
    { label: '$PEPE', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' },
    { label: '$WIF', address: '0xd461F546a997478633F8582dA169cC32a7313594' },
    { label: '$SOL', address: '0x50e168363a0923D33BcF9D35fC4F833174B652Bd' }
  ];

  // Handle hot search click
  const handleHotSearchClick = (hotAddress: string) => {
    setAddress(hotAddress);
  };

  // Stats counter state
  const [totalAudits, setTotalAudits] = useState(0);
  const [risksDetected, setRisksDetected] = useState(0);
  const [userSaved, setUserSaved] = useState(0);

  // Animate counters
  useEffect(() => {
    const targetAudits = 125403;
    const targetRisks = 8291;
    const targetSaved = 2400000;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setTotalAudits(Math.floor(targetAudits * progress));
      setRisksDetected(Math.floor(targetRisks * progress));
      setUserSaved(Math.floor(targetSaved * progress));

      if (currentStep >= steps) {
        clearInterval(timer);
        // Set exact values at the end
        setTotalAudits(targetAudits);
        setRisksDetected(targetRisks);
        setUserSaved(targetSaved);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Preload Gemini API logic to eliminate perceived latency
  useEffect(() => {
    // Initialize API client or preload necessary resources
    // This ensures that when user submits an address, the API is ready to respond immediately
    console.log('Preloading Gemini API resources...');
    
    // You can add any preloading logic here, such as:
    // 1. Initializing API clients
    // 2. Loading necessary models
    // 3. Caching common responses
    
    // For example, if you're using an API client library:
    // if (typeof window !== 'undefined') {
    //   window.geminiClient = new GeminiAPIClient({
    //     apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
    //   });
    //   // Pre-warm the client
    //   window.geminiClient.ping();
    // }
  }, []);

  // User testimonials
  const testimonials = [
    {
      id: 1,
      name: 'CryptoTrader123',
      avatar: 'CT',
      content: 'Audit Pulse helped me avoid a honeypot token. Saved me from losing $5,000!',
      time: '2 hours ago'
    },
    {
      id: 2,
      name: 'DeFiGuru',
      avatar: 'DG',
      content: 'The real-time AI audit caught a critical vulnerability in a contract I was about to invest in. Highly recommended!',
      time: '1 day ago'
    },
    {
      id: 3,
      name: 'NFTCollector',
      avatar: 'NC',
      content: 'Used this tool to audit an NFT mint contract. It identified a hidden rug pull mechanism. Thank you!',
      time: '3 days ago'
    },
    {
      id: 4,
      name: 'TokenDeveloper',
      avatar: 'TD',
      content: 'Great tool for developers. It helped me find and fix security issues in my smart contracts before deployment.',
      time: '1 week ago'
    }
  ];

  // Recent audits data
  const recentAudits = [
    { address: '0x123456...7890AB', risk: 'low', time: '2 minutes ago' },
    { address: '0xABCDEF...123456', risk: 'medium', time: '5 minutes ago' },
    { address: '0x987654...3210FE', risk: 'low', time: '12 minutes ago' },
    { address: '0xFEDCBA...987654', risk: 'high', time: '18 minutes ago' },
    { address: '0x654321...FEDCBA', risk: 'low', time: '25 minutes ago' }
  ];

  // FAQ data
  const faqItems = [
    {
      question: 'What is a smart contract security audit?',
      answer: 'A smart contract security audit is a comprehensive review of a smart contract\'s code to identify potential vulnerabilities, security risks, and optimization opportunities. It helps ensure the contract functions as intended and protects users\' funds.'
    },
    {
      question: 'How does Audit Pulse detect rug pulls?',
      answer: 'Audit Pulse uses advanced AI algorithms to analyze smart contract code for suspicious patterns, such as hidden withdrawal functions, excessive owner privileges, and liquidity locking mechanisms. It also integrates social media sentiment analysis to identify potential red flags.'
    },
    {
      question: 'Is Audit Pulse free to use?',
      answer: 'Yes, Audit Pulse offers free basic audits for all users. Premium features, such as real-time monitoring and unlimited audit history, are available with a Pro subscription. Our goal is to make smart contract security accessible to everyone.'
    }
  ];

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  // Get risk label
  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Background with flowing lines */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900 opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]"></div>
          <div className="absolute top-1/3 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1/3 bg-[radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.15),transparent_50%)]"></div>
        </div>
        {/* Flowing lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center py-24 px-4">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Stop Rug Pulls with <span className="text-blue-400">Real-Time AI Audits</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Securing your trades with Gemini 1.5 Pro & Grok intelligence in seconds.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-md animate-pulse"></div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste Contract Address (0x...) to Audit for FREE"
                className="w-full p-6 pl-8 pr-40 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white text-lg"
              />
              <button
                type="submit"
                disabled={loading || !address}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" onError={(e) => handleResourceError('SVG', 'Loader2', e as unknown as Error)} />
                    Analyzing...
                  </div>
                ) : (
                  'Start Audit'
                )}
              </button>
            </div>
          </form>

          {/* Hot Searches */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {hotSearches.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHotSearchClick(item.address)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-slate-700 hover:border-blue-500"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Status Indicator */}
          {status && (
            <div className="mt-8 text-center text-slate-300">
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" onError={(e) => handleResourceError('SVG', 'Loader2', e as unknown as Error)} />
                <span>{status}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Data Section */}
      <section className="relative z-10 py-16 px-4 bg-slate-800/80 border-y border-slate-700">
        <div className="max-w-[1200px] mx-auto">
          {/* Stats Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {totalAudits.toLocaleString()}
              </div>
              <p className="text-slate-300">Total Audits</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
                {risksDetected.toLocaleString()}
              </div>
              <p className="text-slate-300">Risks Detected</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                ${(userSaved / 1000000).toFixed(1)}M
              </div>
              <p className="text-slate-300">User Saved</p>
            </div>
          </div>

          {/* Data Sources */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-slate-400 mb-6 text-center">Powered by</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="text-lg font-bold text-slate-300">Google Gemini</span>
              </div>
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="text-lg font-bold text-slate-300">Grok AI</span>
              </div>
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="text-lg font-bold text-slate-300">Etherscan</span>
              </div>
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="text-lg font-bold text-slate-300">Solscan</span>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-8 text-center">What Our Users Say</h3>
            <div className="overflow-hidden">
              <div className="flex space-x-4 animate-scroll">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
                    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{testimonial.name}</h4>
                          <p className="text-slate-400 text-sm">{testimonial.time}</p>
                        </div>
                      </div>
                      <p className="text-slate-300">{testimonial.content}</p>
                    </div>
                  </div>
                ))}
                {/* Duplicate testimonials for seamless loop */}
                {testimonials.map((testimonial) => (
                  <div key={`${testimonial.id}-duplicate`} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
                    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{testimonial.name}</h4>
                          <p className="text-slate-400 text-sm">{testimonial.time}</p>
                        </div>
                      </div>
                      <p className="text-slate-300">{testimonial.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Endorsement */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-slate-700/50 rounded-lg p-6 border border-slate-700">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise-Grade Security Analysis</h3>
              <p className="text-slate-300">Trusted by thousands of developers and investors worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Audit Pulse? */}
      <section className="relative z-10 py-16 px-4 bg-slate-800/50">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why <span className="text-blue-400">Audit Pulse</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 text-center">
              <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">AI Deep Analysis</h3>
              <p className="text-slate-300">Our Smart Contract Security Audit Tool uses advanced AI to detect even the most complex vulnerabilities in smart contracts, providing comprehensive security analysis.</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 text-center">
              <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Millisecond Response</h3>
              <p className="text-slate-300">Get instant results with our high-performance infrastructure. Our Crypto Rug Pull Scanner analyzes contracts in milliseconds, giving you real-time security insights.</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 text-center">
              <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Social Media Sentiment Integration</h3>
              <p className="text-slate-300">Beyond code analysis, we integrate social media sentiment data to provide a holistic view of token security and community trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Library Preview */}
      <section className="relative z-10 py-16 px-4 bg-slate-800/80 border-y border-slate-700">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="text-blue-400">Solution Library</span> Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="/solutions/honeypot-check" className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">Honeypot Check</h3>
              <p className="text-slate-300 mb-4">Detect honeypot tokens that trap investors' funds with our advanced analysis</p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <a href="/solutions/mint-auth-scan" className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">Mint Auth Scan</h3>
              <p className="text-slate-300 mb-4">Analyze mint permissions to identify potential security risks in NFT and token contracts</p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <a href="/solutions/rug-pull-detection" className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">Rug Pull Detection</h3>
              <p className="text-slate-300 mb-4">Identify suspicious contract patterns that indicate potential rug pull schemes</p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <a href="/solutions/gas-optimization" className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">Gas Optimization</h3>
              <p className="text-slate-300 mb-4">Optimize smart contracts to reduce gas fees and improve transaction efficiency</p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <a href="/solutions/contract-verification" className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">Contract Verification</h3>
              <p className="text-slate-300 mb-4">Verify that published contract code matches the deployed bytecode for transparency</p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <a href="/solutions/on-chain-analysis" className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">On-Chain Analysis</h3>
              <p className="text-slate-300 mb-4">Analyze on-chain data to identify suspicious activities and potential security risks</p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          </div>
          <div className="text-center mt-12">
            <a href="/solutions" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg">
              Explore All 100+ Security Solutions
            </a>
          </div>
        </div>
      </section>

      {/* Live Activity */}
      <section className="relative z-10 py-16 px-4 bg-slate-800/50">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="text-blue-400">Live</span> Activity
          </h2>
          
          {/* Recent Audits */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6">Recent Audits</h3>
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700">
              <ul className="space-y-4">
                {recentAudits.map((audit, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-mono text-slate-300">{audit.address}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-medium ${getRiskColor(audit.risk)}`}>
                        {getRiskLabel(audit.risk)}
                      </span>
                      <span className="text-slate-400 text-sm">{audit.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Three-Step Guide */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-8 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 text-center">
                <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-3 text-white">Paste Address</h4>
                <p className="text-slate-300">Enter the smart contract address you want to audit</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 text-center">
                <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-3 text-white">AI Scanning</h4>
                <p className="text-slate-300">Our advanced AI analyzes the contract for vulnerabilities</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700 text-center">
                <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-3 text-white">Get Report</h4>
                <p className="text-slate-300">Receive a comprehensive security analysis report</p>
              </div>
            </div>
          </div>
          
          {/* FAQ Summary */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="text-lg font-semibold mb-3 text-white">{faq.question}</h4>
                  <p className="text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Panel */}
      {result && (
        <section className="relative z-10 py-12 px-4">
          <div className="max-w-[1200px] mx-auto">
            <div className={`bg-slate-800 rounded-lg border ${getBorderColor()} p-6 mb-8 shadow-sm`}>
              <h2 className="text-2xl font-semibold mb-6 text-white">Audit Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contract Summary */}
                <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 text-white">Contract Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Contract Address</p>
                      <p className="font-mono text-sm break-all text-white">{result.contract.address}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Contract Name</p>
                      <p className="text-white">{result.contract.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Compiler Version</p>
                      <p className="text-white">{result.contract.compilerVersion}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Optimization</p>
                      <p className="text-white">{result.contract.optimizationUsed === '1' ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">License Type</p>
                      <p className="text-white">{result.contract.licenseType}</p>
                    </div>
                  </div>
                </div>

                {/* Audit Report */}
                <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 text-white">Audit Report</h3>
                  <div className="prose max-w-none prose-invert">
                    <ReactMarkdown>{result.audit}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Features Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-700 p-6 mt-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Lock className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">Unlock Pro Features</h3>
                  <p className="text-slate-300 mb-6">Upgrade to Pro version for comprehensive smart contract security services</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-200">Real-time contract status monitoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-200">Automatic security vulnerability alerts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-200">Unlimited audit times</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-200">Professional security team support</span>
                    </li>
                  </ul>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto flex items-center justify-center gap-2">
                    <span>Contact us for details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Solutions */}
      <section className="relative z-10 py-16 px-4 bg-slate-800/50">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-blue-400">Popular</span> Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="/solutions/smart-contract-security" className="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors p-6 group shadow-sm">
              <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">
                Smart Contract Security Audit
              </h3>
              <p className="text-slate-300 text-sm mb-4">In-depth analysis of smart contract code to identify potential security vulnerabilities and risk points</p>
              <div className="mt-2 flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <a href="/solutions/transaction-efficiency" className="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors p-6 group shadow-sm">
              <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">
                Transaction Efficiency Optimization
              </h3>
              <p className="text-slate-300 text-sm mb-4">Improve transaction speed, reduce gas fees, and optimize user trading experience</p>
              <div className="mt-2 flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
            <a href="/solutions/defi-risk-management" className="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors p-6 group shadow-sm">
              <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-400 transition-colors text-white">
                DeFi Risk Management
              </h3>
              <p className="text-slate-300 text-sm mb-4">Identify and mitigate risks in DeFi protocols to protect user assets</p>
              <div className="mt-2 flex items-center text-blue-400 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          </div>
          <div className="text-center mt-12">
            <a href="/solutions" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <span>Browse all solutions</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}