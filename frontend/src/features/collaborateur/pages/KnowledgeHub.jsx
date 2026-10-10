import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { knowledgeService } from '../../../services/api';
import { toast } from 'sonner';
import { TOKEN_KEY } from '../../../services/config';
import AIInsightsWidget from '../components/AIInsightsWidget';
import AIChatDrawer from '../components/AIChatDrawer';
import { Sparkles } from 'lucide-react';

export default function KnowledgeHub() {
  const { hasPermission, user } = useAuth();
  const canWrite = hasPermission('knowledge.write');
  const canPublish = hasPermission('knowledge.write') || hasPermission('knowledge.manage');

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocuments = async (q = '') => {
    setLoading(true);
    try {
      const res = await knowledgeService.listDocuments({ q });
      if (res?.success) {
        setDocuments(res.data);
      }
    } catch (err) {
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDocuments(searchQuery);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await knowledgeService.uploadDocument(file, {
        title: file.name.split('.')[0]
      });
      if (res?.success) {
        toast.success('Document téléversé avec succès');
        fetchDocuments(searchQuery);
      }
    } catch (err) {
      toast.error(err.message || 'Erreur lors du téléversement');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePublish = async (docId) => {
    setIsPublishing(docId);
    try {
      const res = await knowledgeService.publishDocument(docId);
      if (res?.success) {
        toast.success('Document publié');
        fetchDocuments(searchQuery);
      }
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la publication');
    } finally {
      setIsPublishing(null);
    }
  };

  const handleDownload = (docId) => {
    const url = knowledgeService.downloadUrl(docId);
    const token = localStorage.getItem(TOKEN_KEY);
    
    // Create a temporary link to download the file using token
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Download failed');
      return response.blob();
    })
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const doc = documents.find(d => d.id === docId);
      a.download = doc?.originalName || 'document';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    })
    .catch(err => {
      toast.error('Erreur lors du téléchargement');
    });
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return 'picture_as_pdf';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return 'description';
    if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return 'table_chart';
    if (mimeType?.includes('image')) return 'image';
    if (mimeType?.includes('presentation')) return 'slideshow';
    return 'insert_drive_file';
  };

  const getFileColor = (mimeType) => {
    if (mimeType?.includes('pdf')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (mimeType?.includes('image')) return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    if (mimeType?.includes('presentation')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 mb-3">
            <span className="material-symbols-outlined notranslate text-[14px]">menu_book</span>
            Knowledge Hub
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Base Documentaire</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium max-w-2xl">
            Retrouvez tous les documents, procédures et ressources de l'entreprise. 
            Partagez vos connaissances et accédez aux dernières versions validées.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Assistant IA Doc</span>
          </button>

          {canWrite && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md disabled:opacity-70"
              >
                {isUploading ? (
                  <span className="material-symbols-outlined notranslate text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined notranslate text-[18px]">upload_file</span>
                )}
                {isUploading ? 'Import...' : 'Nouveau document'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Widget IA Analyse Documentaire ─────────────────────────────────── */}
      <AIInsightsWidget
        metrics={{
          total_documents: documents.length,
          published: documents.filter(d => d.status === 'PUBLISHED').length,
          drafts: documents.filter(d => d.status !== 'PUBLISHED').length,
          search_filter: searchQuery || 'all'
        }}
        scope="Knowledge Base & Documentation"
        title="Diagnostic & Indexation Intelligente IA"
      />

      {/* Barre de recherche & Filtres */}
      <div className="glass-panel p-2 rounded-2xl flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
          <span className="material-symbols-outlined notranslate absolute left-4 text-slate-400">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, description ou extension..."
            className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => { setSearchQuery(''); fetchDocuments(''); }}
              className="absolute right-4 text-slate-400 hover:text-red-500"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">close</span>
            </button>
          )}
        </form>
        <div className="pr-2 border-l border-slate-200 pl-4 hidden md:block">
          <button type="submit" onClick={handleSearch} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors">
            Rechercher
          </button>
        </div>
      </div>

      {/* Grille de documents */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Chargement des documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="py-20 glass-panel rounded-3xl flex flex-col items-center justify-center gap-4 border border-dashed border-slate-300">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined notranslate text-[40px]">find_in_page</span>
          </div>
          <h3 className="text-lg font-bold text-slate-700">Aucun document trouvé</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm">
            {searchQuery 
              ? "Essayez de modifier vos termes de recherche pour trouver ce que vous cherchez." 
              : "La base documentaire est actuellement vide. Téléversez le premier document !"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div key={doc.id} className="glass-panel p-5 rounded-2xl group flex flex-col hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getFileColor(doc.mimeType)}`}>
                  <span className="material-symbols-outlined notranslate text-[24px]">
                    {getFileIcon(doc.mimeType)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {doc.status === 'PUBLISHED' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                      Brouillon
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 min-h-[32px]">
                  {doc.description || "Aucune description fournie pour ce document."}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined notranslate text-[14px]">calendar_today</span>
                  {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined notranslate text-[14px]">save</span>
                  {(doc.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleDownload(doc.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">download</span>
                  Télécharger
                </button>

                {canPublish && doc.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePublish(doc.id)}
                    disabled={isPublishing === doc.id}
                    className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    title="Publier ce document"
                  >
                    {isPublishing === doc.id ? (
                      <span className="material-symbols-outlined notranslate text-[16px] animate-spin">sync</span>
                    ) : (
                      <span className="material-symbols-outlined notranslate text-[16px]">public</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Chat Assistant IA Drawer ─────────────────────────────────────── */}
      <AIChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentContext={{
          module: 'KNOWLEDGE_HUB',
          totalDocuments: documents.length,
          searchQuery,
        }}
      />
    </div>
  );
}
