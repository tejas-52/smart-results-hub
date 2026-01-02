import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Eye, Plus, FolderOpen, File, Video, BookOpen, Trash2 } from 'lucide-react';
import { useStudyMaterials, useDeleteMaterial, useUploadMaterial } from '@/hooks/useStudyMaterials';
import { useSubjects } from '@/hooks/useSubjects';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const StudyMaterials: React.FC = () => {
  const { role, user } = useAuth();
  const isTeacher = role === 'teacher' || role === 'admin';
  const { data: materials, isLoading, error } = useStudyMaterials();
  const { data: subjects } = useSubjects();
  const deleteMaterial = useDeleteMaterial();
  const uploadMaterial = useUploadMaterial();
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  
  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadSubjectId, setUploadSubjectId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const getFileIcon = (type: string) => {
    const upperType = type?.toUpperCase();
    switch (upperType) {
      case 'PDF':
        return <FileText className="h-6 w-6" />;
      case 'MP4':
      case 'VIDEO':
        return <Video className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const getFileColor = (type: string) => {
    const upperType = type?.toUpperCase();
    switch (upperType) {
      case 'PDF':
        return 'bg-destructive/10 text-destructive';
      case 'MP4':
      case 'VIDEO':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-success/10 text-success';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadSubjectId || !uploadTitle) return;
    
    await uploadMaterial.mutateAsync({
      file: uploadFile,
      material: {
        title: uploadTitle,
        description: uploadDescription || null,
        subject_id: uploadSubjectId,
        uploaded_by: user?.id || null,
      },
    });
    
    setUploadDialogOpen(false);
    setUploadTitle('');
    setUploadDescription('');
    setUploadSubjectId('');
    setUploadFile(null);
  };

  const handleDelete = (id: string) => {
    setMaterialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (materialToDelete) {
      await deleteMaterial.mutateAsync(materialToDelete);
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  const filteredMaterials = materials?.filter(m => {
    if (filter === 'all') return true;
    return m.subject_id === filter;
  });

  // Calculate stats
  const totalFiles = materials?.length || 0;
  const pdfCount = materials?.filter(m => m.file_type?.toUpperCase() === 'PDF').length || 0;
  const videoCount = materials?.filter(m => ['MP4', 'VIDEO'].includes(m.file_type?.toUpperCase() || '')).length || 0;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading materials: {error.message}</p>
      </div>
    );
  }

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
          <Button variant="gradient" className="gap-2" onClick={() => setUploadDialogOpen(true)}>
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
                <p className="text-2xl font-bold">{totalFiles}</p>
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
                <p className="text-2xl font-bold">{pdfCount}</p>
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
                <p className="text-2xl font-bold">{videoCount}</p>
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
                <p className="text-2xl font-bold">{subjects?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Filter */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Subjects
            </Button>
            {subjects?.map((subject) => (
              <Button 
                key={subject.id}
                variant={filter === subject.id ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setFilter(subject.id)}
              >
                {subject.code}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredMaterials && filteredMaterials.length > 0 ? (
          filteredMaterials.map((material, index) => (
            <Card
              key={material.id}
              variant="elevated"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`p-4 rounded-xl flex-shrink-0 ${getFileColor(material.file_type)}`}>
                    {getFileIcon(material.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{material.title}</h3>
                      <Badge variant="outline">{material.file_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {material.subject_name} ({material.subject_code})
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{format(new Date(material.created_at), 'MMM d, yyyy')}</span>
                      <span>{formatFileSize(material.file_size)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => window.open(material.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = material.file_url;
                        link.download = material.title;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    {isTeacher && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(material.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No materials found</h3>
            <p className="text-muted-foreground mb-4">
              {isTeacher ? 'Upload your first study material.' : 'No study materials available yet.'}
            </p>
            {isTeacher && (
              <Button variant="gradient" onClick={() => setUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Study Material</DialogTitle>
            <DialogDescription>
              Upload a new study material for students to access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., Advanced Java - Unit 1 Notes"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={uploadSubjectId} onValueChange={setUploadSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Brief description of the material..."
              />
            </div>
            <div>
              <Label htmlFor="file">File</Label>
              <Input 
                id="file"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="gradient"
                onClick={handleUpload}
                disabled={!uploadFile || !uploadSubjectId || !uploadTitle || uploadMaterial.isPending}
              >
                {uploadMaterial.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this material? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudyMaterials;
