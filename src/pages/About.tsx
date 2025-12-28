import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Award, BookOpen, Target, Eye, Heart } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Students', value: '5,000+' },
    { icon: GraduationCap, label: 'Faculty', value: '200+' },
    { icon: BookOpen, label: 'Programs', value: '25+' },
    { icon: Award, label: 'Years of Excellence', value: '50+' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="gradient-hero rounded-2xl p-8 lg:p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex p-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm mb-6">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Savitribai Phule Pune University
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-6">
            One of the premier universities in India, established in 1949, with a legacy of academic 
            excellence and innovation in higher education.
          </p>
          <p className="text-primary-foreground/70">
            The Student Result Management System (SRMS) is designed to streamline academic 
            management, providing a seamless experience for students, faculty, and administrators.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} variant="elevated" className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="pt-6">
              <div className="inline-flex p-3 rounded-xl gradient-primary mb-3">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vision, Mission, Values */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card variant="elevated" className="animate-slide-up">
          <CardHeader>
            <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be a globally recognized institution of excellence in higher education, 
              research, and innovation, nurturing ethical and socially responsible citizens.
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <div className="p-3 rounded-xl bg-success/10 w-fit mb-2">
              <Target className="h-6 w-6 text-success" />
            </div>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide quality education through innovative teaching-learning processes, 
              promote research and development, and create an inclusive academic environment.
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <div className="p-3 rounded-xl bg-warning/10 w-fit mb-2">
              <Heart className="h-6 w-6 text-warning" />
            </div>
            <CardTitle>Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Excellence, Integrity, Innovation, Inclusivity, Social Responsibility, 
              and commitment to holistic development of students.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* About SRMS */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>About SRMS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Student Result Management System (SRMS) is a comprehensive digital platform 
            designed to modernize and streamline academic administration at Savitribai Phule Pune University.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Key Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  Role-based access for Admin, Teachers, and Students
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  Comprehensive course and subject management
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  Digital examination scheduling and management
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  Automated grade calculation and result generation
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Benefits</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-success mt-2" />
                  Reduced paperwork and administrative overhead
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-success mt-2" />
                  Real-time access to academic information
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-success mt-2" />
                  Secure and reliable data management
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-success mt-2" />
                  Enhanced communication between stakeholders
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
