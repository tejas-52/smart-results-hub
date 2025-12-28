import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  Shield,
  BarChart3,
  FileText,
} from 'lucide-react';

const Index: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Separate dashboards for Admin, Teachers, and Students with appropriate permissions.',
    },
    {
      icon: BookOpen,
      title: 'Course Management',
      description: 'Comprehensive course and subject management with easy enrollment tracking.',
    },
    {
      icon: Award,
      title: 'Result Management',
      description: 'Automated grade calculation, result publication, and downloadable marksheets.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Detailed performance analytics and exportable reports in PDF/Excel formats.',
    },
    {
      icon: FileText,
      title: 'Study Materials',
      description: 'Upload and access study materials, notes, and video lectures anytime.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control and data encryption.',
    },
  ];

  const stats = [
    { value: '5,000+', label: 'Students' },
    { value: '200+', label: 'Faculty' },
    { value: '25+', label: 'Programs' },
    { value: '50+', label: 'Years' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground">
              <h1 className="text-xl font-bold">SRMS</h1>
              <p className="text-xs text-primary-foreground/70">Savitribai Phule Pune University</p>
            </div>
          </div>
          <Link to="/auth">
            <Button variant="glass" className="gap-2">
              Login <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32 text-center">
          <div className="animate-float inline-flex p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-8">
            <GraduationCap className="h-16 w-16 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Student Result<br />Management System
          </h1>
          
          <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            A comprehensive digital platform for managing academic records, examination results, 
            and student data for Savitribai Phule Pune University.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/auth">
              <Button variant="hero" size="xl" className="gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="glass" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 container mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm text-center animate-slide-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <p className="text-3xl lg:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage academic records, examinations, and student results in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="interactive"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="p-3 rounded-xl gradient-primary w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Access your academic records, view results, and manage your courses all in one place.
          </p>
          <Link to="/auth">
            <Button variant="hero" size="xl" className="gap-2">
              Login Now <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold">SRMS</p>
                <p className="text-sm text-muted-foreground">Savitribai Phule Pune University</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Student Result Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
