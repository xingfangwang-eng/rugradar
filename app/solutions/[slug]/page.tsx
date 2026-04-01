'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import painPointsData from '../../../data/pain-points.json';
import comparisonData from '../../../data/comparison-data.json';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, ArrowLeft, Shield, CheckCircle, AlertTriangle, Menu, X, Search, ChevronUp } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import TableOfContents from '../../components/TableOfContents';
import VerdictTable from '../../components/VerdictTable';
import Footer from '../../components/Footer';

type PainPoint = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
};

export default function SolutionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [painPoint, setPainPoint] = useState<PainPoint | null>(null);
  const [relatedSolutions, setRelatedSolutions] = useState<PainPoint[]>([]);
  const [articleContent, setArticleContent] = useState<string>('');
  const [processedContent, setProcessedContent] = useState<string>('');
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>([]);
  const [howToSteps, setHowToSteps] = useState<Array<{ name: string; text: string }>>([]);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string }>>([]);
  const [showToc, setShowToc] = useState(false);
  const [showFloatingTool, setShowFloatingTool] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [comparisonInfo, setComparisonInfo] = useState<{ keyword: string; saasPrice: string } | null>(null);
  const [tvl, setTvl] = useState<number>(10000000);
  const [notificationTime, setNotificationTime] = useState<number>(30);

  useEffect(() => {
    if (!slug) return;
    const foundPainPoint = painPointsData.find(p => p.slug === slug);
    if (foundPainPoint) {
      setPainPoint(foundPainPoint);
      
      const sameCategorySolutions = painPointsData
        .filter(p => p.category === foundPainPoint.category && p.slug !== slug)
        .slice(0, 3);
      setRelatedSolutions(sameCategorySolutions);
      
      const foundComparison = comparisonData.find(c => c.slug === slug);
      if (foundComparison) {
        setComparisonInfo({
          keyword: foundComparison.keyword,
          saasPrice: foundComparison.comparison.monthly_tax.traditional_saas
        });
      }
      
      const content = `# ${foundPainPoint.title}\n\n## Current State of Problem\n\n${foundPainPoint.description}\n\nThis is a significant issue in the blockchain space, affecting many users and projects.\n\n## Technical Principles\n\nThe technical root cause of this problem lies in the way smart contracts are designed and executed. Blockchain technology relies on immutable code, which means that once a contract is deployed, its logic cannot be changed. This creates unique challenges for security and functionality.\n\n## Risk Mitigation Strategies\n\n1. **Thorough Code Review**: Conduct comprehensive code reviews before deployment.\n2. **Security Audits**: Engage professional auditors to identify vulnerabilities.\n3. **Formal Verification**: Use mathematical proofs to verify contract behavior.\n4. **Gradual Deployment**: Start with small amounts of funds and gradually increase.\n5. **Bug Bounties**: Offer rewards for identifying security issues.\n\n## How Audit Pulse Can Help\n\nAudit Pulse provides an AI-powered solution to address this problem through:\n\n- **Automated Security Scanning**: Quickly identify potential vulnerabilities in smart contracts.\n- **Real-time Monitoring**: Keep track of contract behavior and detect anomalies.\n- **Comprehensive Reports**: Receive detailed analysis with actionable recommendations.\n- **User-Friendly Interface**: Easily understand complex security issues without deep technical knowledge.\n\nBy leveraging advanced AI technology, Audit Pulse helps developers and users mitigate risks and ensure the security of their smart contracts.`;
      setArticleContent(content);
      
      const headingRegex = /^##\s+(.*)$/gm;
      const extractedHeadings: Array<{ id: string; text: string }> = [];
      let match;
      while ((match = headingRegex.exec(content)) !== null) {
        const text = match[1].trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        extractedHeadings.push({ id, text });
      }
      setHeadings(extractedHeadings);
      
      let processed = content;
      painPointsData.forEach(p => {
        if (p.slug !== slug && processed.includes(p.title)) {
          const regex = new RegExp(`\\b${p.title}\\b`, 'g');
          processed = processed.replace(regex, `[${p.title}](/solutions/${p.slug})`);
        }
      });
      setProcessedContent(processed);
      
      const faqs = [
        {
          question: `What is ${foundPainPoint.title}?`,
          answer: foundPainPoint.description
        },
        {
          question: `How does ${foundPainPoint.title} affect blockchain projects?`,
          answer: "This is a significant issue in the blockchain space, affecting many users and projects. It creates unique challenges for security and functionality."
        },
        {
          question: `What are the technical principles behind ${foundPainPoint.title}?`,
          answer: "The technical root cause of this problem lies in the way smart contracts are designed and executed. Blockchain technology relies on immutable code, which means that once a contract is deployed, its logic cannot be changed."
        },
        {
          question: `How can Audit Pulse help with ${foundPainPoint.title}?`,
          answer: "Audit Pulse provides an AI-powered solution to address this problem through automated security scanning, real-time monitoring, comprehensive reports, and a user-friendly interface."
        }
      ];
      setFaqItems(faqs);
      
      const steps = [
        {
          name: "Conduct Thorough Code Review",
          text: "Perform comprehensive code reviews before deployment to identify potential issues."
        },
        {
          name: "Engage Professional Security Auditors",
          text: "Hire expert auditors to conduct thorough security audits of your smart contracts."
        },
        {
          name: "Implement Formal Verification",
          text: "Use mathematical proofs to verify the behavior of your smart contracts."
        },
        {
          name: "Deploy Gradually",
          text: "Start with small amounts of funds and gradually increase to minimize risk."
        },
        {
          name: "Offer Bug Bounties",
          text: "Reward individuals who identify security issues in your smart contracts."
        },
        {
          name: "Use Audit Pulse",
          text: "Leverage AI-powered tools to continuously monitor and analyze your smart contracts."
        }
      ];
      setHowToSteps(steps);
    } else {
      router.push('/solutions');
    }
  }, [slug, router, painPointsData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowFloatingTool(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!painPoint || faqItems.length === 0 || howToSteps.length === 0) return;

    const createJsonLdScript = (data: any) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
      return script;
    };

    const faqData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    };

    const howToData = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Mitigate ${painPoint.title}`,
      step: howToSteps.map((step) => ({
        '@type': 'HowToStep',
        name: step.name,
        text: step.text
      }))
    };

    const comparisonSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'ComparisonChart',
      name: `Comparison: Traditional SaaS vs RugRadar for ${painPoint.title}`,
      description: 'A detailed comparison between traditional SaaS solutions and RugRadar for addressing blockchain security issues',
      url: `https://localhost:3002/solutions/${slug}#comparison-table`,
      image: 'https://example.com/comparison-chart.png',
      itemReviewed: painPoint.title,
      reviewAspect: ['Detection Speed', 'Monthly Tax (Cost)', 'Privacy Control'],
      audience: {
        '@type': 'Audience',
        name: 'Blockchain developers and investors'
      }
    };

    const faqScript = createJsonLdScript(faqData);
    const howToScript = createJsonLdScript(howToData);
    const comparisonScript = createJsonLdScript(comparisonSchemaData);

    return () => {
      if (document.head.contains(faqScript)) {
        document.head.removeChild(faqScript);
      }
      if (document.head.contains(howToScript)) {
        document.head.removeChild(howToScript);
      }
      if (document.head.contains(comparisonScript)) {
        document.head.removeChild(comparisonScript);
      }
    };
  }, [painPoint, faqItems, howToSteps, slug]);

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenAddress) {
      router.push(`/?address=${encodeURIComponent(tokenAddress)}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!painPoint) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Loading...</h1>
            <p className="text-slate-500">Retrieving solution details</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="py-6 px-4 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            <span className="text-primary">Audit Pulse</span>
          </a>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="/" className="text-slate-600 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/solutions" className="text-slate-600 hover:text-primary transition-colors">Solutions</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2 text-slate-700">
            <Shield className="w-5 h-5 text-primary" />
            <span>Scanned 10,000+ contracts</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <span>Identified 500+ Rug Pull cases</span>
          </div>
        </div>
      </div>

      <main className="py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          <Breadcrumbs 
            items={[
              { label: 'Home', url: '/' },
              { label: 'Solutions', url: '/solutions' },
              { label: painPoint.title, url: `https://localhost:3002/solutions/${slug}`, isCurrent: true }
            ]} 
          />

          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowToc(!showToc)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
            >
              {showToc ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Hide Table of Contents</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4" />
                  <span>Show Table of Contents</span>
                </>
              )}
            </button>
            {showToc && (
              <div className="mt-4">
                <TableOfContents headings={headings} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 hidden lg:block">
              <TableOfContents headings={headings} />
            </div>

            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">{painPoint.title}</h1>
              
              {(painPoint.title.toLowerCase().includes('risk') || painPoint.title.toLowerCase().includes('scam') || painPoint.title.toLowerCase().includes('rug')) && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-medium text-red-800 mb-1">Warning: High Risk Alert</h3>
                      <p className="text-red-700">This vulnerability poses a significant risk to your assets. Take immediate action to protect your investments.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Suspect your token?</h3>
                <p className="text-slate-600 mb-4">Enter the address and AI will immediately scan for this vulnerability.</p>
                <form onSubmit={handleAuditSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token address"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Audit</span>
                  </button>
                </form>
              </div>
              
              {painPoint?.slug === 'bridge-security' && (
                <div className="mb-10 bg-zinc-900 text-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    The Bridge Bleed Calculator
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Your Bridge TVL (in USD)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1000000"
                          max="100000000"
                          step="1000000"
                          value={tvl}
                          onChange={(e) => setTvl(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-lg font-bold text-white">${tvl.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Traditional SaaS Notification Time (minutes)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="120"
                          step="1"
                          value={notificationTime}
                          onChange={(e) => setNotificationTime(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-lg font-bold text-white">{notificationTime} min</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-zinc-800 rounded-lg border border-zinc-700">
                      <p className="text-zinc-300 mb-4">
                        <span className="text-red-400 font-semibold">WARNING:</span> Average hack speed for cross-chain bridges is 120 seconds. 
                        If a hack happens, your ${tvl.toLocaleString()} TVL will be drained before the SaaS alerts you.
                      </p>
                      <p className="text-green-400 font-bold text-lg">
                        RugRadar scans in &lt; 1 second.[1] We catch it before the first block completes.[1.5]
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 animate-pulse flex items-center justify-center gap-2">
                        <span>Arm Your Bridge Now (Scan for $0)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {comparisonInfo && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900">Why the current {comparisonInfo.keyword} SaaS industry is failing you</h2>
                  <VerdictTable keyword={comparisonInfo.keyword} saasPrice={comparisonInfo.saasPrice} />
                  
                  <div className="mt-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      LOGIC X-RAY
                    </h3>
                    <div className="bg-zinc-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500"></span>
                          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                          <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        </div>
                        <div className="text-zinc-400 text-xs">logic-xray.js</div>
                      </div>
                      <pre className="whitespace-pre">{`// Step 1: Scan GoPlus for Honeypot traps [1.5]
const risk = await goPlus.checkBridgeContract(CA);

// Step 2: Monitor sudden liquidity pull [1.2]
if (pool.liquidity < threshold) executeAutoSell();

// Step 3: Detect smart contract vulnerabilities [1.5]
const vulnerabilities = await scanContractForVulnerabilities(CA);

// Step 4: Analyze token ownership distribution [1.2]
const ownership = await analyzeTokenOwnership(CA);

// Step 5: Cross-chain bridge security check [1.5]
const bridgeRisk = await checkBridgeSecurity(bridgeAddress);

// Step 6: Real-time alert system [1.1]
if (risk > highThreshold) sendInstantAlert();`}</pre>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-zinc-900 text-white p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-green-400 mb-2">The Anti-Rug Operative</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          I spent 5 years watching degens get wiped out by $10B+ in bridge hacks [1.3]. I built this tool to make high-level security accessible to everyone, not just corporations paying SaaS taxes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 animate-pulse flex items-center justify-center gap-2">
                      <span>DESTROY BRIDGE VULNERABILITIES NOW</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none mb-8">
                <ReactMarkdown>{processedContent}</ReactMarkdown>
              </div>
              <div className="mt-12 flex justify-between items-center">
                <button 
                  onClick={() => router.push('/solutions')}
                  className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to solutions list</span>
                </button>
                {slug !== 'bridge-security' && (
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Related Solutions</h3>
                <ul className="space-y-4">
                  {relatedSolutions.map((solution) => (
                    <li key={solution.id}>
                      <a 
                        href={`/solutions/${solution.slug}`}
                        className="flex flex-col hover:text-primary transition-colors"
                      >
                        <span className="text-slate-900 font-medium">{solution.title}</span>
                        <span className="text-sm text-slate-500 truncate">{solution.description}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-slate-900">Need professional security audit?</h3>
                </div>
                <p className="text-slate-500 mb-4">Our expert team can provide comprehensive security audit services for your smart contracts.</p>
                <a href="mailto:457239850@qq.com" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Contact us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showFloatingTool && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
          <button
            onClick={scrollToTop}
            className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg transition-colors flex items-center justify-center"
            aria-label="Quick audit"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}