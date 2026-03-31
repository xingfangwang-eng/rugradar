'use client';

import React, { useState, useEffect } from 'react';
import painPointsData from '../../data/pain-points.json';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { ArrowRight, Search, X } from 'lucide-react';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

type PainPoint = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
};

// Category mapping - expanded to 4-6 categories
const categoryMap: Record<string, string> = {
  'security': 'Rug Pull Prevention',
  'efficiency': 'Trading Efficiency',
  'income': 'On-Chain Analysis',
  'scam': 'Scam Detection',
  'compliance': 'Regulatory Compliance',
  'optimization': 'Smart Contract Optimization'
};

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  'security': 'Comprehensive solutions to prevent rug pulls and other security threats in smart contracts',
  'efficiency': 'Tools and strategies to improve trading efficiency and user experience in cryptocurrency markets',
  'income': 'Advanced on-chain data analysis and yield optimization strategies for investors',
  'scam': 'Techniques and tools to detect and avoid cryptocurrency scams and fraudulent activities',
  'compliance': 'Guidelines and solutions to ensure regulatory compliance in blockchain projects',
  'optimization': 'Best practices for optimizing smart contract performance and gas efficiency'
};

// Category concept summaries
const categoryConceptSummaries: Record<string, string> = {
  'security': 'Security vulnerabilities in smart contracts, such as honeypots and rug pulls, pose significant risks to traders and investors. These vulnerabilities can result in immediate loss of funds with no possibility of recovery. Understanding and identifying these security issues is crucial for anyone participating in the cryptocurrency market. By recognizing the signs of potentially malicious contracts, traders can protect their assets and avoid falling victim to sophisticated scams designed to exploit blockchain technology.',
  'efficiency': 'Trading efficiency directly impacts profitability in cryptocurrency markets. Slow transaction times, high gas fees, and complex user interfaces can significantly hinder trading performance. Tools and strategies that optimize these aspects allow traders to execute orders faster, reduce costs, and make more informed decisions. In a market where milliseconds can mean the difference between profit and loss, improving trading efficiency is not just a convenience but a necessity for serious traders.',
  'income': 'On-chain analysis provides valuable insights into market trends, token performance, and investment opportunities. By leveraging data from the blockchain, investors can make more informed decisions about where to allocate their capital. Yield optimization strategies, such as staking and liquidity provision, can generate passive income streams. Understanding these concepts is essential for maximizing returns in the competitive cryptocurrency landscape.',
  'scam': 'Cryptocurrency scams have become increasingly sophisticated, targeting both new and experienced investors. From phishing attacks to fake tokens and Ponzi schemes, these fraudulent activities can result in significant financial losses. Recognizing the warning signs and understanding common scam techniques is crucial for protecting your assets. By staying informed about the latest scam trends, traders can avoid falling victim to these malicious schemes.',
  'compliance': 'Regulatory compliance is becoming increasingly important in the cryptocurrency space. As governments around the world develop frameworks for digital assets, projects that fail to adhere to these regulations risk legal consequences and loss of investor trust. Understanding compliance requirements, such as KYC/AML procedures and securities regulations, is essential for both project developers and investors. Compliance not only reduces legal risk but also fosters a more sustainable and trustworthy ecosystem.',
  'optimization': 'Smart contract optimization is critical for both performance and cost-effectiveness. Inefficient code can lead to high gas fees, slow transaction times, and potential security vulnerabilities. By implementing best practices such as gas optimization, code refactoring, and proper architecture design, developers can create contracts that are both secure and efficient. These optimizations not only improve user experience but also reduce operational costs for both developers and users.'
};

// FAQ items
const faqItems = [
  {
    question: 'What is a honeypot in cryptocurrency?',
    answer: 'A honeypot is a type of smart contract that appears to be a legitimate investment opportunity but is designed to trap investors funds. Once tokens are deposited, they cannot be withdrawn due to malicious code in the contract. Honeypots often use deceptive tactics to attract investors, such as promising high returns or mimicking successful projects.'
  },
  {
    question: 'How can I detect a rug pull before it happens?',
    answer: 'To detect a potential rug pull, look for warning signs such as anonymous team members, excessive token allocations to the team, lack of a clear roadmap, and suspicious contract code. Additionally, check for liquidity locks, audit reports from reputable firms, and community sentiment. Tools like Audit Pulse can help analyze smart contracts for potential vulnerabilities.'
  },
  {
    question: 'What is gas optimization in smart contracts?',
    answer: 'Gas optimization refers to techniques used to reduce the amount of gas required to execute smart contract functions. This includes using more efficient data structures, minimizing storage operations, and optimizing code logic. Gas optimization is important because it reduces transaction costs for users and makes contracts more accessible, especially during periods of high network congestion.'
  },
  {
    question: 'How does on-chain analysis help with investment decisions?',
    answer: 'On-chain analysis involves examining blockchain data to gain insights into market trends, token performance, and investor behavior. By analyzing metrics such as transaction volume, holder distribution, and smart money movements, investors can make more informed decisions. This data-driven approach helps identify potential opportunities and risks in the cryptocurrency market.'
  },
  {
    question: 'What are the key regulatory considerations for blockchain projects?',
    answer: 'Key regulatory considerations include KYC/AML compliance, securities regulations, tax obligations, and data protection laws. Projects must navigate a complex and evolving regulatory landscape that varies by jurisdiction. Failure to comply can result in legal consequences, fines, and loss of investor trust. Staying informed about regulatory developments is essential for long-term success.'
  },
  {
    question: 'How can I protect my assets from cryptocurrency scams?',
    answer: 'To protect your assets, use hardware wallets for long-term storage, enable two-factor authentication on all accounts, verify website URLs to avoid phishing, and research projects thoroughly before investing. Be skeptical of offers that seem too good to be true, and never share your private keys or seed phrases with anyone. Additionally, consider using security tools and staying informed about the latest scam techniques.'
  },
  {
    question: 'What is a proxy contract in smart contracts?',
    answer: 'A proxy contract is a smart contract that delegates function calls to another contract, known as the implementation contract. This allows for upgrades to the contract logic without changing the contract address. Proxy contracts are commonly used in DeFi projects to enable bug fixes and feature updates after deployment. However, they also introduce potential security risks if not implemented correctly.'
  },
  {
    question: 'What are Mint permissions in NFTs?',
    answer: 'Mint permissions refer to the ability to create new tokens in an NFT collection. These permissions are typically controlled by the contract owner and determine who can mint new NFTs. Restricted mint permissions can help prevent unauthorized token creation, while open permissions allow anyone to mint tokens under certain conditions. Understanding mint permissions is important for both creators and collectors in the NFT space.'
  }
];

// Terms for the sliding component
const terms = [
  { term: 'Mint Permission', definition: 'The ability to create new tokens in a smart contract, often controlled by the contract owner.' },
  { term: 'Proxy Contract', definition: 'A contract that delegates function calls to another contract, enabling upgrades without changing the address.' },
  { term: 'Honeypot', definition: 'A malicious smart contract that traps investors funds, preventing withdrawal after deposit.' },
  { term: 'Rug Pull', definition: 'A scam where developers abandon a project and take investors funds, often by removing liquidity.' },
  { term: 'Gas Fee', definition: 'The cost to execute transactions on a blockchain, paid to network validators.' },
  { term: 'KYC/AML', definition: 'Know Your Customer and Anti-Money Laundering regulations to prevent illegal activities.' },
  { term: 'Liquidity Lock', definition: 'A mechanism to prevent developers from removing liquidity from a trading pair.' },
  { term: 'Smart Money', definition: 'Funds controlled by experienced and successful investors in the cryptocurrency market.' }
];

// Group pain points by category
const groupByCategory = (painPoints: PainPoint[]) => {
  return painPoints.reduce((groups, painPoint) => {
    const category = painPoint.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(painPoint);
    return groups;
  }, {} as Record<string, PainPoint[]>);
};

export default function SolutionsPage() {
  const router = useRouter();
  const [groupedPainPoints, setGroupedPainPoints] = useState<Record<string, PainPoint[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchAddress, setSearchAddress] = useState('');
  const [showLiveAudit, setShowLiveAudit] = useState(false);
  const [liveAuditAddress, setLiveAuditAddress] = useState('');

  useEffect(() => {
    // Simulate loading delay to show skeleton screen
    const timer = setTimeout(() => {
      const grouped = groupByCategory(painPointsData);
      setGroupedPainPoints(grouped);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Prepare data for JSON-LD ItemList
  const allPainPoints = Object.values(groupedPainPoints).flat();

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress) {
      router.push(`/?address=${encodeURIComponent(searchAddress)}`);
    }
  };

  // Handle live audit submission
  const handleLiveAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (liveAuditAddress) {
      router.push(`/?address=${encodeURIComponent(liveAuditAddress)}`);
    }
  };

  // Trending tags
  const trendingTags = [
    { label: '#PepeSecurity', slug: 'pepe-contract-security' },
    { label: '#SolanaRugCheck', slug: 'solana-rug-pull-prevention' },
    { label: '#BSCScan', slug: 'bsc-contract-audit' },
    { label: '#EthGasOptimize', slug: 'ethereum-gas-optimization' },
    { label: '#NFTMintSafety', slug: 'nft-mint-security' },
    { label: '#DeFiRisks', slug: 'defi-security-risks' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Canonical Link */}
      <link rel="canonical" href="https://auditpulse.com/solutions" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content="Crypto Security & Smart Contract Audit Library" />
      <meta property="og:description" content="A comprehensive collection of 100+ solutions for blockchain security, trading efficiency, and on-chain analysis" />
      <meta property="og:image" content="https://auditpulse.com/og-image.png" />
      <meta property="og:url" content="https://auditpulse.com/solutions" />
      <meta property="og:type" content="website" />
      
      {/* JSON-LD ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Crypto Security & Smart Contract Audit Library',
            description: 'A comprehensive collection of 100+ solutions for blockchain security, trading efficiency, and on-chain analysis',
            numberOfItems: allPainPoints.length,
            itemListElement: allPainPoints.map((painPoint, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: painPoint.title,
              url: `https://auditpulse.com/solutions/${painPoint.slug}`
            }))
          })
        }}
      />

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Can't find what you need? Enter address for AI real-time audit"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Audit</span>
            </button>
          </form>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Home', url: '/' },
              { label: 'Solutions', url: '/solutions', isCurrent: true }
            ]} 
          />
          
          <div className="text-center mt-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Crypto Security & Smart Contract Audit Library
            </h1>
            
            {/* Trending Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {trendingTags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/solutions/${tag.slug}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  prefetch
                >
                  {tag.label}
                </Link>
              ))}
            </div>
            
            <p className="text-lg text-slate-500 max-w-3xl mx-auto mb-12">
              Comprehensive solutions for smart contract security, trading efficiency, and on-chain analysis. 
              Explore our knowledge base to find answers to common blockchain challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Categories */}
      <section className="py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            // Skeleton screen
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="h-10 w-64 bg-slate-200 rounded animate-pulse"></div>
                  <div className="ml-4 h-px flex-grow bg-slate-200"></div>
                </div>
                <div className="h-6 w-96 bg-slate-200 rounded mb-8 animate-pulse"></div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                      <div className="h-6 w-48 bg-slate-200 rounded mb-4 animate-pulse"></div>
                      <div className="space-y-2 mb-4">
                        {Array.from({ length: 2 }).map((_, j) => (
                          <div key={j} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Actual content
            Object.entries(groupedPainPoints).map(([category, painPoints]) => (
              <div key={category} id={category} className="mb-16 scroll-mt-24">
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{categoryMap[category]}</h2>
                  <div className="ml-4 h-px flex-grow bg-slate-200"></div>
                </div>
                <p className="text-slate-500 mb-8">{categoryDescriptions[category]}</p>
                
                {/* Category Concept Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                  <p className="text-slate-600">{categoryConceptSummaries[category]}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {painPoints.map((painPoint, index) => (
                    <React.Fragment key={painPoint.id}>
                      {/* Insert CTA card every 10 links */}
                      {index > 0 && index % 10 === 0 && (
                        <div key={`cta-${index}`} className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6 shadow-sm mb-6">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2 text-slate-900">90% of security issues originate from code</h3>
                              <p className="text-slate-600 mb-4">Click to use Audit Pulse to eliminate risks completely</p>
                            </div>
                            <button
                              onClick={() => router.push('/')}
                              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                              <span>One-Click Solution</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      <Link 
                        key={painPoint.id} 
                        href={`/solutions/${painPoint.slug}`}
                        className="bg-white rounded-lg border border-slate-200 hover:border-primary transition-colors p-6 group shadow-sm hover:shadow-md transition-shadow"
                        prefetch
                      >
                        <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors text-slate-900">
                          {painPoint.title}
                        </h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{painPoint.description}</p>
                        <div className="flex items-center text-primary text-sm font-medium">
                          <span>Read More</span>
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Terms Slider */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">Key Terms & Definitions</h2>
          <div className="relative overflow-hidden">
            <div className="flex space-x-4 py-4 overflow-x-auto scrollbar-hide">
              {terms.map((item, index) => (
                <div key={index} className="flex-shrink-0 bg-white rounded-lg border border-slate-200 p-4 w-80 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">{item.term}</h3>
                  <p className="text-slate-600 text-sm">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-slate-900">Frequently Asked Questions</h2>
          
          {/* FAQPage JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
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
              })
            }}
          />
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">{item.question}</h3>
                <p className="text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Counter */}
      <section className="py-12 px-4 bg-primary/10">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Our Solution Library</h2>
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm inline-block">
            <p className="text-lg text-slate-700">
              Currently featuring <span className="font-bold text-primary">100</span> security solutions,
              covering <span className="font-bold text-primary">12</span> blockchain ecosystems
            </p>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Cryptocurrency Trading Security Guide</h2>
          <div className="prose max-w-none">
            <p>
              Cryptocurrency trading has revolutionized the financial landscape, offering unprecedented opportunities for investors worldwide. However, with these opportunities come unique security challenges that every trader must address. This comprehensive guide outlines essential security practices to protect your digital assets and ensure a safe trading experience.
            </p>
            <p>
              First and foremost, securing your private keys is paramount. Never share your private keys with anyone, and consider using hardware wallets for long-term storage. These physical devices offer an extra layer of protection against online threats. Additionally, enable two-factor authentication (2FA) on all your trading accounts to prevent unauthorized access.
            </p>
            <p>
              When trading, always verify the legitimacy of the platforms you use. Look for established exchanges with strong security track records and transparent fee structures. Be wary of phishing attempts, which often come in the form of suspicious emails or fake websites designed to steal your credentials.
            </p>
            <p>
              Smart contract security is another critical aspect of cryptocurrency trading. Before interacting with any DeFi protocol, conduct thorough research or use tools like Audit Pulse to analyze the contract's code for potential vulnerabilities. This can help you avoid scams and security breaches that could result in significant financial losses.
            </p>
            <p>
              Finally, stay informed about the latest security trends and threats in the cryptocurrency space. Follow reputable sources, join community forums, and consider using portfolio tracking tools to monitor your assets regularly. By implementing these best practices, you can trade with confidence and focus on growing your investment portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* Data Endorsement */}
      <section className="py-12 px-4 bg-white border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-lg font-medium text-slate-500 mb-8 text-center">Partners & Data Sources</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-lg font-bold text-slate-700">Etherscan</span>
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-lg font-bold text-slate-700">Gemini</span>
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-lg font-bold text-slate-700">Solscan</span>
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-lg font-bold text-slate-700">BSCScan</span>
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-lg font-bold text-slate-700">PolygonScan</span>
            </div>
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="text-lg font-bold text-slate-700">CoinGecko</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Live Audit Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Live Audit Button */}
        <button
          onClick={() => setShowLiveAudit(!showLiveAudit)}
          className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Live Audit"
        >
          <Search className="w-6 h-6" />
        </button>
        
        {/* Live Audit Modal */}
        {showLiveAudit && (
          <div className="absolute bottom-20 right-0 bg-white rounded-lg border border-slate-200 shadow-xl p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Live Audit</h3>
              <button
                onClick={() => setShowLiveAudit(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLiveAuditSubmit}>
              <input
                type="text"
                value={liveAuditAddress}
                onChange={(e) => setLiveAuditAddress(e.target.value)}
                placeholder="Enter contract address"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Audit Now
              </button>
            </form>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}