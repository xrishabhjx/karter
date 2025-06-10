// Testimonials section displaying user feedback
import React from 'react';
import { Star } from 'lucide-react';
import Card from '../common/Card';

/**
 * Props interface for individual testimonial items
 * @property {string} name - Customer name
 * @property {string} role - Customer role or type
 * @property {string} content - Testimonial content
 * @property {number} rating - Star rating
 * @property {string} image - Customer image URL
 */
interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

/**
 * Testimonial - Individual testimonial card component
 * Displays a single customer review with rating and image
 */
const Testimonial: React.FC<TestimonialProps> = ({ name, role, content, rating, image }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-secondary">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-primary fill-primary' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      <p className="text-gray-600 italic flex-grow">{content}</p>
    </Card>
  );
};

/**
 * Testimonials - Main testimonials section component
 * Features:
 * - Grid layout of testimonials
 * - Star ratings
 * - Customer images
 * - Responsive design
 */
const Testimonials: React.FC = () => {
  // Testimonial data (in production, this would come from an API)
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Business Owner',
      content: 'KARTER has transformed how I handle deliveries for my small business. The platform is intuitive, and the delivery partners are professional and punctual. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Priya Patel',
      role: 'Regular User',
      content: 'I use KARTER at least twice a week for various deliveries. The real-time tracking feature gives me peace of mind, and the pricing is very competitive compared to other services.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Amit Kumar',
      role: 'Delivery Partner',
      content: 'Joining KARTER as a delivery partner has been a great experience. The app is easy to use, payments are prompt, and the support team is always helpful when needed.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  return (
    <section className="py-16 bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">What Our Users Say</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our customers and partners have to say about KARTER.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              rating={testimonial.rating}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;