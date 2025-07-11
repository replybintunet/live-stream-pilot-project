import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Video, Check, Key, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Payments = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      features: [
        'HD Streaming (720p)',
        '5 hours streaming/month',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      features: [
        'Full HD Streaming (1080p)',
        'Unlimited streaming',
        'Advanced analytics',
        'Priority support',
        'Stream scheduling',
        'Custom thumbnails'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49.99',
      period: '/month',
      features: [
        '4K Streaming',
        'Unlimited streaming',
        'White-label solution',
        '24/7 dedicated support',
        'API access',
        'Custom integrations',
        'Multi-user accounts'
      ]
    }
  ];

  const handleAccessCode = () => {
    if (accessCode === 'bintunet') {
      localStorage.setItem('bintubot-access', 'verified');
      toast({
        title: "Access Granted!",
        description: "Welcome to BintuBot streaming platform.",
      });
      navigate('/');
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Access Code",
        description: "Please enter the correct access code.",
      });
    }
  };

  const handlePayment = (method: string, planId: string) => {
    localStorage.setItem('bintubot-access', 'verified');
    toast({
      title: "Payment Successful!",
      description: `${method} payment for ${planId} plan completed. Welcome to BintuBot!`,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get Started with BintuBot</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a plan to host live streams and get monetized, or enter your access code.
          </p>
        </div>

        {/* Access Code Section */}
        <Card className="max-w-md mx-auto mb-12">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Key className="h-5 w-5" />
              Access Code
            </CardTitle>
            <CardDescription>
              Enter your access code to start streaming
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Access Code</Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
            <Button onClick={handleAccessCode} className="w-full">
              Verify Access Code
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2">Or Choose a Plan</h3>
          <p className="text-muted-foreground">
            Subscribe to unlock premium features and monetization
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>Perfect for your streaming needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    Select {plan.name}
                  </Button>
                  
                  {selectedPlan === plan.id && (
                    <div className="space-y-2 pt-4 border-t">
                      <p className="text-sm text-center text-muted-foreground mb-3">
                        Choose your payment method:
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePayment('Credit Card', plan.name)}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePayment('PayPal', plan.name)}
                      >
                        <div className="h-4 w-4 mr-2 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">P</span>
                        </div>
                        PayPal
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePayment('M-Pesa', plan.name)}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        M-Pesa
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>🔒 Secure payments</span>
            <span>📧 Email support</span>
            <span>💳 No hidden fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;