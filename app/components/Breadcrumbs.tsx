import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: {
    label: string;
    url: string;
    isCurrent?: boolean;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center mb-8 text-sm text-slate-500">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ArrowRight className="w-4 h-4 mx-2" />}
          {item.isCurrent ? (
            <span className="text-slate-900 font-medium">{item.label}</span>
          ) : (
            <a 
              href={item.url} 
              className="hover:text-primary transition-colors"
              title={`Go to ${item.label}`}
            >
              {item.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}