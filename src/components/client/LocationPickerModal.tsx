import { useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLocation: string;
    onUpdateLocation: (location: string) => Promise<void>;
    onUseCurrentLocation: () => Promise<void>;
}

export function LocationPickerModal({
    isOpen,
    onClose,
    currentLocation,
    onUpdateLocation,
    onUseCurrentLocation
}: LocationPickerModalProps) {
    const [manualLocation, setManualLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualLocation.trim()) return;

        setLoading(true);
        setError(null);
        try {
            await onUpdateLocation(manualLocation);
            setManualLocation('');
            onClose();
        } catch (err) {
            setError('Failed to find location. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseCurrentLocation = async () => {
        setLoading(true);
        setError(null);
        try {
            await onUseCurrentLocation();
            onClose();
        } catch (err) {
            setError('Failed to get current location.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-sm bg-[#161616] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Select Location</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                placeholder="Enter city or area"
                                                value={manualLocation}
                                                onChange={(e) => setManualLocation(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white placeholder-white/30 h-12 pl-12 pr-14 transition-colors focus:border-purple-500/50 focus:bg-white/10"
                                            />
                                            {/* Left Icon - Perfectly centered */}
                                            <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-white/40 pointer-events-none z-10">
                                                <MapPin className="w-5 h-5" />
                                            </div>

                                            {/* Right Button - Perfectly centered */}
                                            <div className="absolute right-2 top-0 bottom-0 flex items-center z-10">
                                                <button
                                                    type="button"
                                                    onClick={handleUseCurrentLocation}
                                                    disabled={loading}
                                                    className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 hover:text-purple-300 transition-all disabled:opacity-50"
                                                    title="Use current location"
                                                >
                                                    {loading ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Navigation className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        {error && <p className="text-xs text-red-400">{error}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                                        disabled={loading || !manualLocation.trim()}
                                    >
                                        {loading ? 'Updating...' : 'Update Location'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
