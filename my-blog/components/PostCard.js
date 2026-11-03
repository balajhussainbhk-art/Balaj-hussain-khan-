import Link from "next/link";
export default function PostCard({ p, big }) {
  return (
    <Link href={`/blog/${p.slug}`} className={"card" + (big ? " big" : "")}>
      <span className="chip">{p.category}</span>
      <h3>{p.title}</h3>
      <p>{p.excerpt}</p>
      <span className="meta">{p.date} · {p.read} read</span>
    </Link>
  );
}
