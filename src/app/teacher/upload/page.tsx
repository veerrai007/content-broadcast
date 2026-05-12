import UploadForm from '@/components/teacher/UploadForm';
import { Upload } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Upload size={20} className="text-gray-400" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Upload Content</h1>
          <p className="text-sm text-gray-400">Upload images for principal approval</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <UploadForm />
      </div>
    </div>
  );
}