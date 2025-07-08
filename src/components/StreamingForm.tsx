import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Play, Loader2, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StreamingFormProps {
  onStreamStart: (data: { streamKey: string; videoFile: File; loopVideo: boolean }) => void;
  isStreaming: boolean;
}

export const StreamingForm = ({ onStreamStart, isStreaming }: StreamingFormProps) => {
  const [streamKey, setStreamKey] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loopVideo, setLoopVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'video/mp4') {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an MP4 video file.",
        });
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!streamKey.trim()) {
      toast({
        variant: "destructive",
        title: "Stream key required",
        description: "Please enter your YouTube stream key.",
      });
      return;
    }

    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "Video file required",
        description: "Please upload an MP4 video file.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onStreamStart({ streamKey, videoFile, loopVideo });
    } catch (error) {
      console.error('Stream start error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Youtube className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">YouTube Live Stream</CardTitle>
        </div>
        <CardDescription>
          Upload your video and start streaming to YouTube Live
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="streamKey">YouTube Stream Key</Label>
            <Input
              id="streamKey"
              type="password"
              placeholder="Enter your stream key"
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              disabled={isStreaming}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoFile">Upload MP4 Video</Label>
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                id="videoFile"
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                disabled={isStreaming}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isStreaming}
                className="w-full h-12"
              >
                <Upload className="mr-2 h-4 w-4" />
                {videoFile ? videoFile.name : 'Choose MP4 File'}
              </Button>
              {videoFile && (
                <p className="text-sm text-muted-foreground">
                  File size: {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="loopVideo"
              checked={loopVideo}
              onCheckedChange={(checked) => setLoopVideo(checked as boolean)}
              disabled={isStreaming}
            />
            <Label htmlFor="loopVideo" className="text-sm font-medium">
              Loop Video
            </Label>
          </div>

          <Button
            type="submit"
            variant="stream"
            size="lg"
            className="w-full h-12"
            disabled={isStreaming || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Stream...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Live Stream
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};