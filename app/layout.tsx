import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice App',
  description: 'Form to generate invoices',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
