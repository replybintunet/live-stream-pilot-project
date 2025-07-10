import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Video, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Payments = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handlePayment = (method: string, planId: string) => {
    toast({
      title: "Payment Integration Coming Soon",
      description: `${method} payment for ${planId} plan will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              BintuBot Plans
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your streaming needs. Upgrade or downgrade anytime.
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