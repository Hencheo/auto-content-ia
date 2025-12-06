import React, { useState } from 'react';
import styled from 'styled-components';
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
    <StyledWrapper>
      <div className="container_chat_bot">

        <div className="tags">
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
        <div className="container-chat-options">
          <div className="chat">
            <div className="chat-bot">
              <textarea
                id="chat_bot"
                name="chat_bot"
                placeholder={getPlaceholder()}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </div>
            <div className="options">
              <div className="btns-add">
                {/* Icons removed as requested */}
              </div>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <i>
                    <svg viewBox="0 0 512 512">
                      <path fill="currentColor" d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05" />
                    </svg>
                  </i>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  .container_chat_bot {
    display: flex;
    flex-direction: column;
    max-width: 600px; /* Increased width for better UX */
    width: 100%;

    @media (max-width: 768px) {
      position: fixed;
      bottom: 4rem;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 0 1rem 1rem 1rem;
      max-width: 100%;
    }
  }

  .container_chat_bot .container-chat-options {
    position: relative;
    display: flex;
    background: linear-gradient(
      to bottom right,
      #7e7e7e,
      #363636,
      #363636,
      #363636,
      #363636
    );
    border-radius: 16px;
    padding: 1.5px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);

    &::after {
      position: absolute;
      content: "";
      top: -10px;
      left: -10px;
      background: radial-gradient(
        ellipse at center,
        #ffffff,
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.1),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0)
      );
      width: 30px;
      height: 30px;
      filter: blur(1px);
    }
  }

  .container_chat_bot .container-chat-options .chat {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.8); /* Darker background */
    border-radius: 15px;
    width: 100%;
    overflow: hidden;
  }

  .container_chat_bot .container-chat-options .chat .chat-bot {
    position: relative;
    display: flex;
  }

  .container_chat_bot .chat .chat-bot textarea {
    background-color: transparent;
    border-radius: 16px;
    border: none;
    width: 100%;
    height: 80px; /* Increased height */
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 16px; /* Larger font */
    font-weight: 400;
    padding: 20px;
    resize: none;
    outline: none;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
      cursor: pointer;
    }

    &::placeholder {
      color: #f3f6fd;
      opacity: 0.5;
      transition: all 0.3s ease;
    }
    &:focus::placeholder {
      color: #363636;
    }
  }

  .container_chat_bot .chat .options {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 10px 20px 20px 20px;
  }

  .container_chat_bot .chat .options .btns-add {
    display: flex;
    gap: 8px;
  }

  .container_chat_bot .chat .options .btn-submit {
    display: flex;
    padding: 8px;
    background-image: linear-gradient(to top, #292929, #555555, #292929);
    border-radius: 10px;
    box-shadow: inset 0 6px 2px -4px rgba(255, 255, 255, 0.5);
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.15s ease;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    & i {
      width: 30px;
      height: 30px;
      padding: 6px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      backdrop-filter: blur(3px);
      color: #8b8b8b;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    & svg {
      transition: all 0.3s ease;
      width: 100%;
      height: 100%;
    }
    &:hover svg {
      color: #f3f6fd;
      filter: drop-shadow(0 0 5px #ffffff);
    }

    &:focus svg {
      color: #f3f6fd;
      filter: drop-shadow(0 0 5px #ffffff);
      transform: scale(1.2) rotate(45deg) translateX(-2px) translateY(1px);
    }

    &:active {
      transform: scale(0.92);
    }
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .container_chat_bot .tags {
    padding: 14px 0;
    display: flex;
    color: #ffffff;
    font-size: 12px;
    gap: 8px;
    justify-content: center;

    & span {
      padding: 6px 12px;
      background-color: #1b1b1b;
      border: 1.5px solid #363636;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;

      &:hover {
        background-color: #333;
        border-color: #555;
      }

      &.active {
        background-color: var(--accent-gold, #fbbf24);
        color: black;
        border-color: var(--accent-gold, #fbbf24);
        font-weight: bold;
      }
    }
  }`;
