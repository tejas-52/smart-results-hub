import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Save, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

const studentsData = [
  { id: 1, rollNo: 'MCA2023001', name: 'Rahul Sharma', internal: 24, assignment: 8, attendance: 9, total: 41 },
  { id: 2, rollNo: 'MCA2023002', name: 'Priya Patil', internal: 28, assignment: 10, attendance: 10, total: 48 },
  { id: 3, rollNo: 'MCA2023003', name: 'Amit Kumar', internal: 22, assignment: 7, attendance: 8, total: 37 },
  { id: 4, rollNo: 'MCA2023004', name: 'Sneha Deshmukh', internal: 26, assignment: 9, attendance: 9, total: 44 },
  { id: 5, rollNo: 'MCA2023005', name: 'Vikram Singh', internal: 20, assignment: 6, attendance: 7, total: 33 },
  { id: 6, rollNo: 'MCA2023006', name: 'Anjali Gupta', internal: 30, assignment: 10, attendance: 10, total: 50 },
];

const MarksEntry: React.FC = () => {
  const { role } = useAuth();
  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';

  if (isStudent) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Marks</h1>
          <p className="text-muted-foreground">View your subject-wise internal marks</p>
        </div>

        <div className="grid gap-4">
          {[
            { subject: 'Advanced Java Programming', code: 'MCA401', internal: 26, assignment: 9, attendance: 9, total: 44, maxMarks: 50 },
            { subject: 'Machine Learning', code: 'MCA402', internal: 24, assignment: 8, attendance: 8, total: 40, maxMarks: 50 },
            { subject: 'Cloud Computing', code: 'MCA403', internal: 28, assignment: 10, attendance: 9, total: 47, maxMarks: 50 },
            { subject: 'Mobile Application Development', code: 'MCA404', internal: 25, assignment: 8, attendance: 9, total: 42, maxMarks: 50 },
          ].map((subject, index) => (
            <Card key={index} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{subject.subject}</h3>
                      <Badge variant="outline">{subject.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Max Marks: {subject.maxMarks}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{subject.total}</p>
                    <p className="text-sm text-muted-foreground">/ {subject.maxMarks}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Internal</p>
                    <p className="font-semibold">{subject.internal}/30</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Assignment</p>
                    <p className="font-semibold">{subject.assignment}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="font-semibold">{subject.attendance}/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marks Entry</h1>
          <p className="text-muted-foreground">Enter and manage student internal marks</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Save className="h-4 w-4" />
          Save All
        </Button>
      </div>

      {/* Subject Selection */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Course</label>
              <select className="w-full h-10 px-3 rounded-lg border bg-background">
                <option>MCA - Semester 4</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <select className="w-full h-10 px-3 rounded-lg border bg-background">
                <option>MCA401 - Advanced Java Programming</option>
                <option>MCA402 - Machine Learning</option>
                <option>MCA403 - Cloud Computing</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Assessment Type</label>
              <select className="w-full h-10 px-3 rounded-lg border bg-background">
                <option>Internal Assessment</option>
                <option>Assignment</option>
                <option>Attendance</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="flex items-center gap-4">
        <Badge variant="warning" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Pending Submission
        </Badge>
        <span className="text-sm text-muted-foreground">Last saved: Not yet saved</span>
      </div>

      {/* Marks Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Student Marks - MCA401
          </CardTitle>
          <CardDescription>Enter marks for each student (Max: Internal-30, Assignment-10, Attendance-10)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Roll No</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student Name</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Internal (30)</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Assignment (10)</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Attendance (10)</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total (50)</th>
                </tr>
              </thead>
              <tbody>
                {studentsData.map((student) => (
                  <tr key={student.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{student.rollNo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm">
                          {student.name.charAt(0)}
                        </div>
                        {student.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        defaultValue={student.internal}
                        className="w-20 mx-auto text-center"
                        max={30}
                        min={0}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        defaultValue={student.assignment}
                        className="w-20 mx-auto text-center"
                        max={10}
                        min={0}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        defaultValue={student.attendance}
                        className="w-20 mx-auto text-center"
                        max={10}
                        min={0}
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-primary">{student.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button variant="default">Save as Draft</Button>
        <Button variant="gradient" className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
};

export default MarksEntry;
