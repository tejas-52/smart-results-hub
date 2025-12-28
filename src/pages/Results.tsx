import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Download,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';

const semesterResults = [
  {
    semester: 'Semester 3',
    sgpa: 8.7,
    cgpa: 8.5,
    credits: 24,
    status: 'published',
    subjects: [
      { name: 'Database Management System', code: 'MCA301', marks: 85, grade: 'A', credits: 4 },
      { name: 'Computer Networks', code: 'MCA302', marks: 78, grade: 'B+', credits: 4 },
      { name: 'Software Engineering', code: 'MCA303', marks: 82, grade: 'A', credits: 4 },
      { name: 'Web Technologies', code: 'MCA304', marks: 90, grade: 'A+', credits: 4 },
      { name: 'Operating Systems', code: 'MCA305', marks: 75, grade: 'B+', credits: 4 },
      { name: 'Lab: DBMS & Web Tech', code: 'MCA306', marks: 88, grade: 'A', credits: 4 },
    ],
  },
  {
    semester: 'Semester 2',
    sgpa: 8.4,
    cgpa: 8.3,
    credits: 24,
    status: 'published',
    subjects: [
      { name: 'Data Structures', code: 'MCA201', marks: 82, grade: 'A', credits: 4 },
      { name: 'Object Oriented Programming', code: 'MCA202', marks: 85, grade: 'A', credits: 4 },
      { name: 'Discrete Mathematics', code: 'MCA203', marks: 78, grade: 'B+', credits: 4 },
      { name: 'Computer Organization', code: 'MCA204', marks: 80, grade: 'A', credits: 4 },
      { name: 'Technical Communication', code: 'MCA205', marks: 88, grade: 'A', credits: 4 },
      { name: 'Lab: DS & OOP', code: 'MCA206', marks: 86, grade: 'A', credits: 4 },
    ],
  },
];

const Results: React.FC = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-success text-success-foreground';
      case 'A':
        return 'bg-primary text-primary-foreground';
      case 'B+':
        return 'bg-warning text-warning-foreground';
      case 'B':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isStudent ? 'My Results' : 'Result Management'}
          </h1>
          <p className="text-muted-foreground">
            {isStudent
              ? 'View your academic performance and download marksheets'
              : 'Manage and publish student results'}
          </p>
        </div>
        {isStudent && (
          <Button variant="gradient" className="gap-2">
            <Download className="h-4 w-4" />
            Download All Marksheets
          </Button>
        )}
      </div>

      {/* CGPA Overview */}
      {isStudent && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" className="animate-slide-up">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl gradient-primary">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current CGPA</p>
                  <p className="text-3xl font-bold">8.5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-3xl font-bold">72</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <BookOpen className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Semesters</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Backlogs</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Semester Results */}
      <div className="space-y-6">
        {semesterResults.map((result, index) => (
          <Card key={result.semester} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg gradient-primary">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {result.semester}
                      <Badge variant="success" className="ml-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      SGPA: {result.sgpa} | CGPA: {result.cgpa} | Credits: {result.credits}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject Code</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject Name</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Credits</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Marks</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects.map((subject) => (
                      <tr key={subject.code} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{subject.code}</td>
                        <td className="py-3 px-4">{subject.name}</td>
                        <td className="py-3 px-4 text-center">{subject.credits}</td>
                        <td className="py-3 px-4 text-center font-semibold">{subject.marks}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.grade)}`}>
                              {subject.grade}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Results */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Pending Results
          </CardTitle>
          <CardDescription>Results awaiting publication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Semester 4</p>
                <p className="text-sm text-muted-foreground">Expected: January 2025</p>
              </div>
            </div>
            <Badge variant="warning">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
