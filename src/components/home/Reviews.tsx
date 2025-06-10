// Reviews section displaying customer testimonials
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, ArrowRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

/**
 * Reviews - Customer reviews and ratings component
 * Features:
 * - Overall rating display
 * - Review statistics
 * - Call-to-action for leaving reviews
 */
const Reviews: React.FC = () => {
  // Helper function to render star rating
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-primary fill-primary' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">Customer Reviews</h2>
          <div className="flex items-center justify-center mt-4 mb-2">
            {renderStars(5)}
            <span className="ml-2 text-xl font-bold text-secondary">4.8</span>
            <span className="ml-1 text-gray-600">/5</span>
          </div>
          <p className="text-gray-600">Based on 1,248 verified reviews</p>
        </div>

        <Card className="max-w-3xl mx-auto hover:shadow-lg transition-shadow duration-300">
          <Link to="/reviews" className="block p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-secondary">Customer Reviews</h3>
                <p className="text-gray-600 mt-1">See what our customers are saying about us</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-full">
                <MessageCircle className="h-8 w-8 text-secondary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {renderStars(5)}
                  <span className="ml-2 text-xl font-bold text-secondary">4.8</span>
                </div>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xl font-bold text-secondary mb-2">1,248+</p>
                <p className="text-gray-600">Verified Reviews</p>
              </div>
            </div>
          
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Read reviews or share your experience</p>
              <div className="flex items-center text-primary hover:text-primary-dark">
                <span className="font-medium">View All Reviews</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </Link>
        </Card>
      </div>
    </section>
  );
};

export default Reviews;