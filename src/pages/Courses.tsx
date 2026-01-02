import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, Plus, MoreVertical, Calendar } from 'lucide-react';

const coursesData = [
  {
    id: 1,
    name: 'Master of Computer Applications',
    code: 'MCA',
    semester: 'Semester 4',
    duration: '3 Years',
    students: 120,
    subjects: 8,
    status: 'active',
    instructor: 'Dr. Rajesh Kumar',
  },
  {
    id: 2,
    name: 'Bachelor of Computer Science',
    code: 'BCS',
    semester: 'Semester 6',
    duration: '3 Years',
    students: 180,
    subjects: 10,
    status: 'active',
    instructor: 'Prof. Priya Sharma',
  },
  {
    id: 3,
    name: 'Bachelor of Information Technology',
    code: 'BIT',
    semester: 'Semester 4',
    duration: '4 Years',
    students: 150,
    subjects: 9,
    status: 'active',
    instructor: 'Dr. Amit Patil',
  },
  {
    id: 4,
    name: 'Master of Science (IT)',
    code: 'MSC-IT',
    semester: 'Semester 2',
    duration: '2 Years',
    students: 60,
    subjects: 6,
    status: 'active',
    instructor: 'Prof. Sneha Deshmukh',
  },
];

const Courses: React.FC = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {role === 'student' ? 'My Courses' : 'Course Management'}
          </h1>
          <p className="text-muted-foreground">
            {role === 'student'
              ? 'View your enrolled courses and progress'
              : 'Manage academic courses and programs'}
          </p>
        </div>
        {isAdmin && (
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData.map((course, index) => (
          <Card
            key={course.id}
            variant="interactive"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl gradient-primary">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-1">
                      {course.code}
                    </Badge>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                  </div>
                </div>
                {isAdmin && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Semester</span>
                <Badge variant="outline">{course.semester}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">{course.students}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">{course.subjects}</p>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">{course.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground">Course Head</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enrollment Info for Students */}
      {role === 'student' && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Enrollment Information
            </CardTitle>
            <CardDescription>Your academic enrollment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-semibold">MCA</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Current Semester</p>
                <p className="font-semibold">Semester 4</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Enrollment Year</p>
                <p className="font-semibold">2023</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-semibold">MCA2023045</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Courses;
