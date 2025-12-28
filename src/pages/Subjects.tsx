import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, User, Clock, Plus } from 'lucide-react';

const subjectsData = [
  {
    id: 1,
    code: 'MCA401',
    name: 'Advanced Java Programming',
    course: 'MCA',
    semester: 4,
    credits: 4,
    teacher: 'Prof. Priya Sharma',
    type: 'Theory',
  },
  {
    id: 2,
    code: 'MCA402',
    name: 'Machine Learning',
    course: 'MCA',
    semester: 4,
    credits: 4,
    teacher: 'Dr. Amit Patil',
    type: 'Theory',
  },
  {
    id: 3,
    code: 'MCA403',
    name: 'Cloud Computing',
    course: 'MCA',
    semester: 4,
    credits: 4,
    teacher: 'Prof. Sneha Deshmukh',
    type: 'Theory',
  },
  {
    id: 4,
    code: 'MCA404',
    name: 'Mobile Application Development',
    course: 'MCA',
    semester: 4,
    credits: 4,
    teacher: 'Dr. Rajesh Kumar',
    type: 'Theory',
  },
  {
    id: 5,
    code: 'MCA405',
    name: 'Information Security',
    course: 'MCA',
    semester: 4,
    credits: 4,
    teacher: 'Prof. Priya Sharma',
    type: 'Theory',
  },
  {
    id: 6,
    code: 'MCA406',
    name: 'Lab: Java & ML',
    course: 'MCA',
    semester: 4,
    credits: 4,
    teacher: 'Dr. Amit Patil',
    type: 'Practical',
  },
];

const Subjects: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'student' ? 'My Subjects' : 'Subject Management'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'student'
              ? 'View your enrolled subjects and syllabus'
              : 'Manage academic subjects and assignments'}
          </p>
        </div>
        {isAdmin && (
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        )}
      </div>

      {/* Semester Info */}
      {user?.role === 'student' && (
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="default" className="text-base px-4 py-1">
                MCA - Semester 4
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>6 Subjects</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>24 Credits</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectsData.map((subject, index) => (
          <Card
            key={subject.id}
            variant="interactive"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {subject.code}
                  </Badge>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </div>
                <div className={`p-2 rounded-lg ${subject.type === 'Practical' ? 'bg-success/10' : 'bg-primary/10'}`}>
                  <FileText className={`h-5 w-5 ${subject.type === 'Practical' ? 'text-success' : 'text-primary'}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <Badge variant={subject.type === 'Practical' ? 'success' : 'secondary'}>
                  {subject.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Credits</span>
                <span className="font-medium">{subject.credits}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{subject.teacher}</p>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
