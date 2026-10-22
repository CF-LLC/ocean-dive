import './globals.css';
const desc = 'Scroll from the sunlit surface to the sea floor in an interactive 3D ocean. Tap creatures for photos and fun facts.';
export const metadata = {
  metadataBase: new URL('https://cf-llc.github.io'),
  title: 'Ocean Dive · an interactive 3D dive to the sea floor',
  description: desc,
  openGraph: { title: 'Ocean Dive', description: desc, url: 'https://cf-llc.github.io/ocean-dive/', siteName: 'Ocean Dive by CF LLC', type: 'website',
    images: [{ url: '/ocean-dive/og.jpg', width: 1200, height: 630, alt: 'Ocean Dive: a 3D ocean from surface to sea floor' }] },
  twitter: { card: 'summary_large_image', title: 'Ocean Dive', description: desc, images: ['/ocean-dive/og.jpg'] },
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
