import { useState } from 'react';

export default function IdeaPostForm() {
  const [category, setCategory] = useState('genius');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState('public');

  return (
    <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow flex flex-col gap-4 mt-10">
      <h2 className="text-2xl font-bold mb-2">Post a New Idea</h2>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="category" value="genius" checked={category === 'genius'} onChange={() => setCategory('genius')} />
          Genius Idea
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="category" value="bad" checked={category === 'bad'} onChange={() => setCategory('bad')} />
          Bad Idea
        </label>
      </div>
      <input
        type="text"
        placeholder="Title"
        className="border rounded px-3 py-2"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Describe your idea..."
        className="border rounded px-3 py-2 min-h-[100px]"
        value={body}
        onChange={e => setBody(e.target.value)}
        required
      />
      <div>
        <label className="block mb-1 font-semibold">Attach a sketch or image (optional)</label>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="privacy" value="public" checked={privacy === 'public'} onChange={() => setPrivacy('public')} />
          Public
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="privacy" value="private" checked={privacy === 'private'} onChange={() => setPrivacy('private')} />
          Private
        </label>
      </div>
      <button type="submit" className="bg-black text-white rounded px-4 py-2 font-semibold mt-2">Post Idea</button>
      <div className="text-xs text-gray-400 mt-2">A hash-based origin proof will be generated for your idea.</div>
    </form>
  );
}
