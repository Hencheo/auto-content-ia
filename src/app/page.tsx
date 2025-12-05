import { CarouselGenerator } from "@/components/CarouselGenerator";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <CarouselGenerator />
    </main>
  );
}
