'use client'
import { useState } from 'react';
import { getModelHistory, createAuditRecord } from './actions';

function generateHash(seed: string) {
  // Simple deterministic-looking hex hash for demo purposes (client-side, no crypto import needed)
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = (h1 ^ (h1 >>> 16)) >>> 0;
  h2 = (h2 ^ (h2 >>> 16)) >>> 0;
  return (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0') +
    Date.now().toString(16)).padEnd(64, '0').slice(0, 64);
}

export default function Home() {
  const [modelId, setModelId] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [regHash, setRegHash] = useState('');
  const [regOwner, setRegOwner] = useState('');
  const [registering, setRegistering] = useState(false);
  const [regMessage, setRegMessage] = useState('');

  const runAudit = async (idToQuery?: string) => {
    const targetId = idToQuery || modelId;
    if (!targetId) return;
    setLoading(true);
    const result = await getModelHistory(targetId);
    setHistory(result.success ? result.data : []);
    setLoading(false);
  };

  const registerModel = async (idOverride?: string, hashOverride?: string, ownerOverride?: string) => {
    const id = idOverride || modelId;
    const hash = hashOverride || regHash;
    const owner = ownerOverride || regOwner;
    if (!id || !hash || !owner) {
      setRegMessage('Model ID, hash, and owner are all required.');
      return;
    }
    setRegistering(true);
    setRegMessage('');
    const result = await createAuditRecord(id, hash, owner);
    setRegistering(false);
    if (result.success) {
      setRegMessage(`${id} registered successfully.`);
      setModelId(id);
      runAudit(id);
    } else {
      setRegMessage(`Failed: ${result.error}`);
    }
  };

  const registerSample = (id: string) => {
    const hash = generateHash(id + Date.now());
    registerModel(id, hash, 'JaiOrg');
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto pt-20">

        <div className="mb-12">
          <h1 className="text-5xl font-bold italic tracking-tighter mb-2">AI_Audit <span className="text-emerald-500">.</span></h1>
          <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase">Hyperledger Fabric // Model Integrity Ledger</p>
        </div>

        <div className="relative group mb-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
            <input
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value.toUpperCase())}
              placeholder="ENTER MODEL ID (e.g. MODEL001)"
              className="w-full bg-transparent px-8 py-6 outline-none font-mono text-lg tracking-widest placeholder:text-white/10"
            />
            <button
              onClick={() => runAudit()}
              disabled={loading}
              className="bg-white text-black px-10 font-bold uppercase tracking-tighter hover:bg-emerald-400 transition-colors disabled:bg-gray-800 disabled:text-gray-500"
            >
              {loading ? 'Auditing...' : 'Run Audit'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-2 justify-center">
          {['MODEL000', 'MODEL001', 'MODEL002'].map((id) => (
            <button
              key={id}
              onClick={() => registerSample(id)}
              disabled={registering}
              className="text-[9px] text-white/30 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 px-4 py-1.5 rounded-full transition-all uppercase tracking-[0.2em] font-mono bg-white/[0.01] disabled:opacity-40"
            >
              Register: {id}
            </button>
          ))}
        </div>
        <p className="text-center text-[9px] text-gray-600 font-mono mb-12">
          Generates a hash and writes it to the ledger, then queries it back.
        </p>

        <div className="mb-12 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-semibold">Register Model Hash on Ledger</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              value={regHash}
              onChange={(e) => setRegHash(e.target.value)}
              placeholder="SHA256 HASH"
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none font-mono text-sm placeholder:text-white/20"
            />
            <input
              type="text"
              value={regOwner}
              onChange={(e) => setRegOwner(e.target.value)}
              placeholder="OWNER"
              className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none font-mono text-sm placeholder:text-white/20"
            />
            <button
              onClick={() => registerModel()}
              disabled={registering}
              className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold uppercase tracking-tighter hover:bg-emerald-400 transition-colors disabled:bg-gray-800 disabled:text-gray-500"
            >
              {registering ? 'Writing...' : 'Register'}
            </button>
          </div>
          <p className="text-[10px] font-mono text-gray-500">
            Uses the Model ID entered above ({modelId || 'none set'}).
          </p>
          {regMessage && <p className="text-[10px] font-mono text-emerald-400 mt-2">{regMessage}</p>}
        </div>

        <div className="space-y-6">
          {history.length > 0 ? (
            history.map((entry, i) => (
              <div key={i} className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-all backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest font-bold">Verified</span>
                  <span className="text-gray-600 text-[10px] font-mono">{entry.TxId?.substring(0, 24)}...</span>
                </div>
                <h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-semibold">Cryptographic Hash</h3>
                <p className="text-xl font-mono text-white/90 break-all leading-tight mb-6">SHA256 : {entry.Value?.hashValue || 'NO_HASH'}</p>
                <div className="pt-6 border-t border-white/5 flex gap-8 text-[9px] text-gray-500 uppercase tracking-widest font-mono">
                  <div>Owner: <span className="text-white">{entry.Value?.owner || 'UNKNOWN'}</span></div>
                  <div>Timestamp: <span className="text-white">{entry.Value?.timestamp || 'N/A'}</span></div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-white/5 bg-white/[0.01] rounded-[40px] p-24 text-center">
              <div className="text-emerald-500/20 text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Awaiting Audit Command</div>
              <p className="text-white/5 font-mono text-xs max-w-xs mx-auto leading-relaxed">
                Enter a Model ID to retrieve or register immutable ledger history on the Hyperledger network.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
