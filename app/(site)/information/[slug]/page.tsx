import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, articles } from "@/libs/content/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <main id="main-content" className="px-5 py-16 md:px-10 lg:px-24">
      <article className="mx-auto max-w-3xl">
        <Link href="/information" className="text-sm font-bold text-[color:var(--neon-cyan)]">← Quay lại Thông tin</Link>
        <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">{article.category}</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold uppercase text-white md:text-6xl">{article.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[color:var(--text-muted)]">{article.excerpt}</p>
        {article.status === "summary-only" ? <p className="mt-4 rounded border border-[color:rgba(255,0,255,0.5)] bg-[color:rgba(255,0,255,0.08)] p-4 text-sm text-white">Bài này hiện mới có summary. Route giữ bằng tiếng Anh, body tiếng Việt và chờ đội nội dung bổ sung full article.</p> : null}
        <div className="mt-10 space-y-6 text-base leading-8 text-[color:var(--text-muted)]">
          {article.blocks.map((block, index) => {
            if (block.type === "quote") return <blockquote key={index} className="border-l-4 border-[color:var(--neon-pink)] pl-5 text-white">“{block.text}”</blockquote>;
            if (block.type === "list") return <ul key={index} className="list-disc space-y-2 pl-6">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
            return <p key={index}>{block.text}</p>;
          })}
        </div>
      </article>
    </main>
  );
}
