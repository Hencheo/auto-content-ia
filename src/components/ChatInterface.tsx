import React, { useState } from 'react';
import { NeonButton } from './NeonButton';

interface ChatInterfaceProps {
  onGenerate: (text: string, format: 'carousel' | 'story' | 'post') => void;
  loading: boolean;
}

export function ChatInterface({ onGenerate, loading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<'carousel' | 'story' | 'post'>('carousel');

  const handleSubmit = () => {
    if (!input.trim() || loading) return;
    onGenerate(input, format);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getPlaceholder = () => {
    if (format === 'carousel') return "Digite a dor do seu cliente ou o tema do carrossel...";
    if (format === 'story') return "Cole o link da notícia ou digite o assunto do story...";
    return "Descreva o post...";
  };

  return (
    <div className="flex justify-center w-full px-3 sm:px-4">
      <div
        className="flex flex-col w-full max-w-[340px] sm:max-w-[500px] md:max-w-[600px] fixed left-1/2 -translate-x-1/2 z-[100] md:static md:translate-x-0"
        style={{
          bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {/* Format Buttons */}
        <div className="format-buttons-container">
          <NeonButton
            label="Carrossel"
            isActive={format === 'carousel'}
            onClick={() => setFormat('carousel')}
          />
          <NeonButton
            label="Story"
            isActive={format === 'story'}
            onClick={() => setFormat('story')}
          />
          <NeonButton
            label="Post"
            isActive={format === 'post'}
            onClick={() => setFormat('post')}
          />
        </div>

        {/* Unified Input Container */}
        <div className="w-full">
          <div className="relative bg-black rounded-xl overflow-hidden">
            <textarea
              className="w-full min-h-[60px] max-h-[200px] bg-transparent text-white placeholder:text-white/50 border-0 outline-none resize-none focus:ring-0 focus:outline-none leading-[1.4] text-sm sm:text-base"
              style={{ paddingLeft: '1.25rem', paddingRight: '3.5rem', paddingTop: '1rem', paddingBottom: '1rem' }}
              placeholder={getPlaceholder()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="absolute right-3 bottom-3 rounded-lg p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height={16}
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
