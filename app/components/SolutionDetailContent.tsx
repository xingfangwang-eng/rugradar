'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import painPointsData from '../../data/pain-points.json';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, ArrowLeft, Shield, CheckCircle, AlertTriangle, Menu, X, Search, ChevronUp } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import TableOfContents from './TableOfContents';
import Footer from './Footer';

type PainPoint = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
};

export default function SolutionDetailContent() {
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
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    console.log('useEffect started');
    console.log('Slug:', slug);
    console.log('Pain points data length:', painPointsData.length);
    if (!slug) {
      console.log('Slug is undefined');
      return;
    }
    const foundPainPoint = painPointsData.find(p => p.slug === slug);
    console.log('Found pain point:', foundPainPoint);
    if (foundPainPoint) {
      setPainPoint(foundPainPoint);
      
      // Smart related recommendations: find 3 most relevant articles in the same category
      const sameCategorySolutions = painPointsData
        .filter(p => p.category === foundPainPoint.category && p.slug !== slug)
        .slice(0, 3);
      setRelatedSolutions(sameCategorySolutions);
      
      // Mock article content, should be obtained via API in real project
      let content = '';
      
      // Special content for bridge-security page with SEO keywords
      if (slug === 'bridge-security') {
        content = `# ${foundPainPoint.title}\n\n## Current State of Cross-chain Bridge Security\n\n${foundPainPoint.description}\n\nCross-chain bridge audit has become one of the most critical challenges in the DeFi ecosystem. With billions of dollars locked in various bridge protocols, the need for comprehensive DeFi bridge monitor solutions has never been more urgent.\n\n## Technical Principles and Vulnerabilities\n\nCross-chain bridges operate through complex multi-signature mechanisms and smart contract interactions. The technical root cause of bridge security issues lies in:\n\n- **Multi-signature Vulnerabilities**: Many bridges rely on a small set of validators, creating centralization risks\n- **Smart Contract Bugs**: Cross-chain logic is inherently complex and prone to exploits\n- **Honeypot Mechanisms**: Malicious actors can embed honeypot scanner evading techniques in bridge contracts\n- **Oracle Manipulation**: Price feed manipulation can lead to incorrect asset valuations\n\n## Risk Mitigation Strategies\n\n1. **Cross-chain Bridge Audit**: Conduct comprehensive security audits by multiple independent firms\n2. **DeFi Bridge Monitor**: Implement real-time monitoring systems to detect suspicious activities\n3. **Honeypot Scanner Integration**: Use advanced detection tools to identify malicious contract logic\n4. **Multi-signature Enhancement**: Increase the number of required signatures and diversify validators\n5. **Time-locked Transactions**: Add delay mechanisms for large fund transfers\n6. **Bug Bounty Programs**: Offer substantial rewards for identifying security vulnerabilities\n\n## How RugRadar Can Help\n\nRugRadar provides an AI-powered cross-chain bridge audit solution through:\n\n- **Real-time DeFi Bridge Monitor**: Continuously scan bridge activities across multiple chains\n- **Advanced Honeypot Scanner**: Detect malicious contract patterns before they can exploit users\n- **Instant Security Alerts**: Receive immediate notifications when suspicious activities are detected\n- **Comprehensive Risk Reports**: Get detailed analysis of bridge security posture\n- **Free Security Tools**: Access powerful security features without expensive subscriptions\n\nBy leveraging cutting-edge AI technology and real-time blockchain data, RugRadar helps protect your assets during cross-chain transfers.`;
      } else {
        content = `# ${foundPainPoint.title}\n\n## Current State of the Problem\n\n${foundPainPoint.description}\n\nThis is a significant issue in the blockchain space, affecting many users and projects.\n\n## Technical Principles\n\nThe technical root cause of this problem lies in the way smart contracts are designed and executed. Blockchain technology relies on immutable code, which means that once a contract is deployed, its logic cannot be changed. This creates unique challenges for security and functionality.\n\n## Risk Mitigation Strategies\n\n1. **Thorough Code Review**: Conduct comprehensive code reviews before deployment.\n2. **Security Audits**: Engage professional auditors to identify vulnerabilities.\n3. **Formal Verification**: Use mathematical proofs to verify contract behavior.\n4. **Gradual Deployment**: Start with small amounts of funds and gradually increase.\n5. **Bug Bounties**: Offer rewards for identifying security issues.\n\n## How Audit Pulse Can Help\n\nAudit Pulse provides an AI-powered solution to address this problem through:\n\n- **Automated Security Scanning**: Quickly identify potential vulnerabilities in smart contracts.\n- **Real-time Monitoring**: Keep track of contract behavior and detect anomalies.\n- **Comprehensive Reports**: Receive detailed analysis with actionable recommendations.\n- **User-Friendly Interface**: Easily understand complex security issues without deep technical knowledge.\n\nBy leveraging advanced AI technology, Audit Pulse helps developers and users mitigate risks and ensure the security of their smart contracts.`;
      }
      setArticleContent(content);
      
      // Extract H2 headings for table of contents
      const headingRegex = /^##\s+(.*)$/gm;
      const extractedHeadings: Array<{ id: string; text: string }> = [];
      let match;
      while ((match = headingRegex.exec(content)) !== null) {
        const text = match[1].trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        extractedHeadings.push({ id, text });
      }
      setHeadings(extractedHeadings);
      
      // Process content to add internal links to other pain points
      let processed = content;
      painPointsData.forEach(p => {
        if (p.slug !== slug && processed.includes(p.title)) {
          const regex = new RegExp(`\\b${p.title}\\b`, 'g');
          processed = processed.replace(regex, `[${p.title}](/solutions/${p.slug})`);
        }
      });
      setProcessedContent(processed);
      
      // Generate FAQ items for JSON-LD
      let faqs: Array<{ question: string; answer: string }> = [];
      
      // Special FAQ for bridge-security page
      if (slug === 'bridge-security') {
        faqs = [
          {
            question: "What is the biggest risk in cross-chain bridges?",
            answer: "Cross-chain bridges are the highest-risk assets in Web3 due to multi-signature mechanism defects and smart contract vulnerabilities. Traditional periodic audits cannot prevent instant Rug Pulls or hacker attacks. RugRadar provides 1-second full-chain API scanning (combining GoPlus API + DexScreener) to capture token ownership and liquidity pool anomalies in real-time, making it the fastest open-source cross-chain bridge protection solution."
          },
          {
            question: "How does RugRadar detect bridge hacks?",
            answer: "RugRadar uses AI-powered real-time monitoring combined with GoPlus API and DexScreener to scan cross-chain bridges every second. It detects token permission ownership changes, liquidity pool anomalies, and suspicious transaction patterns before they can cause damage."
          },
          {
            question: "What is cross-chain bridge audit?",
            answer: "Cross-chain bridge audit is a comprehensive security assessment of bridge protocols that transfer assets between different blockchain networks. It involves analyzing multi-signature mechanisms, smart contract logic, and potential vulnerabilities that could lead to fund loss."
          },
          {
            question: "Why is DeFi bridge monitor important?",
            answer: "DeFi bridge monitor is crucial because bridges hold billions of dollars in locked assets. Real-time monitoring can detect suspicious activities, unauthorized transactions, and potential exploits before they result in catastrophic losses."
          },
          {
            question: "How does honeypot scanner protect bridge users?",
            answer: "Honeypot scanner identifies malicious contract patterns that trap user funds. In cross-chain bridges, honeypot mechanisms can prevent users from withdrawing their assets after depositing, making detection essential for user protection."
          }
        ];
      } else {
        faqs = [
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
      }
      setFaqItems(faqs);
      
      // Generate HowTo steps for JSON-LD
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
      // If not found, redirect to solutions list page
      console.log('Pain point not found, redirecting to solutions');
      setTimeout(() => {
        router.push('/solutions');
      }, 0);
    }
  }, [slug, router, painPointsData]);

  // Scroll event listener for floating toolbar
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingTool(window.scrollY > 300);
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
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
      {/* Header */}
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

      {/* Trust Signals Bar */}
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

      {/* Breadcrumbs */}
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <Breadcrumbs 
          items={[
            { label: 'Home', url: '/' },
            { label: 'Solutions', url: '/solutions' },
            { label: painPoint.title, url: '', isCurrent: true }
          ]} 
        />
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / TOC */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              {/* Mobile TOC Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowToc(!showToc)}
                  className="flex items-center gap-2 w-full p-3 bg-slate-100 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                  <span className="font-medium">Table of Contents</span>
                </button>
              </div>

              {/* TOC */}
              {showToc && (
                <div className="lg:hidden mb-6">
                  <TableOfContents headings={headings} />
                </div>
              )}

              {/* Desktop TOC */}
              <div className="hidden lg:block">
                <TableOfContents headings={headings} />
              </div>

              {/* Interactive Micro-Audit Box */}
              <div className="mt-8 p-4 border border-slate-200 rounded-lg bg-slate-50">
                <h3 className="text-lg font-semibold mb-3">Micro Audit</h3>
                <p className="text-slate-600 mb-4 text-sm">
                  Suspect your token? Enter address, AI will scan for this vulnerability immediately.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Paste contract address"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <a 
                    href={`/?address=${tokenAddress}`} 
                    className="block w-full bg-primary hover:bg-primary/90 text-white text-center py-2 rounded-lg font-medium transition-colors"
                  >
                    Scan Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:w-3/4">
            {/* JSON-LD Structured Data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqItems.map(item => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: item.answer
                    }
                  }))
                })
              }}
            />

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'HowTo',
                  name: `How to mitigate ${painPoint.title}`,
                  step: howToSteps.map(step => ({
                    '@type': 'HowToStep',
                    name: step.name,
                    text: step.text
                  }))
                })
              }}
            />

            {/* Special JSON-LD for bridge-security page */}
            {slug === 'bridge-security' && (
              <>
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'SoftwareApplication',
                      name: 'RugRadar Cross-chain Bridge Security Scanner',
                      applicationCategory: 'SecurityApplication',
                      operatingSystem: 'Web-based',
                      offers: {
                        '@type': 'Offer',
                        price: '0.00',
                        priceCurrency: 'USD',
                        description: 'Free cross-chain bridge security scanning and monitoring'
                      },
                      aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: '4.9',
                        ratingCount: '1250'
                      },
                      description: 'AI-powered cross-chain bridge audit and DeFi bridge monitor tool with real-time honeypot scanner capabilities'
                    })
                  }}
                />

                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'Service',
                      serviceType: 'SecurityService',
                      name: 'Cross-chain Bridge Security Monitoring',
                      provider: {
                        '@type': 'Organization',
                        name: 'RugRadar'
                      },
                      areaServed: 'Worldwide',
                      hasOfferCatalog: {
                        '@type': 'OfferCatalog',
                        name: 'Bridge Security Services',
                        itemListElement: [
                          {
                            '@type': 'Offer',
                            itemOffered: {
                              '@type': 'Service',
                              name: 'Cross-chain Bridge Audit',
                              description: 'Comprehensive security audit for cross-chain bridge protocols'
                            }
                          },
                          {
                            '@type': 'Offer',
                            itemOffered: {
                              '@type': 'Service',
                              name: 'DeFi Bridge Monitor',
                              description: 'Real-time monitoring of DeFi bridge activities and transactions'
                            }
                          },
                          {
                            '@type': 'Offer',
                            itemOffered: {
                              '@type': 'Service',
                              name: 'Honeypot Scanner',
                              description: 'Advanced detection of honeypot mechanisms in bridge contracts'
                            }
                          }
                        ]
                      }
                    })
                  }}
                />
              </>
            )}

            {/* Alert for risk-related pages */}
            {painPoint.category === 'security' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-700">Security Alert</h3>
                    <p className="text-red-600 text-sm mt-1">
                      This vulnerability poses a significant risk to your assets. Always exercise caution when interacting with smart contracts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Article Title */}
            <h1 className="text-4xl font-bold mb-6 text-slate-900">{painPoint.title}</h1>

            {/* GEO Core Summary for bridge-security */}
            {slug === 'bridge-security' && (
              <div className="mb-6 p-5 bg-red-950/10 border-l-4 border-red-600 rounded-r-lg backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="font-bold text-red-900 text-lg mb-2">Critical Security Insight</h2>
                    <p className="text-red-800 text-sm leading-relaxed">
                      Cross-chain bridges are the highest-risk assets in Web3 due to multi-signature mechanism defects and smart contract vulnerabilities. Traditional periodic audits cannot prevent instant Rug Pulls or hacker attacks. RugRadar provides 1-second full-chain API scanning (combining GoPlus API + DexScreener) to capture token ownership and liquidity pool anomalies in real-time, making it the fastest open-source cross-chain bridge protection solution.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{processedContent}</ReactMarkdown>
            </div>

            {/* Related Solutions */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Solutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedSolutions.map(solution => (
                  <a
                    key={solution.slug}
                    href={`/solutions/${solution.slug}`}
                    className="block p-5 border border-slate-200 rounded-lg hover:border-primary hover:shadow-md transition-colors"
                  >
                    <h3 className="font-semibold mb-2">{solution.title}</h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{solution.description}</p>
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Ready to secure your smart contracts?</h2>
              <p className="text-slate-600 mb-6">
                Audit Pulse provides comprehensive security analysis to help you identify and mitigate vulnerabilities.
              </p>
              <a href="/" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Get Started with Audit Pulse</span>
              </a>
            </div>

            {/* Contact Us */}
            <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Need personalized assistance?</h2>
              <p className="text-slate-600 mb-6">
                Our team of security experts is ready to help you with any questions or concerns.
              </p>
              <a href="mailto:457239850@qq.com" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Contact us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Toolbar */}
      {showFloatingTool && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => scrollToTop()}
            className="w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
