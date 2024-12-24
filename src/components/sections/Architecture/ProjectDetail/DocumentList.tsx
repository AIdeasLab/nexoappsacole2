import React from 'react';
import { File, Upload } from 'lucide-react';
import { uploadProjectDocument, getProjectDocuments } from '../../../../lib/documents';
import { ProjectDocument } from '../../../../types';

interface DocumentListProps {
  projectId: string;
}

export default function DocumentList({ projectId }: DocumentListProps) {
  const [documents, setDocuments] = React.useState<ProjectDocument[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    loadDocuments();
  }, [projectId]);

  if (!projectId) return null;

  async function loadDocuments() {
    const docs = await getProjectDocuments(projectId);
    setDocuments(docs);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const path = await uploadProjectDocument(projectId, file);
    if (path) {
      await loadDocuments();
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Documentos</h2>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </button>
      </div>
      
      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <File className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
              <p className="text-xs text-gray-500">
                Adicionado em {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}