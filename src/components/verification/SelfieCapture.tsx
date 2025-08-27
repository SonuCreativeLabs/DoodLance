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
      <div className="w-full">
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-green-500/50 bg-black/20">
          <img 
            src={capturedImage} 
            alt="Captured selfie" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-4">
            <div className="bg-green-500/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit mx-auto mt-2">
              <p className="text-sm font-medium text-green-400 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Photo captured
              </p>
            </div>
            <div className="flex justify-center pb-6">
              <Button 
                onClick={onRetake}
                disabled={isUploading}
                variant="outline"
                className="rounded-full h-12 px-6 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                <span>Retake Photo</span>
              </Button>
            </div>
          </div>
        </div>
        
        {isUploading && (
          <div className="mt-4 text-center">
            <p className="text-sm text-white/70">Uploading your selfie...</p>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-white h-full animate-pulse w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show error state if camera access fails
  if (cameraError) {
    // Check if we're in a browser environment
    const isInApp = typeof window !== 'undefined' && 
                   (// @ts-ignore - iOS Safari
                    (window.navigator as any).standalone || 
                    window.matchMedia('(display-mode: standalone)').matches ||
                    document.referrer.includes('android-app://') ||
                    // @ts-ignore - For newer Android Chrome
                    (window.navigator as any).standalone);

    // Determine the appropriate message based on context
    const getErrorMessage = () => {
      if (isInApp) {
        return 'Please enable camera permissions in your device settings to continue with verification.';
      } else {
        return 'Please allow camera access in your browser settings to continue with verification.';
      }
    };

    return (
      <div className="w-full">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-red-500/20 rounded-2xl p-8 text-center shadow-xl overflow-hidden relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
              <Camera className="h-8 w-8 text-red-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Camera Access Required</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              {getErrorMessage()}
            </p>
            
            <div className="space-y-4 max-w-xs mx-auto">
              <Button 
                onClick={startCamera} 
                size="lg"
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-red-500/20 transition-all"
              >
                Try Again
              </Button>
              
              <p className="text-xs text-white/50 mt-4">
                {isInApp 
                  ? 'Make sure the app has camera permissions enabled in your device settings.'
                  : 'Check your browser settings if the issue persists.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showInstructions ? (
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-2xl p-6 text-center shadow-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4C1D95_0%,transparent_70%)] opacity-30 rounded-full blur-xl"></div>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6 relative z-10">
              <Camera className="h-8 w-8 text-purple-300" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3">Take a Selfie</h3>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            We need to verify that you match your ID document. Make sure your face is clearly visible.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-md mx-auto">
            {[
              { text: 'Good lighting', icon: '☀️' },
              { text: 'Face the camera', icon: '👤' },
              { text: 'No accessories', icon: '👓' },
              { text: 'Neutral expression', icon: '😐' }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
                <span className="text-xl">{item.icon}</span>
                <p className="text-sm text-white/90">{item.text}</p>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={startCamera}
            size="lg"
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20"
          >
            Open Camera
          </Button>
        </div>
      ) : (
        <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-white/10">
          {/* Camera preview */}
          {isCameraReady ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Face guide overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-white/30 rounded-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-72 border-2 border-white/10 rounded-2xl"></div>
              </div>
              
              {/* Camera controls */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Top bar */}
                <div className="flex justify-between items-start">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <p className="text-xs font-medium text-white flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                      <span>Camera active</span>
                    </p>
                  </div>
                  
                  <button
                    onClick={toggleCamera}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                    aria-label="Switch camera"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Capture button */}
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-1.5 rounded-full mb-8">
                    <button
                      onClick={captureImage}
                      className="h-16 w-16 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform relative"
                      aria-label="Take photo"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 hover:opacity-20 transition-opacity"></div>
                      <div className="h-14 w-14 rounded-full bg-white"></div>
                    </button>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-2">Center your face in the frame</p>
                  <p className="text-xs text-white/40">We'll verify it matches your ID</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] p-6 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4C1D95_0%,transparent_70%)] opacity-30 rounded-full blur-xl"></div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-purple-300 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Preparing Camera</h3>
              <p className="text-white/50 text-sm max-w-xs">Please allow camera access when prompted</p>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse w-3/4"></div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 text-xs px-3 py-1.5 rounded-full flex items-center">
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
