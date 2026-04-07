import Link from 'next/link';

export default function IdeaFeedPlaceholder() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Latest Ideas</h2>
      <div className="bg-gray-50 border rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-gray-400">#001</span>
          <span className="font-semibold">Teleporting Toaster</span>
          <span className="ml-auto text-xs text-gray-500">Genius Idea</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-gray-400">#002</span>
          <span className="font-semibold">Self-Refilling Coffee Mug</span>
          <span className="ml-auto text-xs text-gray-500">Stupid Idea</span>
        </div>
        <div className="text-center mt-4">
          <Link href="/ideas" className="text-blue-600 hover:underline">See all ideas</Link>
        </div>
      </div>
    </div>
  );
}
