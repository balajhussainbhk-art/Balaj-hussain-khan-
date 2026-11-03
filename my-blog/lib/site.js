export const site = {
  name: "Dailyedit",
  tagline: "Honest guides and product picks, tested so you don't have to.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@yourdomain.com",
};
export const categories = ["Home", "Tech", "Productivity", "Wellness"];
const link = "https://example.com/your-affiliate-link";
export const posts = [
  { slug: "best-standing-desks-2026", title: "The 5 best standing desks for a small home office", category: "Home", date: "2026-10-28", read: "8 min",
    excerpt: "We compared stability, noise and price to find the desks worth your money.",
    body: [{ h: "How we picked" }, { p: "Replace this text with your own research. Explain what you tested and how you compared each product." },
      { product: { name: "Example Desk Pro", price: "From $349", pros: ["Very stable at full height", "Quiet motor", "5-year warranty"], cons: ["Assembly takes about an hour"], link } },
      { h: "Who should skip it" }, { p: "Add a short honest note. Readers trust sites that say when a product is not a fit." }] },
  { slug: "noise-cancelling-headphones-under-200", title: "Noise-cancelling headphones under $200 that actually work", category: "Tech", date: "2026-10-21", read: "6 min",
    excerpt: "Good ANC no longer costs $400. Here are the pairs that hold up for daily use.",
    body: [{ h: "What matters" }, { p: "Sample article. Add your real content here." },
      { product: { name: "Example Headphones X", price: "From $149", pros: ["Strong noise cancelling", "30-hour battery"], cons: ["Case is bulky"], link } }] },
  { slug: "build-a-morning-routine-that-sticks", title: "Tools that help you build a morning routine that sticks", category: "Productivity", date: "2026-10-14", read: "5 min",
    excerpt: "Simple gear and apps that make a routine easier to keep past week two.",
    body: [{ h: "Start small" }, { p: "Sample article. Add your real content here." }] },
  { slug: "best-sleep-trackers", title: "Sleep trackers compared: rings, bands and bedside sensors", category: "Wellness", date: "2026-10-07", read: "9 min",
    excerpt: "Which type of tracker gives you useful data and which just gives you numbers.",
    body: [{ h: "Rings vs bands" }, { p: "Sample article. Add your real content here." }] },
];
