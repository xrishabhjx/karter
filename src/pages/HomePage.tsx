import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import VehicleTypes from '../components/home/VehicleTypes';
import PickupPointsSection from '../components/home/PickupPointsSection';
import Reviews from '../components/home/Reviews'; 

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <VehicleTypes />
      <PickupPointsSection />
      <Reviews />
    </div>
  );
};

export default HomePage;