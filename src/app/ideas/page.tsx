import IdeaFeedPlaceholder from '../../components/IdeaFeedPlaceholder';

export default function IdeasPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">All Ideas</h1>
        <IdeaFeedPlaceholder />
      </div>
    </main>
  );
}
