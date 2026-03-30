import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fira_Code } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const firaCode = Fira_Code({ subsets: ["latin"], variable: '--font-fira' });

export const metadata: Metadata = {
  title: "CTF Portal | Cybersecurity Challenges",
  description: "Join the ultimate Capture The Flag challenges, read news, and learn from write-ups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable} antialiased min-h-screen bg-background text-foreground font-sans flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CTF Portal. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
