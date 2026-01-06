'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2, Copy, CheckCheck } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface UsernameInputProps {
    value: string;
    onChange: (username: string) => void;
    userId: string;
}

type ValidationStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export function UsernameInput({ value, onChange, userId }: UsernameInputProps) {
    const [username, setUsername] = useState(value || '');
    const [status, setStatus] = useState<ValidationStatus>('idle');
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [savedUsername, setSavedUsername] = useState(value || '');
    const [copied, setCopied] = useState(false);

    const debouncedUsername = useDebounce(username, 300);

    // Check username availability
    const checkAvailability = useCallback(async (usernameToCheck: string) => {
        if (!usernameToCheck || usernameToCheck === savedUsername) {
            setStatus('idle');
            setMessage('');
            return;
        }

        setStatus('checking');
        setMessage('Checking availability...');

        try {
            const response = await fetch(
                `/api/username/check?username=${encodeURIComponent(usernameToCheck)}`
            );
            const data = await response.json();

            if (data.available && data.valid) {
                setStatus('available');
                setMessage('✓ Username is available');
            } else if (!data.valid) {
                setStatus('invalid');
                setMessage(data.message || 'Invalid username format');
            } else {
                setStatus('taken');
                setMessage(data.message || 'Username is already taken');
            }
        } catch (error) {
            console.error('Error checking username:', error);
            setStatus('invalid');
            setMessage('Error checking availability');
        }
    }, [savedUsername]);

    // Debounced check
    useEffect(() => {
        if (debouncedUsername) {
            checkAvailability(debouncedUsername);
        }
    }, [debouncedUsername, checkAvailability]);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setUsername(newValue);
        onChange(newValue);
    };

    const handleSave = async () => {
        if (status !== 'available' && username !== savedUsername) {
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('/api/user/username', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (response.ok) {
                setSavedUsername(username);
                setStatus('idle');
                setMessage('Username saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setStatus('invalid');
                setMessage(data.error || 'Failed to save username');
            }
        } catch (error) {
            console.error('Error saving username:', error);
            setMessage('Error saving username');
        } finally {
            setIsSaving(false);
        }
    };

    const copyProfileLink = async () => {
        if (!savedUsername) return;

        const profileUrl = `${window.location.origin}/${savedUsername}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'checking':
                return 'text-muted-foreground';
            case 'available':
                return 'text-green-600';
            case 'taken':
            case 'invalid':
                return 'text-red-600';
            default:
                return 'text-muted-foreground';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
                return <Loader2 className="h-4 w-4 animate-spin" />;
            case 'available':
                return <Check className="h-4 w-4 text-green-600" />;
            case 'taken':
            case 'invalid':
                return <X className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    const hasChanges = username !== savedUsername;
    const canSave = status === 'available' || (username === savedUsername && username);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Public Username</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        @
                    </div>
                    <Input
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="yourusername"
                        className="pl-8 pr-10"
                        maxLength={30}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {getStatusIcon()}
                    </div>
                </div>

                {message && (
                    <p className={`text-sm ${getStatusColor()}`}>{message}</p>
                )}

                <p className="text-xs text-muted-foreground">
                    3-30 characters. Letters, numbers, hyphens, and underscores only.
                </p>
            </div>

            {savedUsername && (
                <div className="space-y-2">
                    <Label>Your Public Profile</Label>
                    <div className="flex gap-2">
                        <Input
                            value={`doodlance.com/${savedUsername}`}
                            readOnly
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={copyProfileLink}
                            title="Copy profile link"
                        >
                            {copied ? (
                                <CheckCheck className="h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Share this link on your social media to get hired directly!
                    </p>
                </div>
            )}

            {hasChanges && (
                <Button
                    onClick={handleSave}
                    disabled={!canSave || isSaving}
                    className="w-full"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Username'
                    )}
                </Button>
            )}
        </div>
    );
}
