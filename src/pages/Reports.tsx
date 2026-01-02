import React, { useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, FileText, Users, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useStudentMarks } from '@/hooks/useMarks';
import { useExaminations } from '@/hooks/useExaminations';
import { useSubjects } from '@/hooks/useSubjects';
import { useCourses } from '@/hooks/useCourses';
import { useAllEnrollments } from '@/hooks/useEnrollments';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const isStudent = role === 'student';
  const reportRef = useRef<HTMLDivElement>(null);
  
  const { data: marks = [], isLoading: marksLoading } = useStudentMarks(isStudent ? user?.id : undefined);
  const { data: examinations = [] } = useExaminations();
  const { data: subjects = [] } = useSubjects();
  const { data: courses = [] } = useCourses();
  const { data: enrollments = [] } = useAllEnrollments();

  // Calculate student stats
  const calculateStudentStats = () => {
    if (!marks.length) return { avgPercentage: 0, subjectsCleared: 0, totalSubjects: 0 };
    
    const totalMarks = marks.reduce((sum, m) => sum + (m.marks_obtained || 0), 0);
    const totalMaxMarks = marks.reduce((sum, m) => sum + (m.max_marks || 100), 0);
    const avgPercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
    const subjectsCleared = marks.filter(m => (m.marks_obtained || 0) >= ((m.max_marks || 100) * 0.4)).length;
    
    return { avgPercentage, subjectsCleared, totalSubjects: marks.length };
  };

  const stats = calculateStudentStats();

  const handleDownloadReport = async (reportTitle: string) => {
    toast({
      title: "Generating Report",
      description: "Please wait while we prepare your report...",
    });

    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow popups to download reports",
        variant: "destructive",
      });
      return;
    }

    const reportContent = isStudent ? generateStudentReport() : generateAdminReport(reportTitle);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: 600; }
          .stat-card { display: inline-block; padding: 15px 25px; margin: 10px; background: #f9fafb; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .header { text-align: center; margin-bottom: 30px; }
          .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        ${reportContent}
        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Academic Management System</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);

    toast({
      title: "Report Ready",
      description: "Use the print dialog to save as PDF",
    });
  };

  const generateStudentReport = () => {
    const marksRows = marks.map(m => `
      <tr>
        <td>${m.subject_name || 'N/A'}</td>
        <td>${m.exam_name || 'N/A'}</td>
        <td>${m.marks_obtained || 0}</td>
        <td>${m.max_marks || 100}</td>
        <td>${(((m.marks_obtained || 0) / (m.max_marks || 100)) * 100).toFixed(1)}%</td>
        <td>${(m.marks_obtained || 0) >= ((m.max_marks || 100) * 0.4) ? '✓ Pass' : '✗ Fail'}</td>
      </tr>
    `).join('');

    return `
      <div class="header">
        <h1>Student Performance Report</h1>
        <p>Email: ${user?.email}</p>
      </div>
      
      <h2>Performance Overview</h2>
      <div>
        <div class="stat-card">
          <div class="stat-value">${stats.avgPercentage.toFixed(1)}%</div>
          <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.subjectsCleared}</div>
          <div class="stat-label">Subjects Cleared</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalSubjects}</div>
          <div class="stat-label">Total Exams</div>
        </div>
      </div>
      
      <h2>Detailed Marks</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Examination</th>
            <th>Marks Obtained</th>
            <th>Max Marks</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${marksRows || '<tr><td colspan="6" style="text-align: center;">No marks available</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const generateAdminReport = (reportType: string) => {
    const examRows = examinations.slice(0, 10).map(e => `
      <tr>
        <td>${e.name}</td>
        <td>${e.exam_type}</td>
        <td>${new Date(e.exam_date).toLocaleDateString()}</td>
        <td>${subjects.find(s => s.id === e.subject_id)?.name || 'N/A'}</td>
      </tr>
    `).join('');

    const subjectRows = subjects.slice(0, 10).map(s => `
      <tr>
        <td>${s.code}</td>
        <td>${s.name}</td>
        <td>${s.credits}</td>
        <td>${courses.find(c => c.id === s.course_id)?.name || 'N/A'}</td>
      </tr>
    `).join('');

    const courseRows = courses.map(c => `
      <tr>
        <td>${c.code}</td>
        <td>${c.name}</td>
        <td>${c.duration_years} years</td>
        <td>${enrollments.filter(e => e.course_id === c.id).length}</td>
      </tr>
    `).join('');

    return `
      <div class="header">
        <h1>${reportType}</h1>
        <p>Academic Management System</p>
      </div>
      
      <h2>Course Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Course Name</th>
            <th>Duration</th>
            <th>Enrollments</th>
          </tr>
        </thead>
        <tbody>
          ${courseRows || '<tr><td colspan="4" style="text-align: center;">No data</td></tr>'}
        </tbody>
      </table>
      
      <h2>Subject Details</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Subject Name</th>
            <th>Credits</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows || '<tr><td colspan="4" style="text-align: center;">No data</td></tr>'}
        </tbody>
      </table>
      
      <h2>Recent Examinations</h2>
      <table>
        <thead>
          <tr>
            <th>Examination</th>
            <th>Type</th>
            <th>Date</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          ${examRows || '<tr><td colspan="4" style="text-align: center;">No data</td></tr>'}
        </tbody>
      </table>
    `;
  };

  if (isStudent) {
    return (
      <div className="space-y-6" ref={reportRef}>
        <div>
          <h1 className="text-2xl font-bold">My Performance Report</h1>
          <p className="text-muted-foreground">View your academic performance analytics</p>
        </div>

        {/* Performance Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgPercentage.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <BarChart3 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.subjectsCleared}</p>
                  <p className="text-sm text-muted-foreground">Subjects Cleared</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <FileText className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalSubjects}</p>
                  <p className="text-sm text-muted-foreground">Total Exams</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{marks.length}</p>
                  <p className="text-sm text-muted-foreground">Results Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marks Table */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>My Results</CardTitle>
            <CardDescription>Your marks across all examinations</CardDescription>
          </CardHeader>
          <CardContent>
            {marksLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : marks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No marks available yet</p>
            ) : (
              <div className="space-y-4">
                {marks.map((mark, index) => (
                  <div key={mark.id || index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                      <p className="font-medium">{mark.subject_name || 'Unknown Subject'}</p>
                      <p className="text-sm text-muted-foreground">{mark.exam_name || 'Unknown Exam'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{mark.marks_obtained}/{mark.max_marks}</p>
                      <Badge variant={(mark.marks_obtained || 0) >= ((mark.max_marks || 100) * 0.4) ? 'success' : 'destructive'}>
                        {(((mark.marks_obtained || 0) / (mark.max_marks || 100)) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button 
          variant="gradient" 
          className="gap-2"
          onClick={() => handleDownloadReport('Student Performance Report')}
        >
          <Download className="h-4 w-4" />
          Download Full Report (PDF)
        </Button>
      </div>
    );
  }

  // Admin/Teacher View
  const reportTypes = [
    { title: 'Class-wise Report', desc: 'Overall performance of each class', icon: Users, color: 'primary' },
    { title: 'Subject-wise Report', desc: 'Subject performance analysis', icon: FileText, color: 'success' },
    { title: 'Student Performance', desc: 'Individual student reports', icon: TrendingUp, color: 'warning' },
    { title: 'Attendance Report', desc: 'Attendance statistics', icon: BarChart3, color: 'primary' },
    { title: 'Result Analysis', desc: 'Pass/fail statistics', icon: TrendingDown, color: 'destructive' },
    { title: 'Complete Report', desc: 'All data combined', icon: FileText, color: 'secondary' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export academic reports</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{subjects.length}</p>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <BarChart3 className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{examinations.length}</p>
                <p className="text-sm text-muted-foreground">Examinations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enrollments.length}</p>
                <p className="text-sm text-muted-foreground">Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report, index) => (
          <Card key={index} variant="interactive" className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-${report.color}/10`}>
                  <report.icon className={`h-6 w-6 text-${report.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.desc}</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.title)}
                    >
                      Generate
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleDownloadReport(report.title)}
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Examinations as Reports */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Examinations</CardTitle>
          <CardDescription>Latest examination data available for reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {examinations.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No examinations available</p>
            ) : (
              examinations.slice(0, 5).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{exam.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(exam.exam_date).toLocaleDateString()} • {exam.exam_type}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleDownloadReport(`${exam.name} Report`)}
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
