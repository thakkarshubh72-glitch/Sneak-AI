import { sneakers as staticSneakers } from '@/data/sneakers';

export async function generateStaticParams() {
  return staticSneakers.map((sneaker) => ({
    id: sneaker.id,
  }));
}

export default function Layout({ children }) {
  return children;
}
