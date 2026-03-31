import React from 'react';

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-slate-900 border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              <span className="text-blue-400">Audit Pulse</span>
            </h3>
            <p className="text-slate-400">
              Leverage advanced AI technology to quickly identify security vulnerabilities in smart contracts and protect your assets.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-slate-400">&copy; 2026 Audit Pulse. All rights reserved.</p>
              <p className="text-slate-400 mt-2">Support: 457239850@qq.com</p>
            </div>
            <p className="text-slate-500 text-center md:text-right mt-4 md:mt-0 text-sm">
              Disclaimer: Audit Pulse is a tool for security analysis and not financial advice. Always do your own research before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
