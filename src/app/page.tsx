import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Head>
        <title>IdeaGenius.Space</title>
        <meta name="description" content="Browse, post, and share ideas. Minimal, creative, and open." />
      </Head>
      <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-md flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">IdeaGenius.Space</h1>
        <p className="mb-6 text-lg text-gray-600 text-center">A creative bulletin board for Genius & Stupid Ideas.<br />Browse, post, and share ideas freely.</p>
        <Link href="/ideas" className="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition mb-2">Browse Ideas</Link>
        <Link href="/auth/signup" className="px-6 py-2 border border-black text-black rounded-full font-semibold hover:bg-gray-100 transition">Post an Idea</Link>
      </div>
      <footer className="mt-10 text-gray-400 text-sm">&copy; {new Date().getFullYear()} IdeaGenius.Space</footer>
    </main>
  );
}
