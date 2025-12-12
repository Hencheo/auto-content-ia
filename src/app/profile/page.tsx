"use client";

import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import { VOICE_TONES, VoiceToneId } from '@/lib/voiceTones';
import { STORAGE_PROVIDERS } from '@/lib/storageProviders';

export default function ProfilePage() {
    const {
        name, setName,
        handle, setHandle,
        avatar, setAvatar,
        profession, setProfession,
        product, setProduct,
        audience, setAudience,
        voiceTone, setVoiceTone,
        storageProvider, setStorageProvider
    } = useUser();

    const [showSaved, setShowSaved] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <div className="profile-header">
                    <Link href="/" className="profile-back-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="profile-title">
                        Meu Perfil
                    </h1>
                </div>

                <div className="profile-card">
                    <div className="profile-avatar-section">
                        <label className="profile-avatar-wrapper">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="profile-image" />
                            ) : (
                                <span className="profile-avatar-placeholder">👤</span>
                            )}
                            <div className="profile-edit-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden-input" />
                        </label>
                    </div>

                    <div className="profile-section-header">
                        Pessoal
                    </div>

                    <div className="input-group">
                        <label className="input-label-modern">Nome de Exibição</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu Nome"
                            className="input-field-modern"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label-modern">Usuário (Arroba)</label>
                        <input
                            type="text"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="@seu_usuario"
                            className="input-field-modern"
                        />
                    </div>

                    <div className="profile-section-header">
                        Seu Negócio
                    </div>

                    <div className="input-group">
                        <label className="input-label-modern">Profissão / Especialidade</label>
                        <input
                            type="text"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            placeholder="Ex: Nutricionista, Consultor..."
                            className="input-field-modern"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label-modern">O que vende?</label>
                        <input
                            type="text"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            placeholder="Ex: Consultoria, E-book..."
                            className="input-field-modern"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label-modern">Público Alvo</label>
                        <input
                            type="text"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            placeholder="Ex: Iniciantes, Empresários..."
                            className="input-field-modern"
                        />
                    </div>

                    <div className="profile-section-header">
                        Tom de Voz da IA
                    </div>

                    <div className="voice-tone-grid">
                        {VOICE_TONES.map((tone) => (
                            <button
                                key={tone.id}
                                type="button"
                                className={`voice-tone-button ${voiceTone === tone.id ? 'active' : ''}`}
                                onClick={() => setVoiceTone(tone.id)}
                            >
                                <span className="voice-tone-emoji">{tone.emoji}</span>
                                <span className="voice-tone-label">{tone.label}</span>
                            </button>
                        ))}
                    </div>

                    <p className="voice-tone-description">
                        {VOICE_TONES.find(t => t.id === voiceTone)?.description}
                    </p>

                    <div className="profile-section-header">
                        Local de Salvamento
                    </div>

                    <div className="storage-provider-grid">
                        {STORAGE_PROVIDERS.map((provider) => (
                            <button
                                key={provider.id}
                                type="button"
                                className={`storage-provider-button ${storageProvider === provider.id ? 'active' : ''}`}
                                onClick={() => setStorageProvider(provider.id)}
                            >
                                <span className="storage-provider-icon">{provider.icon}</span>
                                <span className="storage-provider-label">{provider.name}</span>
                            </button>
                        ))}
                    </div>

                    <p className="storage-provider-description">
                        {STORAGE_PROVIDERS.find(p => p.id === storageProvider)?.description}
                    </p>

                    <button
                        type="button"
                        className="save-button"
                        onClick={handleSave}
                    >
                        Salvar Alterações
                    </button>

                    <div style={{ height: '4rem' }}></div>
                    {/* Spacer for bottom scrolling */}
                </div>

                {showSaved && (
                    <div className="save-indicator">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Alterações salvas
                    </div>
                )}
            </div>
        </div>
    );
}
