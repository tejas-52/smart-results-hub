import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, FileText, Users, TrendingUp, TrendingDown } from 'lucide-react';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  if (isStudent) {
    return (
      <div className="space-y-6">
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
                  <p className="text-2xl font-bold">8.5</p>
                  <p className="text-sm text-muted-foreground">Current CGPA</p>
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
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Avg. Attendance</p>
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
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">Subjects Cleared</p>
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
                  <p className="text-2xl font-bold">+0.3</p>
                  <p className="text-sm text-muted-foreground">CGPA Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester-wise Performance */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Semester-wise Performance</CardTitle>
            <CardDescription>Your SGPA trend across semesters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { sem: 'Semester 1', sgpa: 8.2, status: 'completed' },
                { sem: 'Semester 2', sgpa: 8.4, status: 'completed' },
                { sem: 'Semester 3', sgpa: 8.7, status: 'completed' },
                { sem: 'Semester 4', sgpa: null, status: 'ongoing' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 font-medium">{item.sem}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-secondary rounded-full overflow-hidden">
                      {item.sgpa && (
                        <div
                          className="h-full gradient-primary rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(item.sgpa / 10) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-primary-foreground">{item.sgpa}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>
                    {item.status === 'completed' ? 'Completed' : 'Ongoing'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button variant="gradient" className="gap-2">
          <Download className="h-4 w-4" />
          Download Full Report (PDF)
        </Button>
      </div>
    );
  }

  // Admin/Teacher View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export academic reports</p>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Class-wise Report', desc: 'Overall performance of each class', icon: Users, color: 'primary' },
          { title: 'Subject-wise Report', desc: 'Subject performance analysis', icon: FileText, color: 'success' },
          { title: 'Student Performance', desc: 'Individual student reports', icon: TrendingUp, color: 'warning' },
          { title: 'Attendance Report', desc: 'Attendance statistics', icon: BarChart3, color: 'primary' },
          { title: 'Result Analysis', desc: 'Pass/fail statistics', icon: TrendingDown, color: 'destructive' },
          { title: 'Custom Report', desc: 'Create custom reports', icon: FileText, color: 'secondary' },
        ].map((report, index) => (
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
                    <Button variant="outline" size="sm">Generate</Button>
                    <Button variant="ghost" size="sm" className="gap-1">
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

      {/* Recent Reports */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'MCA Sem 3 Result Analysis', date: 'Dec 20, 2024', type: 'PDF' },
              { name: 'Class-wise Attendance Report', date: 'Dec 18, 2024', type: 'Excel' },
              { name: 'Subject Performance - MCA401', date: 'Dec 15, 2024', type: 'PDF' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  {report.type}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
