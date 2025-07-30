import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import { menuAPI } from '../services/api';

const Menu = () => {
  const [quantities, setQuantities] = useState({});
  const [menuItems, setMenuItems] = useState({ pizza: [], chicken: [] });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const menuData = await menuAPI.getAllMenu();
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching menu:', error);
        toast({
          title: "Error loading menu",
          description: "Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [toast]);

  const updateQuantity = (itemId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 1) + delta)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    addToCart(item, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${item.name} added to your cart.`,
    });
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const renderMenuItem = (item) => (
    <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.popular && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white">
            Popular
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">{item.name}</CardTitle>
        <p className="text-gray-600 text-sm">{item.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-red-600">${item.price}</span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateQuantity(item.id, -1)}
              disabled={(quantities[item.id] || 1) <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">
              {quantities[item.id] || 1}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateQuantity(item.id, 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={() => handleAddToCart(item)}
        >
          Add to Cart - ${((quantities[item.id] || 1) * item.price).toFixed(2)}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Menu</h1>
            <div className="animate-pulse text-lg text-gray-600">Loading delicious items...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fresh ingredients, bold flavors, and unbeatable combinations. Choose from our signature pizzas and crispy chicken specialties.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all" className="text-sm font-medium">All Items</TabsTrigger>
            <TabsTrigger value="pizza" className="text-sm font-medium">Pizza</TabsTrigger>
            <TabsTrigger value="chicken" className="text-sm font-medium">Fried Chicken</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                    Signature Pizzas
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {menuItems.pizza.map(renderMenuItem)}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                    Crispy Fried Chicken
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {menuItems.chicken.map(renderMenuItem)}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pizza">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.pizza.map(renderMenuItem)}
            </div>
          </TabsContent>

          <TabsContent value="chicken">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.chicken.map(renderMenuItem)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Menu;