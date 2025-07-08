import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Youtube, ArrowLeft } from 'lucide-react';

interface SuccessScreenProps {
  onBack: () => void;
}

export const SuccessScreen = ({ onBack }: SuccessScreenProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-success animate-pulse" />
        </div>
        <CardTitle className="text-2xl text-success">Stream Started!</CardTitle>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-lg font-medium">✅ Your live stream has started</p>
          <p className="text-muted-foreground">
            Your video is now streaming to YouTube Live. The stream will continue running even if you close this app.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Youtube className="h-5 w-5 text-primary" />
            <span className="font-medium">YouTube Live Stream</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Go to YouTube Studio to monitor your stream
          </p>
        </div>

        <Button 
          onClick={onBack}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Start Another Stream
        </Button>
      </CardContent>
    </Card>
  );
};