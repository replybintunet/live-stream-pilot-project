import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Video, ArrowLeft } from 'lucide-react';

interface SuccessScreenProps {
  onBack: () => void;
}

export const SuccessScreen = ({ onBack }: SuccessScreenProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-card/95 backdrop-blur">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Video className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold text-success">
            BintuBot Stream Live!
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-lg font-medium">✅ Your BintuBot stream is live!</p>
          <p className="text-muted-foreground">
            Your video is now streaming to YouTube with BintuBot. The stream will continue running even if you close this app.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span className="font-medium">BintuBot YouTube Stream</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Go to YouTube Studio to monitor your BintuBot stream
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