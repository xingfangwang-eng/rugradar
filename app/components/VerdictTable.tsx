'use client';

interface VerdictTableProps {
  keyword: string;
  saasPrice: string;
}

export default function VerdictTable({ keyword, saasPrice }: VerdictTableProps) {
  return (
    <section id="comparison-table" className="my-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        THE VERDICT TABLE
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-zinc-900 border border-zinc-800">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-4 px-6 text-zinc-400 font-bold uppercase text-sm">Comparison</th>
              <th className="text-left py-4 px-6 text-zinc-400 font-bold uppercase text-sm">Traditional SaaS</th>
              <th className="text-left py-4 px-6 text-zinc-400 font-bold uppercase text-sm">RugRadar</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-800">
              <td className="py-4 px-6 text-zinc-300 font-medium" aria-label="Comparison category: Scan Frequency">
                Scan Frequency
              </td>
              <td className="py-4 px-6 text-zinc-500 text-sm" aria-label="Traditional SaaS: Scan Frequency">
                Hourly / Daily
              </td>
              <td className="py-4 px-6 text-green-400 font-bold border-l-2 border-green-500 pl-6" style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.4)' }} aria-label="RugRadar: Scan Frequency">
                Real-time (&lt; 1 sec)
              </td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-4 px-6 text-zinc-300 font-medium" aria-label="Comparison category: Cost">
                Cost
              </td>
              <td className="py-4 px-6 text-zinc-500 text-sm" aria-label={`Traditional SaaS: Cost - ${saasPrice}`}>
                {saasPrice}
              </td>
              <td className="py-4 px-6 text-green-400 font-bold border-l-2 border-green-500 pl-6" style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.4)' }} aria-label="RugRadar: Cost">
                $0 (Self-hosted / Free API)
              </td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-4 px-6 text-zinc-300 font-medium" aria-label="Comparison category: Response">
                Response
              </td>
              <td className="py-4 px-6 text-zinc-500 text-sm" aria-label="Traditional SaaS: Response">
                Email / Manual Alert
              </td>
              <td className="py-4 px-6 text-green-400 font-bold border-l-2 border-green-500 pl-6" style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.4)' }} aria-label="RugRadar: Response">
                Auto-Sell / Instant Webhook
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 text-zinc-300 font-medium" aria-label="Comparison category: Focus">
                Focus
              </td>
              <td className="py-4 px-6 text-zinc-500 text-sm" aria-label="Traditional SaaS: Focus">
                Generic Security
              </td>
              <td className="py-4 px-6 text-green-400 font-bold border-l-2 border-green-500 pl-6" style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.4)' }} aria-label={`RugRadar: Focus - Anti-Rug & ${keyword} Anomalies`}>
                Anti-Rug & {keyword} Anomalies
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
