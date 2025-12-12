"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VoiceToneId, DEFAULT_VOICE_TONE } from '@/lib/voiceTones';
import { StorageProviderId } from '@/lib/storageProviders';

interface UserContextType {
    name: string;
    setName: (name: string) => void;
    handle: string;
    setHandle: (handle: string) => void;
    avatar: string | null;
    setAvatar: (avatar: string | null) => void;
    profession: string;
    setProfession: (profession: string) => void;
    product: string;
    setProduct: (product: string) => void;
    audience: string;
    setAudience: (audience: string) => void;
    voiceTone: VoiceToneId;
    setVoiceTone: (voiceTone: VoiceToneId) => void;
    storageProvider: StorageProviderId;
    setStorageProvider: (provider: StorageProviderId) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [name, setName] = useState('Seu Nome');
    const [handle, setHandle] = useState('@seu_usuario');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [profession, setProfession] = useState('');
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [voiceTone, setVoiceTone] = useState<VoiceToneId>(DEFAULT_VOICE_TONE);
    const [storageProvider, setStorageProvider] = useState<StorageProviderId>('zip-local');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedName = localStorage.getItem('user_name');
        const savedHandle = localStorage.getItem('user_handle');
        const savedAvatar = localStorage.getItem('user_avatar');
        const savedProfession = localStorage.getItem('user_profession');
        const savedProduct = localStorage.getItem('user_product');
        const savedAudience = localStorage.getItem('user_audience');
        const savedVoiceTone = localStorage.getItem('user_voice_tone');
        const savedStorageProvider = localStorage.getItem('user_storage_provider');

        if (savedName) setName(savedName);
        if (savedHandle) setHandle(savedHandle);
        if (savedAvatar) setAvatar(savedAvatar);
        if (savedProfession) setProfession(savedProfession);
        if (savedProduct) setProduct(savedProduct);
        if (savedAudience) setAudience(savedAudience);
        if (savedVoiceTone) setVoiceTone(savedVoiceTone as VoiceToneId);
        if (savedStorageProvider) setStorageProvider(savedStorageProvider as StorageProviderId);

        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_handle', handle);
            if (avatar) {
                localStorage.setItem('user_avatar', avatar);
            } else {
                localStorage.removeItem('user_avatar');
            }
            localStorage.setItem('user_profession', profession);
            localStorage.setItem('user_product', product);
            localStorage.setItem('user_audience', audience);
            localStorage.setItem('user_voice_tone', voiceTone);
            localStorage.setItem('user_storage_provider', storageProvider);
        }
    }, [name, handle, avatar, profession, product, audience, voiceTone, storageProvider, isLoaded]);

    return (
        <UserContext.Provider value={{
            name, setName,
            handle, setHandle,
            avatar, setAvatar,
            profession, setProfession,
            product, setProduct,
            audience, setAudience,
            voiceTone, setVoiceTone,
            storageProvider, setStorageProvider
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

