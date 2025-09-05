import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <p>
        <Link href="/invoice" className="text-blue-600 underline">
          Go to Invoice Form
        </Link>
      </p>
    </main>
  );
}
