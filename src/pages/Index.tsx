import { useState } from 'react';
import { StreamingForm } from '@/components/StreamingForm';
import { SuccessScreen } from '@/components/SuccessScreen';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video, LogOut, CreditCard, Loader2 } from 'lucide-react';

const Index = () => {
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

  // Redirect to auth if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to payments if not paid/verified
  const hasAccess = localStorage.getItem('bintubot-access') === 'verified';
  if (!loading && user && !hasAccess) {
    return <Navigate to="/payments" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      {/* Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-2">
          <Video className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            BintuBot
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/payments'}>
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center">
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
    </div>
  );
};

export default Index;