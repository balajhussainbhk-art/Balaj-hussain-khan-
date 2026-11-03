import Link from "next/link";
import { site } from "@/lib/site";
export default function Header() {
  return (
    <header className="hdr"><div className="wrap hdr-in">
      <Link href="/" className="logo"><span className="dot" />{site.name}</Link>
      <nav><Link href="/blog">Guides</Link><Link href="/about">About</Link></nav>
    </div></header>
  );
}
