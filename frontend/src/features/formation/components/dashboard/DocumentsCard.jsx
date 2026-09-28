import React from 'react';

import { academyService } from '../../../../services/api';

export const DocumentsCard = ({ data = [] }) => {
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await academyService.uploadDocument(file, 'document');
        alert(`Succès: ${response.message}`);
      } catch (error) {
        alert(`Erreur d'upload: ${error.message}`);
      }
    }
  };

  return (
    <div className="lg:col-span-1 flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className="w-2.5 h-6 bg-error rounded-full shadow-[0_2px_6px_rgba(220,53,69,0.5)]"></div>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">Ressources &amp; Polycopiés</h2>
        </div>
        <a className="font-label-md text-label-md text-secondary hover:underline font-bold" href="#">Accéder au Drive</a>
      </div>
      
      <div className="clay-card rounded-2xl p-space-md grid grid-cols-1 lg:grid-cols-3 gap-space-md h-full">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-space-sm content-start">
          {data.length > 0 ? data.map((doc, idx) => (
            <a key={idx} className="group p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all border border-surface-container shadow-sm flex flex-col gap-3" href="#">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.type === 'PDF' ? 'bg-error-container/20 text-error' : 'bg-secondary/20 text-secondary'}`}>
                  <span className="material-symbols-outlined notranslate text-[24px]">
                    {doc.type === 'PDF' ? 'picture_as_pdf' : 'description'}
                  </span>
                </div>
                <span className="material-symbols-outlined notranslate text-[20px] text-on-surface-variant group-hover:text-secondary transition-colors">download</span>
              </div>
              <div className="flex flex-col min-w-0 mt-2">
                <span className="font-label-lg text-label-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                  {doc.title}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {doc.size} • {doc.course}
                </span>
              </div>
            </a>
          )) : (
            <div className="col-span-full text-center p-4 text-slate-500 italic">Aucun document récent.</div>
          )}
        </div>
        
        <div className="lg:col-span-1 h-full min-h-[250px] flex">
          <div 
            className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-secondary/30 rounded-xl p-space-md text-center bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer"
            onClick={handleUploadClick}
          >
            <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4 shadow-sm">
              <span className="material-symbols-outlined notranslate text-[32px]">cloud_upload</span>
            </div>
            <p className="font-label-lg text-label-lg font-bold text-primary mb-2">Déposer un document</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[200px]">Glissez-déposez vos fichiers ici ou cliquez pour parcourir</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};
