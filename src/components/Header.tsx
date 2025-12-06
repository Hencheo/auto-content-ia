import React from 'react';
import Link from "next/link";
import { User } from 'lucide-react';
import logo from '@/app/assets/logo.png';

interface HeaderProps {
    compact?: boolean;
    avatar?: string | null;
}

export function Header({ compact = false, avatar }: HeaderProps) {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: compact ? '0.75rem 1.5rem' : '1.5rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            transition: 'all 0.5s ease',
            height: compact ? '60px' : '90px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: 'var(--bg-primary)', // Ensure background is opaque for sticky
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.5s ease',
                transform: compact ? 'scale(0.8)' : 'scale(1)',
                transformOrigin: 'left center'
            }}>
                <img src={logo.src} alt="AutoContent Logo" className="logo-img" />
            </div>

            <Link href="/profile" className="btn" style={{
                padding: 0, // Removed padding to let image fill the circle
                borderRadius: '50%',
                width: compact ? '32px' : '40px',
                height: compact ? '32px' : '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                transition: 'all 0.5s ease'
            }}>
                {avatar ? (
                    <img src={avatar} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <User size={compact ? 16 : 20} color="var(--text-secondary)" />
                )}
            </Link>
        </header>
    );
}
