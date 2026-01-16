'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import getCroppedImg from '@/utils/canvasUtils';
import { Loader2 } from 'lucide-react';

interface ImageCropperProps {
    image: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (croppedImage: Blob) => void;
    aspect?: number;
}

export function ImageCropper({ image, isOpen, onClose, onSave, aspect = 1 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!image || !croppedAreaPixels) return;

        try {
            setIsProcessing(true);
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            if (croppedImage) {
                onSave(croppedImage);
                onClose();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                </DialogHeader>

                <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden my-4">
                    {image && (
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/70 w-12">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="flex-1"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6 flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save & Apply'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
