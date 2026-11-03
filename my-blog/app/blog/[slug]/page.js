import { notFound } from "next/navigation";
import ProductBox from "@/components/ProductBox";
import { posts } from "@/lib/site";
export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }) { const p = posts.find((x) => x.slug === params.slug); return p ? { title: p.title, description: p.excerpt } : {}; }
export default function Post({ params }) {
  const p = posts.find((x) => x.slug === params.slug);
  if (!p) notFound();
  return (
    <article className="wrap post">
      <span className="chip">{p.category}</span>
      <h1>{p.title}</h1>
      <p className="meta">{p.date} · {p.read} read</p>
      <p className="disc">Disclosure: this page contains affiliate links. We may earn a commission if you buy, at no extra cost to you.</p>
      {p.body.map((b, i) => b.h ? <h2 key={i}>{b.h}</h2> : b.p ? <p key={i}>{b.p}</p> : <ProductBox key={i} p={b.product} />)}
    </article>
  );
}
