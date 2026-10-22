import './globals.css';
const SITE = 'https://cf-llc.github.io/ocean-dive/';
const OG = 'https://cf-llc.github.io/ocean-dive/og-v2.png';
const TITLE = 'Ocean Dive · a real-scale dive to 10,935 m';
const desc = 'A real-scale dive from the surface to Challenger Deep (10,935 m). Live depth, pressure and temperature, a flashlight in the dark, and 30 creatures to find.';
export const metadata = {
  metadataBase: new URL('https://cf-llc.github.io'),
  title: TITLE,
  description: desc,
  alternates: { canonical: SITE },
  openGraph: { title: TITLE, description: desc, url: SITE, siteName: 'Ocean Dive by CF LLC', type: 'website',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Ocean Dive: a real-scale dive from sunlit kelp to Challenger Deep at 10,935 m' }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: desc, images: [{ url: OG, alt: 'Ocean Dive: a real-scale dive to 10,935 m' }] },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0e4a72' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Cloudflare Web Analytics */}
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "5da4746aa37e402492c3dca880f56c35"}'></script>
      </body>
    </html>
  );
}
