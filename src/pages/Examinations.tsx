import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, BookOpen, Plus, FileText } from 'lucide-react';

const examsData = [
  {
    id: 1,
    subject: 'Advanced Java Programming',
    code: 'MCA401',
    date: 'January 15, 2025',
    time: '10:00 AM - 1:00 PM',
    venue: 'Exam Hall A, Block 1',
    type: 'Theory',
    duration: '3 Hours',
    status: 'upcoming',
  },
  {
    id: 2,
    subject: 'Machine Learning',
    code: 'MCA402',
    date: 'January 17, 2025',
    time: '10:00 AM - 1:00 PM',
    venue: 'Exam Hall B, Block 1',
    type: 'Theory',
    duration: '3 Hours',
    status: 'upcoming',
  },
  {
    id: 3,
    subject: 'Cloud Computing',
    code: 'MCA403',
    date: 'January 20, 2025',
    time: '10:00 AM - 1:00 PM',
    venue: 'Exam Hall A, Block 1',
    type: 'Theory',
    duration: '3 Hours',
    status: 'upcoming',
  },
  {
    id: 4,
    subject: 'Lab: Java & ML',
    code: 'MCA406',
    date: 'January 25, 2025',
    time: '2:00 PM - 5:00 PM',
    venue: 'Computer Lab 3, Block 2',
    type: 'Practical',
    duration: '3 Hours',
    status: 'upcoming',
  },
];

const Examinations: React.FC = () => {
  const { user } = useAuth();
  const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'student' ? 'Exam Schedule' : 'Examination Management'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'student'
              ? 'View your upcoming examinations and schedule'
              : 'Schedule and manage examinations'}
          </p>
        </div>
        {isAdminOrTeacher && (
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Exam
          </Button>
        )}
      </div>

      {/* Exam Info Banner */}
      <Card variant="elevated" className="gradient-hero text-primary-foreground overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">MCA Semester 4 Examinations</h2>
              <p className="text-primary-foreground/80">January 2025 Session</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">4</p>
                <p className="text-sm text-primary-foreground/70">Exams</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-primary-foreground/70">Days Left</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam List */}
      <div className="space-y-4">
        {examsData.map((exam, index) => (
          <Card
            key={exam.id}
            variant="elevated"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Subject Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${exam.type === 'Practical' ? 'bg-success/10' : 'gradient-primary'}`}>
                    {exam.type === 'Practical' ? (
                      <FileText className="h-6 w-6 text-success" />
                    ) : (
                      <BookOpen className="h-6 w-6 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold">{exam.subject}</h3>
                      <Badge variant="outline">{exam.code}</Badge>
                      <Badge variant={exam.type === 'Practical' ? 'success' : 'secondary'}>
                        {exam.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Duration: {exam.duration}</p>
                  </div>
                </div>

                {/* Date, Time, Venue */}
                <div className="grid sm:grid-cols-3 gap-4 lg:w-auto">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{exam.venue}</span>
                  </div>
                </div>

                {/* Status */}
                <Badge variant="warning" className="lg:ml-4">
                  Upcoming
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Exam Instructions</CardTitle>
          <CardDescription>Important guidelines for examinations</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Arrive at the examination hall at least 30 minutes before the exam starts.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Carry your hall ticket and college ID card. Entry without these will not be permitted.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Mobile phones and electronic devices are strictly prohibited inside the exam hall.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Use only blue or black ink pens for writing answers.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>For practical exams, ensure you have the required software access credentials.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Examinations;
