'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SelfieCaptureProps {
  onCapture: (imageData: string) => void;
  onRetake: () => void;
  capturedImage: string | null;
  isUploading: boolean;
  error?: string | null;
}

export function SelfieCapture({ 
  onCapture, 
  onRetake, 
  capturedImage, 
  isUploading,
  error 
}: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      // Check if we have permissions
      const permissionResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionResult.state === 'denied') {
        setCameraError('Enable camera access in settings to verify your identity.');
        return;
      }

      const constraints = {
        video: { 
          facingMode: { exact: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      // Try with exact constraints first
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (exactError) {
        console.log('Exact constraints failed, trying with more lenient constraints');
        // Try with more lenient constraints
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: false
          });
        } catch (lenientError) {
          console.error('Error accessing camera with lenient constraints:', lenientError);
          throw lenientError;
        }
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraReady(true);
        setShowInstructions(false);
        if (cameraError) {
          setCameraError(null);
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Camera not accessible. Check connection and permissions.');
      setShowInstructions(false);
    }
  }, [facingMode, cameraError]);

  // Clean up camera stream
  useEffect(() => {
    // Start camera when component mounts
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
      }
    };
  }, [startCamera, stream]); // Add stream to dependencies

  const captureImage = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw the current frame from the video
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64 and notify parent
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(imageData);
      
      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const toggleCamera = async () => {
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    // Toggle facing mode
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // Restart camera with new facing mode
    await startCamera();
  };



  if (capturedImage) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border-2 border-green-500 bg-black/20">
          <img 
            src={capturedImage} 
            alt="Captured selfie" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={onRetake}
            disabled={isUploading}
            className="flex items-center space-x-2"
          >
            <RotateCw className="h-4 w-4" />
            <span>Retake</span>
          </Button>
        </div>
      </div>
    );
  }

  // Show error state if camera access fails
  if (cameraError) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card border border-border/50 rounded-xl p-6 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
            <Camera className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Camera Access Required</h3>
          <p className="text-muted-foreground mb-6">
            {cameraError}
          </p>
          <Button 
            onClick={startCamera} 
            variant="destructive"
            size="lg"
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {showInstructions ? (
        <div className="bg-card border border-border/50 rounded-xl p-8 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Verify Your Identity</h3>
          <p className="text-muted-foreground mb-8">
            Take a quick selfie to verify your identity. We'll guide you through the process.
          </p>
          
          <div className="space-y-4 mb-8 text-left">
            {[
              'Face the camera directly with good lighting',
              'Ensure your face is clearly visible',
              'No hats, masks, or sunglasses',
              'Stand in a well-lit area'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm">
                    {index + 1}
                  </div>
                </div>
                <p className="text-foreground/90 text-sm">{item}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={startCamera}
              size="lg"
              className="w-full"
            >
              Start Camera
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              We'll ask for camera permission in the next step
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-black rounded-xl overflow-hidden border-2 border-white/10">
            {isCameraReady ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/50">
                <div className="text-center p-6">
                  <Camera className="h-12 w-12 mx-auto text-white/40 mb-3" />
                  <p className="text-white/60">Initializing camera...</p>
                </div>
              </div>
            )}
            
            {isCameraReady && (
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button
                    onClick={toggleCamera}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Switch camera"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={captureImage}
                    className="h-16 w-16 rounded-full bg-white border-4 border-white/30 flex items-center justify-center hover:scale-105 transition-transform"
                    aria-label="Take photo"
                  >
                    <div className="h-12 w-12 rounded-full bg-white"></div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="flex items-center justify-center text-red-400 text-sm mt-2">
              <XCircle className="h-4 w-4 mr-1.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="text-center text-sm text-white/60 mt-4">
            <p>Make sure your face is clearly visible and well-lit</p>
            <p className="text-xs mt-1">We'll compare this with your ID document</p>
          </div>
        </>
      )}
    </div>
  );
}
