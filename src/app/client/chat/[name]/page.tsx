"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatView } from "@/components/client/inbox/chat-view";
import { professionals } from "../../nearby/mockData";
import { useNavbar } from "@/contexts/NavbarContext";

// Message type
interface Message {
    id: string;
    content: string;
    timestamp: Date;
    sender: 'user' | 'other';
    status: 'sent' | 'delivered' | 'read';
}

// Function to generate consistent avatar URL based on name
const getAvatarUrl = (name: string, gender: 'men' | 'women' = 'men') => {
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const id = nameHash % 100;
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

// Generate mock messages for a professional
const generateMockMessages = (proName: string, service: string): Message[] => {
    const now = Date.now();
    return [
        {
            id: '1',
            content: `Hi! I'm interested in your ${service} services.`,
            timestamp: new Date(now - 3600000 * 24),
            sender: 'user',
            status: 'read',
        },
        {
            id: '2',
            content: `Hello! Thank you for reaching out. I'd be happy to help with ${service}. What specifically are you looking for?`,
            timestamp: new Date(now - 3600000 * 23),
            sender: 'other',
            status: 'read',
        },
        {
            id: '3',
            content: `I need regular coaching sessions. What's your availability?`,
            timestamp: new Date(now - 3600000 * 12),
            sender: 'user',
            status: 'delivered',
        },
        {
            id: '4',
            content: `I have slots available this week. Would you prefer morning or evening sessions?`,
            timestamp: new Date(now - 3600000 * 6),
            sender: 'other',
            status: 'read',
        },
    ];
};

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const { setNavbarVisibility } = useNavbar();

    // Hide navbar when chat is open
    useEffect(() => {
        setNavbarVisibility(false);
        return () => setNavbarVisibility(true);
    }, [setNavbarVisibility]);

    // Decode the name from URL
    const freelancerName = useMemo(() => {
        if (!params || typeof params.name === "undefined") return "";
        const value = Array.isArray(params.name) ? params.name[0] : params.name;
        return decodeURIComponent(value);
    }, [params]);

    // Find matching professional or create fallback
    const professional = useMemo(() => {
        const found = professionals.find(
            (pro) => pro.name.toLowerCase() === freelancerName.toLowerCase()
        );

        // If not found, create a fallback professional object
        if (!found && freelancerName) {
            return {
                id: freelancerName.replace(/\s+/g, '-').toLowerCase(),
                name: freelancerName,
                service: 'Professional Service',
                image: '',
            };
        }
        return found;
    }, [freelancerName]);

    // Generate messages for this professional
    const messages = useMemo(() => {
        if (!professional) return [];
        return generateMockMessages(professional.name, professional.service);
    }, [professional]);

    // If no name provided, show error
    if (!freelancerName) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#050505] text-white/70">
                <div className="text-lg">Chat not found</div>
                <button
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Determine avatar
    const nameHash = freelancerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gender = nameHash % 2 === 0 ? 'men' : 'women';

    return (
        <ChatView
            chatId={`pro-${professional?.id || 'unknown'}`}
            recipientName={freelancerName}
            recipientAvatar={professional?.image || getAvatarUrl(freelancerName, gender)}
            recipientJobTitle={professional?.service || 'Professional'}
            online={true}
            onBack={() => router.back()}
            messages={messages}
        />
    );
}
