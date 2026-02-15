
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, Map, Calendar, Briefcase, Zap, Star } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';

interface AppGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { resetTutorials } = useTutorial();

    const guides = [
        {
            id: 'intro-tour',
            title: 'Welcome Tour',
            description: 'Explore the dashboard, search, and key features.',
            icon: <Star className="w-5 h-5 text-purple-400" />,
            path: '/'
        },
        {
            id: 'hire-tour',
            title: 'How to Hire',
            description: 'Learn to find experts, use filters, and book services.',
            icon: <Map className="w-5 h-5 text-purple-400" />,
            path: '/client/nearby/hirefeed'
        },
        {
            id: 'bookings-tour',
            title: 'Manage Bookings',
            description: 'Track ongoing sessions, history, and applications.',
            icon: <Calendar className="w-5 h-5 text-purple-400" />,
            path: '/client/bookings'
        },
        {
            id: 'freelancer-tour',
            title: 'Freelancer Dashboard',
            description: 'Track earnings, toggle availability, and view stats.',
            icon: <Briefcase className="w-5 h-5 text-purple-400" />,
            path: '/freelancer'
        }
    ];

    const handleStartGuide = (guideId: string, path: string) => {
        onClose();
        // If we're already on the path, we can force a reload or just update params
        // But updating params is cleaner.
        // We add a timestamp to force re-running effect if param already exists
        router.push(`${path}?tutorial=${guideId}&t=${Date.now()}`);
    };

    const handleResetAll = () => {
        if (confirm('This will reset all your tutorial progress and reload the app. Continue?')) {
            resetTutorials();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#18181b] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        App Guide
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Select a guide to learn more about specific features.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {guides.map((guide) => (
                        <button
                            key={guide.id}
                            onClick={() => handleStartGuide(guide.id, guide.path)}
                            className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all group text-left"
                        >
                            <div className="mt-1 p-2 rounded-lg bg-black/20 group-hover:bg-purple-500/20 transition-colors">
                                {guide.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                                    {guide.title}
                                </h3>
                                <p className="text-sm text-white/60">
                                    {guide.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex justify-center border-t border-white/10 pt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetAll}
                        className="text-white/40 hover:text-white hover:bg-white/5 text-xs"
                    >
                        Reset All Tutorials
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
