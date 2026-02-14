'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface RequestServiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultSport?: string;
    userId?: string;
}

const sports = [
    "Cricket", "Football", "Badminton", "Tennis", "Pickleball",
    "Basketball", "Padel", "Table Tennis", "Combat Sports", "Fitness", "Other"
];

export function RequestServiceDialog({ open, onOpenChange, defaultSport = '', userId }: RequestServiceDialogProps) {
    const [loading, setLoading] = useState(false);
    // const { toast } = useToast(); // Removed
    const [formData, setFormData] = useState({
        details: '',
    });

    // No longer needed to track sport
    useEffect(() => {
        // Resetting details when opening
        if (open) setFormData({ details: '' });
    }, [open]);

    const isFormValid = formData.details.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/requests/service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    details: formData.details,
                    userId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            toast.success("Request Submitted", {
                description: "We've received your request and will get back to you soon!",
            });
            onOpenChange(false);
            setFormData({ details: '' }); // Reset form
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>Request a Service</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Can't find what you're looking for? Let us know what service you need.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">

                    {/* Removed sport selection */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="sport">Sport / Category</Label>
                        <Select
                            value={formData.sport}
                            onValueChange={(value) => setFormData({ ...formData, sport: value })}
                        >
                            <SelectTrigger className="bg-[#2a2a2a] border-gray-700">
                                <SelectValue placeholder="Select a sport" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                                {sports.map(sport => (
                                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {formData.sport === 'Other' && (
                            <Input
                                placeholder="Enter Sport Name"
                                value={formData.otherSport}
                                onChange={(e) => setFormData({ ...formData, otherSport: e.target.value })}
                                className="mt-2 bg-[#2a2a2a] border-gray-700"
                                required
                            />
                        )}
                    </div> */}

                    <div className="space-y-2">
                        <Label htmlFor="details">Service Details</Label>
                        <Textarea
                            id="details"
                            placeholder="Describe the service, feature, or anything you want to see on our platform..."
                            value={formData.details}
                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                            className="bg-[#2a2a2a] border-gray-700 min-h-[100px]"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
