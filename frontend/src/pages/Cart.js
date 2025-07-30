import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotal, 
    calculateOrderTotals,
    createOrder,
    isLoading 
  } = useCart();
  const { toast } = useToast();
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    orderType: 'pickup'
  });
  const [orderSuccess, setOrderSuccess] = useState(null);

  const { subtotal, tax } = calculateOrderTotals();
  const deliveryFee = orderForm.orderType === 'delivery' ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      toast({
        title: "Item removed",
        description: "Item removed from your cart.",
      });
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId);
    toast({
      title: "Item removed",
      description: `${itemName} removed from your cart.`,
    });
  };

  const handleCheckout = async () => {
    if (!orderForm.name || !orderForm.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and phone number.",
        variant: "destructive"
      });
      return;
    }

    if (orderForm.orderType === 'delivery' && !orderForm.address) {
      toast({
        title: "Missing address",
        description: "Please provide a delivery address.",
        variant: "destructive"
      });
      return;
    }

    try {
      const order = await createOrder(orderForm, orderForm.orderType);
      setOrderSuccess(order);
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id} has been received. We'll contact you shortly.`,
      });
      
      // Reset form
      setOrderForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        orderType: 'pickup'
      });
    } catch (error) {
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2 text-left">
              <p><strong>Order ID:</strong> {orderSuccess.id}</p>
              <p><strong>Total:</strong> ${orderSuccess.total.toFixed(2)}</p>
              <p><strong>Order Type:</strong> {orderSuccess.order_type}</p>
              <p><strong>Status:</strong> {orderSuccess.status}</p>
            </div>
          </div>
          <div className="space-y-4">
            <Link to="/menu">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Order More Items
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setOrderSuccess(null)}
              className="ml-4"
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-lg text-gray-600 mb-8">
            Start by adding some delicious items from our menu!
          </p>
          <Link to="/menu">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-red-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={orderForm.orderType === 'pickup' ? 'default' : 'outline'}
                      onClick={() => setOrderForm({...orderForm, orderType: 'pickup'})}
                      className="flex-1"
                    >
                      Pickup
                    </Button>
                    <Button
                      variant={orderForm.orderType === 'delivery' ? 'default' : 'outline'}
                      onClick={() => setOrderForm({...orderForm, orderType: 'delivery'})}
                      className="flex-1"
                    >
                      Delivery
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={orderForm.name}
                    onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>

                {orderForm.orderType === 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                      placeholder="1234 Main St, Anaheim, CA 92805"
                    />
                  </div>
                )}

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  * This is a demo using file-based storage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;