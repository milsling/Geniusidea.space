import Link from 'next/link';

export default function HashProofPlaceholder({ hash, timestamp }: { hash: string; timestamp: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
      <span>Origin Proof:</span>
      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{hash.slice(0, 12)}...</span>
      <span>|</span>
      <span>{timestamp}</span>
      <Link href="/about-proof" className="ml-2 underline">What is this?</Link>
    </div>
  );
}
