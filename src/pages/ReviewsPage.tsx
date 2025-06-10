import React, { useState } from 'react';
import { Star, Quote, Search, Filter, X } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  image: string;
  date: string;
  verified: boolean;
  deliveryId?: string;
}

const ReviewsPage: React.FC = () => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock reviews data - in a real app, this would come from an API
  const reviews: Review[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      role: 'Business Owner',
      rating: 5,
      comment: 'KARTER has transformed my business logistics. Their instant delivery service is incredibly reliable, and the real-time tracking gives me peace of mind. My customers are delighted with the quick delivery times!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
      date: '2024-03-15',
      verified: true,
      deliveryId: 'KTR123456'
    },
    {
      id: '2',
      name: 'Priya Patel',
      role: 'Regular Customer',
      rating: 5,
      comment: 'The best delivery service I\'ve used! Their two-wheeler delivery option is perfect for quick document deliveries. The drivers are professional, and the app is super easy to use.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
      date: '2024-03-14',
      verified: true,
      deliveryId: 'KTR123457'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      role: 'E-commerce Seller',
      rating: 4,
      comment: 'KARTER has helped me scale my online business with their reliable same-day delivery service. The custom bidding feature helps me get competitive rates for bulk orders.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
      date: '2024-03-13',
      verified: true,
      deliveryId: 'KTR123458'
    }
  ];

  const renderStars = (rating: number, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-6 w-6 ${
          index < rating 
            ? 'text-primary fill-primary' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer' : ''}`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission
    console.log({ rating, comment });
    setShowAddReview(false);
    setRating(0);
    setComment('');
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'verified' && review.verified) ||
                         (filter === String(review.rating));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">Customer Reviews</h1>
          <div className="flex items-center justify-center mb-2">
            {renderStars(5)}
            <span className="ml-2 text-3xl font-bold text-secondary">4.8</span>
            <span className="ml-1 text-xl text-gray-600">/5</span>
          </div>
          <p className="text-gray-600 text-lg">Based on 1,248 verified reviews</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <div className="flex gap-4 items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="all">All Reviews</option>
              <option value="verified">Verified Only</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <Button
              variant="secondary"
              onClick={() => setShowAddReview(true)}
            >
              Write a Review
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="h-full flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <div className="flex items-center">
                    <h4 className="font-semibold text-secondary">{review.name}</h4>
                    {review.verified && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {renderStars(review.rating)}
              </div>

              <div className="relative flex-grow">
                <Quote className="absolute top-0 left-0 h-8 w-8 text-primary/20 -translate-x-2 -translate-y-2" />
                <p className="text-gray-600 italic pl-4">{review.comment}</p>
              </div>

              {review.deliveryId && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Delivery ID: {review.deliveryId}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Posted on {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary">Write a Review</h2>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {renderStars(rating, true)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Share your experience..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="secondary"
                    fullWidth
                  >
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => setShowAddReview(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;