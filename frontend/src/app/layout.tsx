import type { Metadata } from "next";
import { Public_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth-context";

const publicSans = Public_Sans({ subsets: ["latin"], variable: '--font-public' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "NCSA CTF Portal | National Cybersecurity Agency",
  description: "Official Capture The Flag platform for the National Cybersecurity Agency (NCSA).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased min-h-screen bg-background text-foreground font-sans flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-primary text-primary-foreground py-8 text-center text-sm border-t-4 border-accent">
            <div className="container mx-auto px-4">
              <p className="font-mono tracking-widest uppercase mb-1">National Cybersecurity Agency (NCSA)</p>
              <p className="opacity-80">© 2026. All Rights Reserved. Official Government Portal.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
