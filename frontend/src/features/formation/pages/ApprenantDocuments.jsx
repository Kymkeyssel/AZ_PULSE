import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../services/config';

export default function ApprenantDocuments() {
  const { data } = useOutletContext();
  const [query, setQuery] = useState('');
  const documents = data?.documents || [];
  const filtered = useMemo(() => documents.filter((doc) => `${doc.title || ''} ${doc.course || ''} ${doc.type || ''} ${doc.uploadedBy || ''}`.toLowerCase().includes(query.toLowerCase())), [documents, query]);
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');

  return <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-7">
    <header className="rounded-3xl bg-[#0b2545] text-white p-7 md:p-9"><p className="text-xs uppercase tracking-[.2em] text-blue-200 font-bold">AZ Pulse · Académie</p><h1 className="text-3xl md:text-4xl font-black mt-3">Ressources de cours</h1><p className="text-sm text-blue-100 mt-2">Documents publiés associés à vos cours, depuis le catalogue académique.</p></header>
    <section className="flex flex-col sm:flex-row gap-3"><label className="relative flex-1"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un document, un cours ou un formateur…" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm"/></label><span className="inline-flex items-center rounded-xl bg-white border border-slate-200 px-4 text-sm text-slate-500">{filtered.length} ressource(s)</span></section>
    {filtered.length ? <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{filtered.map((doc, index) => <article key={`${doc.title}-${index}`} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 grid place-items-center"><span className="material-symbols-outlined">{doc.type?.toLowerCase().includes('pdf') ? 'picture_as_pdf' : 'description'}</span></div><span className="text-[10px] uppercase tracking-wide rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-500">{doc.type || 'Document'}</span></div><h2 className="font-bold text-slate-900 mt-4">{doc.title}</h2><p className="text-sm text-slate-500 mt-1">{doc.course || 'Cours non précisé'}</p><div className="mt-4 text-xs text-slate-400 space-y-1"><p>Ajouté par {doc.uploadedBy || 'Équipe pédagogique'}</p><p>{doc.size || 'Taille inconnue'}</p></div>{doc.url && <a href={`${baseUrl}${doc.url}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-bold text-white"><span className="material-symbols-outlined text-base">download</span>Télécharger</a>}</article>)}</div> : <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center"><p className="font-bold text-slate-800">{documents.length ? 'Aucune ressource correspondante' : 'Aucune ressource de cours disponible'}</p><p className="text-sm text-slate-500 mt-2">{documents.length ? 'Modifiez votre recherche.' : 'Les documents apparaîtront ici lorsqu’ils seront associés aux cours.'}</p></div>}
  </div>;
}
