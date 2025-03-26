import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/ui/video-player';
import { saveVideoToLocalStorage } from '@/lib/storage';
import { 
  Video, 
  Camera, 
  Upload, 
  StopCircle, 
  Play, 
  RotateCcw, 
  Check, 
  Loader2 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UploadVideo = () => {
  const [recordingMode, setRecordingMode] = useState<'camera' | 'upload' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoSaved, setIsVideoSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, []);

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play();
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        
        stopMediaTracks();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow access to your camera and microphone to record a pitch.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    
    setVideoBlob(null);
    setVideoUrl(null);
    setIsVideoSaved(false);
    stopMediaTracks();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file && file.type.startsWith('video/')) {
      const blob = file.slice(0, file.size, file.type);
      setVideoBlob(blob);
      
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      
      e.target.value = '';
    } else if (file) {
      toast({
        title: "Invalid file format",
        description: "Please upload a video file.",
        variant: "destructive"
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const saveVideo = async () => {
    if (!videoBlob || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your pitch.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await saveVideoToLocalStorage({
        id: Date.now().toString(),
        title,
        description,
        blob: videoBlob,
        date: new Date().toISOString()
      });
      
      setIsVideoSaved(true);
      
      toast({
        title: "Pitch saved successfully",
        description: "Your pitch has been uploaded to the platform.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Error saving pitch",
        description: "An error occurred while saving your pitch. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {!recordingMode && !videoUrl && (
        <div className="text-center staggered-fade-in">
          <h2 className="text-2xl font-bold mb-6">Create Your 30-Second Pitch</h2>
          <p className="text-muted-foreground mb-8">
            Choose how you'd like to create your pitch video
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setRecordingMode('camera')}
              className="aspect-square glass-card rounded-xl flex flex-col items-center justify-center p-8 transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Record Now</h3>
              <p className="text-muted-foreground text-center">
                Use your webcam to record your pitch directly in the browser
              </p>
            </button>
            
            <button 
              onClick={() => setRecordingMode('upload')}
              className="aspect-square glass-card rounded-xl flex flex-col items-center justify-center p-8 transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Video</h3>
              <p className="text-muted-foreground text-center">
                Upload a pre-recorded video from your device
              </p>
            </button>
          </div>
        </div>
      )}
      
      {recordingMode === 'camera' && !videoUrl && (
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Record Your Pitch</h2>
          <p className="text-muted-foreground mb-8">
            Look at the camera and speak clearly. You have 30 seconds to impress!
          </p>
          
          <div className="relative mb-8 rounded-xl overflow-hidden bg-black aspect-video mx-auto">
            {countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                <div className="text-white text-6xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>
            )}
            
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1 z-10">
                <div className="h-3 w-3 rounded-full bg-red-500 recording-pulse"></div>
                <span className="text-white text-sm">Recording</span>
              </div>
            )}
            
            <video 
              ref={videoRef} 
              className="w-full h-full"
              autoPlay 
              playsInline
            />
          </div>
          
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <Button 
                onClick={startCountdown} 
                className="bg-blue-500 hover:bg-blue-600 button-animated"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={stopRecording} 
                variant="destructive"
                size="lg"
                className="button-animated"
              >
                <StopCircle className="mr-2 h-5 w-5" />
                Stop Recording
              </Button>
            )}
            
            <Button 
              onClick={() => setRecordingMode(null)} 
              variant="outline"
              size="lg"
            >
              Back
            </Button>
          </div>
        </div>
      )}
      
      {recordingMode === 'upload' && !videoUrl && (
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Upload Your Pitch</h2>
          <p className="text-muted-foreground mb-8">
            Select a video that's 30 seconds or less and shows you pitching your idea.
          </p>
          
          <div 
            className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-12 flex flex-col items-center justify-center mb-8 hover:border-blue-500/50 transition-colors cursor-pointer"
            onClick={triggerFileUpload}
          >
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Click to select a video</p>
            <p className="text-sm text-muted-foreground">MP4, WebM or Ogg file, 30 seconds or less</p>
            
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleFileUpload}
            />
          </div>
          
          <Button 
            onClick={() => setRecordingMode(null)} 
            variant="outline"
            size="lg"
          >
            Back
          </Button>
        </div>
      )}
      
      {videoUrl && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">
            {isVideoSaved ? 'Pitch Saved!' : 'Review Your Pitch'}
          </h2>
          
          <div className="mb-8">
            <VideoPlayer src={videoUrl} className="rounded-xl overflow-hidden" />
          </div>
          
          {!isVideoSaved ? (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Pitch Title*
                  </label>
                  <input 
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    placeholder="e.g., EcoTrack: Sustainable Supply Chain Monitoring"
                    maxLength={60}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Pitch Description
                  </label>
                  <textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background resize-none"
                    placeholder="Briefly describe your startup idea..."
                    rows={3}
                    maxLength={200}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <Button 
                  onClick={resetRecording} 
                  variant="outline"
                  className="sm:order-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Record Again
                </Button>
                <Button 
                  onClick={saveVideo} 
                  className="bg-blue-500 hover:bg-blue-600 button-animated sm:order-2"
                  disabled={isSaving || !title.trim()}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Pitch
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Your pitch has been saved and is now ready for the world to see.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Button asChild variant="outline">
                  <Link to="/upload">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Create Another
                  </Link>
                </Button>
                <Button asChild className="bg-blue-500 hover:bg-blue-600 button-animated">
                  <Link to="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
