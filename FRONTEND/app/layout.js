import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'SneakAI — AI-Powered Sneaker Discovery',
  description: 'Discover your perfect sneakers with AI-powered recommendations. Browse trending kicks, explore in 3D, and shop with confidence.',
  keywords: 'sneakers, AI recommendations, shoes, Nike, Adidas, New Balance, sneaker shopping',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        <SmoothScroll>
          <Navbar />
          <main className="relative">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
