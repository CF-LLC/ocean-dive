import './globals.css';
export const metadata = {
  title: 'Ocean Dive · CF LLC',
  description: 'Scroll from the sunlit surface to the midnight deep in an interactive 3D ocean, right in your browser.',
  openGraph: { title: 'Ocean Dive', description: 'An interactive 3D ocean you can dive into.', url: 'https://cf-llc.github.io/ocean-dive/' },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#04263f' };
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
