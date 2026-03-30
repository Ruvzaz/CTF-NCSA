import { fetchApi } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function WriteupDetail({ params }: { params: { slug: string } }) {
  let writeup = null;


  try {
    const res: any = await fetchApi('/writeups', {
      'filters[slug][$eq]': params.slug,
      populate: '*',
    }, { cache: 'no-store' });
    
    if (res.data && res.data.length > 0) {
      writeup = res.data[0];
    }
  } catch (err) {
    console.error(err);
  }

  if (!writeup) {
    return notFound();
  }

  const content = writeup.content || "No content provided.";

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="mb-8 text-sm text-gray-400">
        <Link href="/writeups" className="hover:text-[#10B981]">← Back to Write-ups</Link>
      </div>
      <header className="mb-10 border-b border-gray-800 pb-8 text-center">
        <h1 className="mb-4 font-space text-4xl font-bold text-white max-w-4xl mx-auto">{writeup.title}</h1>
        <p className="text-gray-500">
          By {writeup.author || 'Anonymous'} | {new Date(writeup.createdAt).toLocaleDateString()}
        </p>
      </header>
      
      {/* Markdown Content */}
      <MarkdownRenderer content={content} />
    </div>
  );
}
