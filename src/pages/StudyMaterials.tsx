import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Plus, FolderOpen, File, Video, BookOpen } from 'lucide-react';

const materialsData = [
  {
    id: 1,
    title: 'Advanced Java - Complete Notes',
    subject: 'Advanced Java Programming',
    subjectCode: 'MCA401',
    type: 'PDF',
    size: '2.5 MB',
    uploadedBy: 'Prof. Priya Sharma',
    uploadDate: '2024-12-20',
    downloads: 156,
  },
  {
    id: 2,
    title: 'Machine Learning - Unit 1 & 2',
    subject: 'Machine Learning',
    subjectCode: 'MCA402',
    type: 'PDF',
    size: '4.2 MB',
    uploadedBy: 'Dr. Amit Patil',
    uploadDate: '2024-12-18',
    downloads: 203,
  },
  {
    id: 3,
    title: 'Cloud Computing Video Lecture',
    subject: 'Cloud Computing',
    subjectCode: 'MCA403',
    type: 'Video',
    size: '125 MB',
    uploadedBy: 'Prof. Sneha Deshmukh',
    uploadDate: '2024-12-15',
    downloads: 89,
  },
  {
    id: 4,
    title: 'Android Development Tutorial',
    subject: 'Mobile Application Development',
    subjectCode: 'MCA404',
    type: 'PDF',
    size: '3.8 MB',
    uploadedBy: 'Dr. Rajesh Kumar',
    uploadDate: '2024-12-12',
    downloads: 178,
  },
  {
    id: 5,
    title: 'Information Security - Assignment',
    subject: 'Information Security',
    subjectCode: 'MCA405',
    type: 'Document',
    size: '500 KB',
    uploadedBy: 'Prof. Priya Sharma',
    uploadDate: '2024-12-10',
    downloads: 120,
  },
];

const StudyMaterials: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-6 w-6" />;
      case 'Video':
        return <Video className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-destructive/10 text-destructive';
      case 'Video':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-success/10 text-success';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Study Materials</h1>
          <p className="text-muted-foreground">
            {isTeacher
              ? 'Upload and manage study materials for students'
              : 'Access study materials, notes, and resources'}
          </p>
        </div>
        {isTeacher && (
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Upload Material
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <FileText className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">PDFs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Download className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">746</p>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Filter */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm">All Subjects</Button>
            <Button variant="ghost" size="sm">MCA401</Button>
            <Button variant="ghost" size="sm">MCA402</Button>
            <Button variant="ghost" size="sm">MCA403</Button>
            <Button variant="ghost" size="sm">MCA404</Button>
            <Button variant="ghost" size="sm">MCA405</Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <div className="space-y-4">
        {materialsData.map((material, index) => (
          <Card
            key={material.id}
            variant="elevated"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`p-4 rounded-xl flex-shrink-0 ${getFileColor(material.type)}`}>
                  {getFileIcon(material.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{material.title}</h3>
                    <Badge variant="outline">{material.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {material.subject} ({material.subjectCode})
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {material.uploadedBy}
                    </span>
                    <span>{material.uploadDate}</span>
                    <span>{material.size}</span>
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {material.downloads} downloads
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="default" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterials;
