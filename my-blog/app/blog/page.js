import PostCard from "@/components/PostCard";
import { posts } from "@/lib/site";
export const metadata = { title: "Guides" };
export default function Blog() {
  return (<section className="wrap pad"><h1>All guides</h1><div className="grid two">{posts.map((p) => <PostCard key={p.slug} p={p} />)}</div></section>);
}
