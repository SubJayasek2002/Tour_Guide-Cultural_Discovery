import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Building,
  Shield,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

// PayHere configuration
// Get your Merchant ID from PayHere Dashboard: https://sandbox.payhere.lk (for testing)
// Or from: https://www.payhere.lk (for production)
const PAYHERE_MERCHANT_ID = '1233905'; // Your Merchant ID
const PAYHERE_SANDBOX = true; // Set to false for production

// PayHere type interface
interface PayHereInstance {
  startPayment: (payment: PayHerePayment) => void;
  onCompleted: (orderId: string) => void;
  onDismissed: () => void;
  onError: (error: string) => void;
}

// Get PayHere instance from window
const getPayHere = (): PayHereInstance | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).payhere as PayHereInstance | undefined;
};

interface PayHerePayment {
  sandbox: boolean;
  merchant_id: string;
  return_url: string | undefined;
  cancel_url: string | undefined;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  hash: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  custom_1?: string;
  custom_2?: string;
}

interface PaymentState {
  hotelId: string;
  hotelName: string;
  amount: number;
  userEmail?: string;
  userName?: string;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'dismissed'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const paymentState = location.state as PaymentState | null;

  useEffect(() => {
    // Load PayHere script
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      setScriptLoaded(true);
      // Set up PayHere event handlers
      const payhere = getPayHere();
      if (payhere) {
        payhere.onCompleted = async (orderId: string) => {
          console.log('Payment completed. OrderID:', orderId);
          setPaymentStatus('success');
          toast.success('Payment completed successfully!');
          if (paymentState?.hotelId) {
            await setHotelPaid(paymentState.hotelId);
          }
        };

        payhere.onDismissed = () => {
          console.log('Payment dismissed');
          setPaymentStatus('dismissed');
          toast.info('Payment was cancelled');
        };

        payhere.onError = (error: string) => {
          console.error('Payment error:', error);
          setPaymentStatus('failed');
          toast.error('Payment failed: ' + error);
        };
      }
    };

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.remove();
      }
    };
  }, []);

  // Redirect if no payment state
  useEffect(() => {
    if (!paymentState) {
      toast.error('No payment information found');
      navigate('/hotels/register');
    }
  }, [paymentState, navigate]);

  // Generate hash - calls backend API for security
  const generateHash = async (orderId: string, amount: string): Promise<string> => {
    try {
      console.log('Generating hash for order:', orderId, 'amount:', amount);
      
      const response = await fetch('http://localhost:8081/api/payments/generate-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId, 
          amount,
          currency: 'LKR'
        }),
      });

      console.log('Hash generation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Hash generation error response:', errorData);
        throw new Error(`HTTP ${response.status}: Failed to generate payment hash. Backend may not be running.`);
      }

      const data = await response.json();
      console.log('Hash generated successfully:', data.hash);
      return data.hash;
    } catch (error) {
      console.error('Hash generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Payment initialization failed: ' + errorMsg);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!paymentState || !scriptLoaded) return;
    
    setIsLoading(true);
    
    try {
      const orderId = `HOTEL_${paymentState.hotelId}_${Date.now()}`;
      const amount = paymentState.amount.toFixed(2);
      
      // Generate hash from server (in production)
      const hash = await generateHash(orderId, amount);
      
      const payment: PayHerePayment = {
        sandbox: PAYHERE_SANDBOX,
        merchant_id: PAYHERE_MERCHANT_ID,
        return_url: undefined,
        cancel_url: undefined,
        notify_url: 'http://localhost:8081/api/payments/notify', // Your backend notify URL
        order_id: orderId,
        items: `Hotel Registration - ${paymentState.hotelName}`,
        amount: amount,
        currency: 'LKR',
        hash: hash,
        first_name: paymentState.userName?.split(' ')[0] || 'Guest',
        last_name: paymentState.userName?.split(' ').slice(1).join(' ') || 'User',
        email: paymentState.userEmail || 'guest@example.com',
        phone: '0710598936', // Should come from user profile
        address: 'No. 1, Galle Road',
        city: 'Colombo',
        country: 'Sri Lanka',
        custom_1: paymentState.hotelId,
        custom_2: 'hotel_registration',
      };

      const payhere = getPayHere();
      if (payhere) {
        payhere.startPayment(payment);
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const setHotelPaid = async (hotelId: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/hotels/${hotelId}/set-paid`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to update hotel payment status');
      }
      console.log('Hotel marked as paid:', hotelId);
    } catch (error) {
      console.error('Error updating hotel payment status:', error);
      toast.error('Could not update hotel payment status.');
    }
  };

  if (!paymentState) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/hotels/register')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Registration
      </Button>

      {paymentStatus === 'pending' && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
            <CardDescription>
              Make a one-time payment to activate your hotel listing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hotel Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Building className="h-5 w-5 text-orange-600" />
                <span className="font-medium">{paymentState.hotelName}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600">Registration Fee</span>
                <span className="text-2xl font-bold text-orange-600">
                  LKR {paymentState.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">What you get:</h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Your hotel will be visible to all users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Appear in location-based search results</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Lifetime listing (no recurring fees)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Direct contact links for customers</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Secure payment powered by PayHere</span>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Initializing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay LKR {paymentState.amount.toLocaleString()}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By proceeding with payment, you agree to our terms and conditions.
            </p>
          </CardContent>
        </Card>
      )}

      {paymentStatus === 'success' && (
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription>
              Your hotel listing is now active and visible to all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-green-800">
                <strong>{paymentState.hotelName}</strong> has been successfully registered.
              </p>
            </div>
            <Button
              onClick={() => navigate('/hotels')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              View All Hotels
            </Button>
          </CardContent>
        </Card>
      )}

      {paymentStatus === 'failed' && (
        <Card className="border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
            <CardDescription>
              There was an issue processing your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Your hotel has been registered but won't be visible until payment is completed.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handlePayment}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/hotels')}
              >
                Go to Hotels Page
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentStatus === 'dismissed' && (
        <Card className="border-amber-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-2xl text-amber-700">Payment Cancelled</CardTitle>
            <CardDescription>
              You cancelled the payment process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Your hotel has been saved but won't be visible until you complete the payment.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handlePayment}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Complete Payment
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/hotels')}
              >
                Pay Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentPage;