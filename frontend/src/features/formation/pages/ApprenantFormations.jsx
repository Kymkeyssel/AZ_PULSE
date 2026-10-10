import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { academyService } from '../../../services/api';

export default function ApprenantFormations() {
  const { data } = useOutletContext();
  const [courses, setCourses] = useState(data?.currentCourses || []);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(!data?.currentCourses?.length);
  const [uploadingId, setUploadingId] = useState(null);
  const fileInput = useRef(null);
  const [targetCourse, setTargetCourse] = useState(null);

  useEffect(() => {
    let active = true;
    academyService.listCourses().then((result) => { if (active) setCourses(result.data || []); })
      .catch((error) => { if (active) toast.error(error.message || 'Catalogue indisponible'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => courses.filter((course) => `${course.title || course.name || ''} ${course.description || ''} ${course.teacher || ''}`.toLowerCase().includes(query.toLowerCase())), [courses, query]);
  const submit = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingId(targetCourse);
    try { await academyService.uploadDocument(file, 'submission'); toast.success('Document transmis à votre espace pédagogique.'); }
    catch (error) { toast.error(error.message || 'Dépôt impossible'); }
    finally { setUploadingId(null); event.target.value = ''; }
  };

  return <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-7">
    <header className="rounded-3xl bg-[#0b2545] text-white p-7 md:p-9"><p className="text-xs uppercase tracking-[.2em] text-blue-200 font-bold">AZ Pulse · Académie</p><h1 className="text-3xl md:text-4xl font-black mt-3">Mes formations</h1><p className="text-sm text-blue-100 mt-2 max-w-2xl">Retrouvez le catalogue pédagogique disponible et les ressources liées à votre parcours.</p>{data?.program?.programName && <p className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Parcours : {data.program.programName}</p>}</header>
    <section className="flex flex-col sm:flex-row gap-3"><label className="relative flex-1"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un cours ou un formateur…" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm"/></label><span className="inline-flex items-center rounded-xl bg-white border border-slate-200 px-4 text-sm text-slate-500">{visible.length} cours</span></section>
    {loading ? <div className="rounded-2xl bg-white border p-8 text-sm text-slate-500">Chargement du catalogue…</div> : visible.length ? <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{visible.map((course) => <article key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col min-h-56 shadow-sm"><div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 grid place-items-center"><span className="material-symbols-outlined">auto_stories</span></div><h2 className="text-lg font-bold text-slate-900 mt-4">{course.title || course.name}</h2><p className="text-sm text-slate-500 mt-2 line-clamp-3">{course.description || 'Aucune description pédagogique renseignée.'}</p><div className="mt-auto pt-5 flex items-center justify-between gap-3"><span className="text-xs text-slate-500">Formateur : {course.teacher || 'À confirmer'}</span><button onClick={() => { setTargetCourse(course.id); fileInput.current?.click(); }} disabled={uploadingId === course.id} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{uploadingId === course.id ? 'Envoi…' : 'Déposer un travail'}</button></div></article>)}</div> : <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center"><p className="font-bold text-slate-800">Aucun cours trouvé</p><p className="text-sm text-slate-500 mt-2">{courses.length ? 'Essayez avec un autre terme.' : 'Le catalogue ne contient pas encore de cours.'}</p></div>}
    <input ref={fileInput} type="file" accept=".pdf,.doc,.docx,.zip" className="hidden" onChange={submit}/>
  </div>;
}
