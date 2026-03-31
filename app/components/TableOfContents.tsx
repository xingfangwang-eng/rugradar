import React, { useState, useEffect } from 'react';

interface TableOfContentsProps {
  headings: Array<{ id: string; text: string }>;
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = document.getElementById(headings[i].id);
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const heading = document.getElementById(id);
    if (heading) {
      window.scrollTo({
        top: heading.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-8 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-slate-900">Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeHeading === heading.id ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}