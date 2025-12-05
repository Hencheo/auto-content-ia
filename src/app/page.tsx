"use client";

import { useState } from "react";
import { CarouselGenerator } from "@/components/CarouselGenerator";
import { StoryGenerator } from "@/components/StoryGenerator";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'carousel' | 'stories'>('carousel');

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation Header */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button
          onClick={() => setActiveTab('carousel')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'carousel' ? 'var(--accent-gold)' : 'transparent',
            color: activeTab === 'carousel' ? 'black' : 'var(--text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Carrossel (Instagram)
        </button>
        <button
          onClick={() => setActiveTab('stories')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'stories' ? 'var(--accent-gold)' : 'transparent',
            color: activeTab === 'stories' ? 'black' : 'var(--text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Stories (News)
        </button>
      </nav>

      {/* Content */}
      <div style={{ paddingTop: '1rem' }}>
        {activeTab === 'carousel' ? <CarouselGenerator /> : <StoryGenerator />}
      </div>
    </main>
  );
}
