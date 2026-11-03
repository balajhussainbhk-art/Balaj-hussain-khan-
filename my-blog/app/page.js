import Link from "next/link";
import PostCard from "@/components/PostCard";
import { posts, categories, site } from "@/lib/site";
export default function Home() {
  const [first, ...rest] = posts;
  return (
    <>
      <section className="hero wrap">
        <h1>{site.tagline}</h1>
        <p>Independent reviews and buying guides for the things you use every day.</p>
        <div className="cats">{categories.map((c) => <Link key={c} href="/blog" className="chip">{c}</Link>)}</div>
      </section>
      <section className="wrap">
        <h2 className="sec">Latest guides</h2>
        <div className="grid"><PostCard p={first} big />{rest.map((p) => <PostCard key={p.slug} p={p} />)}</div>
      </section>
    </>
  );
}
