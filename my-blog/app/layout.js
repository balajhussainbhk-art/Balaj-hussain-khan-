import "./globals.css";
import Header from "@/components/Header";
import { site } from "@/lib/site";
export const metadata = { title: { default: site.name, template: `%s | ${site.name}` }, description: site.tagline, metadataBase: new URL(site.url) };
export default function Layout({ children }) {
  return (
    <html lang="en"><head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet" />
    </head><body>
      <Header />
      <main>{children}</main>
      <footer className="ftr"><div className="wrap">
        <p>{site.name}. Some links are affiliate links: we may earn a commission at no extra cost to you.</p>
        <p>Contact: {site.email}</p>
      </div></footer>
    </body></html>
  );
}
