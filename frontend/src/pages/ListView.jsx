import React from 'react';
import { getIconUrl } from './../utilities/iconService';

const ListView = () => {
  const accounts = [
    { id: '1', name: 'Google', domain: 'google.com', status: 'Secure', lastCheck: '2 mins ago' },
    { id: '2', name: 'Stripe', domain: 'stripe.com', status: 'Warning', lastCheck: '10 mins ago' },
    { id: '3', name: 'Discord', domain: 'discord.com', status: 'Secure', lastCheck: '1 hour ago' },
    { id: '4', name: 'GitHub', domain: 'github.com', status: 'Secure', lastCheck: '5 mins ago' },
    { id: '5', name: 'AWS', domain: 'amazon.com', status: 'Secure', lastCheck: '12 mins ago' },
    { id: '15', name: 'Unknown Service', domain: 'unknown.com', status: 'Secure', lastCheck: '5 mins ago' }
  ];

  return (
    <div className="w-full h-full bg-[#111] overflow-y-auto">
      <div className="w-full p-0">
        <div className="p-6 border-b border-white/10 bg-[#111] sticky top-0 z-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Security Inventory</h2>
            <p className="text-gray-500 text-xs mt-1 font-mono">Monitoring {accounts.length} active endpoints</p>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Account</th>
              <th className="px-6 py-4">Domain</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Last Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-2 shadow-inner overflow-hidden">
                    <img 
                      src={getIconUrl(acc.name)} 
                      alt={acc.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://cdn-icons-png.flaticon.com/512/633/633600.png';
                      }}
                    />
                  </div>
                  <span className="font-semibold text-gray-200">{acc.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm font-mono">{acc.domain}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                    acc.status === 'Secure' 
                      ? 'bg-green-500/5 text-green-500 border-green-500/20' 
                      : 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {acc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-500 text-sm font-mono">
                  {acc.lastCheck}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;