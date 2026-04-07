import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded-xl shadow flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <form className="w-full flex flex-col gap-4">
          <input type="email" placeholder="Email" className="border rounded px-3 py-2" required />
          <input type="password" placeholder="Password" className="border rounded px-3 py-2" required />
          <button type="submit" className="bg-black text-white rounded px-4 py-2 font-semibold">Log In</button>
        </form>
        <div className="my-4 text-gray-400 text-xs">or</div>
        <button className="w-full border rounded px-4 py-2 mb-2 font-semibold flex items-center justify-center gap-2">
          <span>Sign in with Google</span>
        </button>
        <button className="w-full border rounded px-4 py-2 font-semibold flex items-center justify-center gap-2">
          <span>Sign in with Apple</span>
        </button>
        <p className="mt-4 text-sm text-gray-500">Don't have an account? <Link href="/auth/signup" className="underline">Sign up</Link></p>
      </div>
    </main>
  );
}
