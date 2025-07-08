import { useState } from 'react';
import { StreamingForm } from '@/components/StreamingForm';
import { SuccessScreen } from '@/components/SuccessScreen';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const handleStreamStart = async (data: { streamKey: string; videoFile: File; loopVideo: boolean }) => {
    try {
      const formData = new FormData();
      formData.append('streamKey', data.streamKey);
      formData.append('video', data.videoFile);
      formData.append('loopVideo', data.loopVideo.toString());

      const response = await fetch('/api/start-stream', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setIsStreamStarted(true);
      setIsStreaming(true);
      
      toast({
        variant: "default",
        title: "Stream started successfully!",
        description: "Your video is now live on YouTube.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to start stream",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleBack = () => {
    setIsStreamStarted(false);
    setIsStreaming(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isStreamStarted ? (
          <SuccessScreen onBack={handleBack} />
        ) : (
          <StreamingForm 
            onStreamStart={handleStreamStart}
            isStreaming={isStreaming}
          />
        )}
      </div>
    </div>
  );
};

export default Index;