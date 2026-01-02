import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubjects } from '@/hooks/useSubjects';
import { useCourses } from '@/hooks/useCourses';
import { useExaminations } from '@/hooks/useExaminations';
import { useStudentMarks } from '@/hooks/useMarks';
import { useAllEnrollments } from '@/hooks/useEnrollments';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useUpsertMarks, useExaminationMarks } from '@/hooks/useMarks';

const MarksEntry: React.FC = () => {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [marksData, setMarksData] = useState<Record<string, number>>({});

  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: allSubjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: allExaminations = [], isLoading: examsLoading } = useExaminations();
  const { data: allEnrollments = [], isLoading: enrollmentsLoading } = useAllEnrollments();
  const { data: studentMarks = [] } = useStudentMarks(user?.id);
  const { data: examMarks = [], isLoading: examMarksLoading } = useExaminationMarks(selectedExamId || undefined);
  const upsertMarks = useUpsertMarks();

  // Filter subjects by selected course
  const filteredSubjects = useMemo(() => {
    if (!selectedCourseId) return allSubjects;
    return allSubjects.filter(s => s.course_id === selectedCourseId);
  }, [allSubjects, selectedCourseId]);

  // Filter exams by selected subject
  const filteredExams = useMemo(() => {
    if (!selectedSubjectId) return [];
    return allExaminations.filter(e => e.subject_id === selectedSubjectId);
  }, [allExaminations, selectedSubjectId]);

  // Get enrolled students for selected course
  const enrolledStudentIds = useMemo(() => {
    if (!selectedCourseId) return [];
    return allEnrollments
      .filter(e => e.course_id === selectedCourseId)
      .map(e => e.student_id);
  }, [allEnrollments, selectedCourseId]);

  // Fetch profiles for enrolled students
  const { data: enrolledStudents = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['enrolled-students', enrolledStudentIds],
    queryFn: async () => {
      if (enrolledStudentIds.length === 0) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', enrolledStudentIds);
      if (error) throw error;
      return data || [];
    },
    enabled: enrolledStudentIds.length > 0,
  });

  // Get selected exam details
  const selectedExam = useMemo(() => {
    return allExaminations.find(e => e.id === selectedExamId);
  }, [allExaminations, selectedExamId]);

  // Initialize marks data from existing marks
  React.useEffect(() => {
    if (examMarks.length > 0) {
      const existingMarks: Record<string, number> = {};
      examMarks.forEach(m => {
        if (m.marks_obtained !== null) {
          existingMarks[m.student_id] = Number(m.marks_obtained);
        }
      });
      setMarksData(existingMarks);
    }
  }, [examMarks]);

  const handleMarkChange = (studentId: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    const maxMarks = selectedExam?.max_marks || 100;
    const clampedValue = Math.min(Math.max(0, numValue), maxMarks);
    setMarksData(prev => ({ ...prev, [studentId]: clampedValue }));
  };

  const handleSaveMarks = async () => {
    if (!selectedExamId) {
      toast({ title: 'Error', description: 'Please select an examination', variant: 'destructive' });
      return;
    }

    const marksToSave = enrolledStudents.map(student => ({
      examination_id: selectedExamId,
      student_id: student.user_id,
      marks_obtained: marksData[student.user_id] ?? null,
      entered_by: user?.id,
    }));

    upsertMarks.mutate(marksToSave);
  };

  // Student view - show their marks
  if (isStudent) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Marks</h1>
          <p className="text-muted-foreground">View your subject-wise marks</p>
        </div>

        {studentMarks.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No marks available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {studentMarks.map((mark, index) => (
              <Card key={mark.id} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{mark.subject_name || 'Unknown Subject'}</h3>
                        {mark.subject_code && <Badge variant="outline">{mark.subject_code}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{mark.exam_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{mark.marks_obtained ?? '-'}</p>
                      <p className="text-sm text-muted-foreground">/ {mark.max_marks || 100}</p>
                    </div>
                  </div>
                  {mark.grade && (
                    <div className="pt-4 border-t">
                      <Badge variant={mark.verified ? 'success' : 'secondary'}>
                        {mark.verified ? 'Verified' : 'Pending Verification'}
                      </Badge>
                      {mark.grade && <Badge variant="outline" className="ml-2">Grade: {mark.grade}</Badge>}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Teacher/Admin view - marks entry
  const isLoading = coursesLoading || subjectsLoading || examsLoading || enrollmentsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marks Entry</h1>
          <p className="text-muted-foreground">Enter and manage student marks</p>
        </div>
        <Button 
          variant="gradient" 
          className="gap-2" 
          onClick={handleSaveMarks}
          disabled={!selectedExamId || enrolledStudents.length === 0 || upsertMarks.isPending}
        >
          {upsertMarks.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All
        </Button>
      </div>

      {/* Selection */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Course</label>
              <Select value={selectedCourseId} onValueChange={(v) => { setSelectedCourseId(v); setSelectedSubjectId(''); setSelectedExamId(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={selectedSubjectId} onValueChange={(v) => { setSelectedSubjectId(v); setSelectedExamId(''); }} disabled={!selectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Examination</label>
              <Select value={selectedExamId} onValueChange={setSelectedExamId} disabled={!selectedSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Examination" />
                </SelectTrigger>
                <SelectContent>
                  {filteredExams.map(exam => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name} (Max: {exam.max_marks})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      {selectedExamId && (
        <div className="flex items-center gap-4">
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {examMarks.length > 0 ? 'Has Existing Marks' : 'No Marks Entered'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Enrolled Students: {enrolledStudents.length}
          </span>
        </div>
      )}

      {/* Marks Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Student Marks {selectedExam && `- ${selectedExam.name}`}
          </CardTitle>
          <CardDescription>
            {selectedExam 
              ? `Enter marks for each student (Max: ${selectedExam.max_marks})`
              : 'Select course, subject, and examination to enter marks'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || studentsLoading || examMarksLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !selectedCourseId ? (
            <div className="text-center py-12 text-muted-foreground">
              Please select a course to view enrolled students
            </div>
          ) : enrolledStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No students enrolled in this course
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Marks {selectedExam && `(${selectedExam.max_marks})`}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((student, index) => (
                    <tr key={student.user_id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm">
                            {student.full_name?.charAt(0) || 'S'}
                          </div>
                          {student.full_name || 'Unknown'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                      <td className="py-3 px-4">
                        <Input
                          type="number"
                          value={marksData[student.user_id] ?? ''}
                          onChange={(e) => handleMarkChange(student.user_id, e.target.value)}
                          className="w-24 mx-auto text-center"
                          max={selectedExam?.max_marks || 100}
                          min={0}
                          disabled={!selectedExamId}
                          placeholder="-"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={() => setMarksData({})}>Clear All</Button>
        <Button 
          variant="gradient" 
          className="gap-2" 
          onClick={handleSaveMarks}
          disabled={!selectedExamId || enrolledStudents.length === 0 || upsertMarks.isPending}
        >
          {upsertMarks.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Save Marks
        </Button>
      </div>
    </div>
  );
};

export default MarksEntry;
