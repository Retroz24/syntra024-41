
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import SimpleAuth from '@/components/auth/SimpleAuth';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/codehub');
    }
  }, [user, isLoading, navigate]);

  const handleAuthSuccess = () => {
    navigate('/codehub');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && showAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SimpleAuth onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Hero onSignIn={() => setShowAuth(true)} />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Newsletter />
        <Footer />
      </div>
    );
  }

  return null;
};

export default Index;
