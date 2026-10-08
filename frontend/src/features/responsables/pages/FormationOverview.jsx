import { useState, useEffect } from 'react';
import { academyService } from '../../../services/api';

const FormationOverview = () => {
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([academyService.listCourses(), academyService.listSchedule()])
      .then(([c, s]) => {
        setCourses(c.data || []);
        setSchedule(s.data || []);
      })
      .catch(() => setError('Catalogue formation indisponible (formation.read).'));
  }, []);

  if (error) {
    return <div className="bg-white rounded-2xl border p-8 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001026]">Formation</h1>
          <p className="text-sm text-[#6b7a99] mt-1">Cours et sessions issus du référentiel académique.</p>
        </div>
        <a href="/formation/paiements" className="px-4 py-2 rounded-lg bg-[#004ad1] text-white text-sm font-bold">
          Justificatifs de paiement
        </a>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5">
          <h2 className="font-bold mb-3">Cours ({courses.length})</h2>
          <ul className="space-y-2 text-sm">
            {courses.length === 0 && <li className="text-[#6b7a99]">Aucun cours en base.</li>}
            {courses.map((c) => (
              <li key={c.id} className="border-b border-slate-100 pb-2">
                <p className="font-semibold">{c.title}</p>
                <p className="text-[#6b7a99]">{c.teacher}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5">
          <h2 className="font-bold mb-3">Prochaines sessions</h2>
          <ul className="space-y-2 text-sm">
            {schedule.length === 0 && <li className="text-[#6b7a99]">Aucune session planifiée.</li>}
            {schedule.slice(0, 8).map((s) => (
              <li key={s.id} className="border-b border-slate-100 pb-2">
                <p className="font-semibold">{s.course}</p>
                <p className="text-[#6b7a99]">{s.room} · {s.startTime ? new Date(s.startTime).toLocaleString('fr-FR') : ''}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default FormationOverview;
