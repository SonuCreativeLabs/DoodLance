import React from 'react';

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function BallLoader({ className = '', size = 'md' }: LoaderProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`flex items-center justify-center gap-1.5 ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]`}></div>
            <div className={`${sizeClasses[size]} rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]`}></div>
            <div className={`${sizeClasses[size]} rounded-full bg-purple-500 animate-bounce`}></div>
        </div>
    );
}
