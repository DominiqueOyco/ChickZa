import React from 'react';
import { Clock, MapPin, Phone, Mail, Star, Award, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { restaurantInfo } from '../mock';

const About = () => {
  const stats = [
    { icon: Star, label: 'Years Serving', value: '4+' },
    { icon: Users, label: 'Happy Customers', value: '10K+' },
    { icon: Award, label: 'Average Rating', value: '4.8/5' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                Chickza
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {restaurantInfo.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {restaurantInfo.about}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <stat.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Us Special</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
                  <p className="text-gray-600">
                    We use only the finest ingredients, from farm-fresh vegetables to premium meats, ensuring every bite meets our high standards.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fresh Daily</h3>
                  <p className="text-gray-600">
                    Our pizza dough is made fresh every morning, and our chicken is hand-breaded throughout the day for maximum freshness.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Focused</h3>
                  <p className="text-gray-600">
                    We're proud to be part of the Anaheim community, supporting local suppliers and creating jobs for our neighbors.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visit Us</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Location & Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">{restaurantInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{restaurantInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{restaurantInfo.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Monday - Friday</p>
                      <p className="text-gray-600">{restaurantInfo.hours.weekdays}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Saturday - Sunday</p>
                      <p className="text-gray-600">{restaurantInfo.hours.weekends}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Kitchen closes 30 minutes before closing time. 
                    Last orders for delivery are taken 45 minutes before closing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;