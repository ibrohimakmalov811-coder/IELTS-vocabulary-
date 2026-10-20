import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Essential Vocab 5 | Master IELTS Vocabulary, Effortlessly",
  description: "Interactive IELTS Vocabulary Learning Platform based on 4000 Essential English Words Book 5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-tealAccent-light selection:text-slateText-heading">
        {children}
      </body>
    </html>
  );
}
