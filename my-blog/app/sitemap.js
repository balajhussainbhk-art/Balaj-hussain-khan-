import { posts, site } from "@/lib/site";
export default function sitemap() {
  return ["", "/blog", "/about", ...posts.map((p) => `/blog/${p.slug}`)].map((u) => ({ url: site.url + u }));
}
