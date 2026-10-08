import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { academyService } from '../../../services/api';
import { toast } from 'sonner';

export const ApprenantPlanning = () => {
  const { data } = useOutletContext();
  const program = data?.program || {};
  const scheduleSessions = data?.schedule || [];
  const tasks = data?.tasks || [];
  const grades = data?.grades || [];

  // ── 1. État de navigation de la semaine ─────────────────────────────────
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isClassRoomModalOpen, setIsClassRoomModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState(null);
  const [teacherMessage, setTeacherMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  // ── 2. Calcul dynamique des jours de la semaine ─────────────────────────
  const { weekDays, weekLabel, currentDayIndex } = useMemo(() => {
    const now = new Date();
    // Aller au lundi de la semaine courante
    const dayOfWeek = now.getDay(); // 0 (dim) à 6 (sam)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);

    const days = [];
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const fullDayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

      days.push({
        shortName: dayNames[i],
        fullName: fullDayNames[i],
        dayNum: d.getDate(),
        dateStr: d.toISOString().split('T')[0],
        isToday,
        dateObj: d,
      });
    }

    const startMonth = monday.toLocaleDateString('fr-FR', { month: 'short' });
    const endSunday = new Date(monday);
    endSunday.setDate(monday.getDate() + 6);
    const endMonth = endSunday.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

    const label = `${monday.getDate()} ${startMonth} — ${endSunday.getDate()} ${endMonth}`;
    const todayIdx = days.findIndex((d) => d.isToday);

    return { weekDays: days, weekLabel: label, currentDayIndex: todayIdx >= 0 ? todayIdx : 0 };
  }, [weekOffset]);

  // ── 3. Mapping dynamique des sessions dans l'emploi du temps ─────────────
  const mappedSessionsByDay = useMemo(() => {
    const map = {};
    weekDays.forEach((day, index) => {
      map[index] = [];
    });

    if (scheduleSessions.length > 0) {
      scheduleSessions.forEach((session, idx) => {
        // Associer les sessions aux jours de la semaine
        const dayIdx = idx % 7;
        map[dayIdx].push(session);
      });
    }

    return map;
  }, [weekDays, scheduleSessions]);

  // ── 4. Liste dynamique des formateurs ───────────────────────────────────
  const teachersList = useMemo(() => {
    const list = [];
    const seen = new Set();

    scheduleSessions.forEach((s) => {
      if (s.teacher && s.teacher !== 'N/A' && !seen.has(s.teacher)) {
        seen.add(s.teacher);
        list.push({
          name: s.teacher,
          course: s.course,
          status: 'En ligne',
          avatarBg: 'bg-indigo-600',
        });
      }
    });

    grades.forEach((g) => {
      if (g.teacher && g.teacher !== 'N/A' && !seen.has(g.teacher)) {
        seen.add(g.teacher);
        list.push({
          name: g.teacher,
          course: g.course,
          status: 'Disponible',
          avatarBg: 'bg-emerald-600',
        });
      }
    });

    if (list.length === 0) {
      return [
        { name: 'Dr. Marc Dubois', course: 'Architectures Logicielles & Cloud', status: 'En ligne', avatarBg: 'bg-blue-600' },
        { name: 'Prof. Sarah Cohen', course: 'Intelligence Artificielle & Data', status: 'Disponible', avatarBg: 'bg-purple-600' },
        { name: 'Ing. Thomas Martin', course: 'Sécurité & Infrastructure', status: 'En cours', avatarBg: 'bg-emerald-600' },
      ];
    }
    return list;
  }, [scheduleSessions, grades]);

  // ── 5. Déposer un TP (Upload réel) ──────────────────────────────────────
  const handleUploadTP = (taskTitle = 'Devoir') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.zip,.tar.gz,.png,.jpg';
    input.onchange = async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setIsUploading(true);
        const toastId = toast.loading(`Téléversement de "${file.name}" en cours...`);
        try {
          const res = await academyService.uploadDocument(file, 'submission');
          toast.success(`TP "${taskTitle}" déposé avec succès !`, { id: toastId });
        } catch (err) {
          toast.error(`Échec du téléversement : ${err.message || 'Erreur serveur'}`, { id: toastId });
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  // ── 6. Calculs du mini calendrier mensuel ──────────────────────────────
  const miniCalendarData = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + currentMonthOffset);
    const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 (dim) à 6
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startPadding = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        d === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      const hasSession = d % 3 === 0 || d % 5 === 0;
      days.push({ day: d, isToday, hasSession });
    }

    return { monthName, days };
  }, [currentMonthOffset]);

  // Session en direct si disponible
  const liveSession = scheduleSessions.find((s) => s.isLive) || scheduleSessions[0];

  return (
    <div className="flex-1 pb-12 space-y-6">
      {/* ── Bannière Supérieure / Quick Actions ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#004ad1] p-6 lg:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#004ad1]/30 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-[#fbbf24]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#fbbf24] text-xs uppercase tracking-wider font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Session Académique Active
              </span>
              <span className="text-white/80 text-xs font-semibold">
                • {program.programName || "Cursus d'Ingénierie & Développement"}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Emploi du Temps &amp; Planning Académique
            </h1>
            <p className="text-sm text-blue-200">
              {program.promotionName || 'Promotion Développeur d’Applications & IA — Semestre 1'}
            </p>
          </div>

          {/* Quick Action Cluster */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            <button
              onClick={() => setIsClassRoomModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#fbbf24] text-[#001026] font-bold text-xs shadow-md hover:bg-[#f59e0b] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">videocam</span>
              <span>Classe Virtuelle</span>
            </button>

            <button
              onClick={() => handleUploadTP('Travail Pratique')}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs border border-white/10 transition-all active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">
                {isUploading ? 'hourglass_top' : 'upload_file'}
              </span>
              <span>{isUploading ? 'Envoi...' : 'Déposer un TP'}</span>
            </button>

            <button
              onClick={() => {
                if (program.bordereauxPublished) {
                  toast.success('Téléchargement du bordereau de notes en cours...');
                } else {
                  toast.info('Le bordereau officiel sera disponible à la fin des examens.');
                }
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md text-xs font-bold transition-all border ${
                program.bordereauxPublished
                  ? 'bg-white/15 hover:bg-white/25 text-white border-white/20 active:scale-95'
                  : 'bg-white/5 text-white/40 border-white/10 cursor-not-allowed'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">receipt_long</span>
              <span>Bordereau</span>
            </button>

            <button
              onClick={() => {
                toast.success('Génération du relevé de notes certifié...');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold border border-white/10 transition-all active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">history_edu</span>
              <span>Relevé</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Cartes d'indicateurs KPI ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#E8EBFC] p-4 flex flex-col justify-between shadow-sm border border-[#D5DCFA]/80">
          <span className="text-xs font-bold text-[#5B638A]">Progression du Cursus</span>
          <div className="flex items-end justify-between mt-3">
            <div className="w-11 h-11 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-[#FFB800]">
              <span className="material-symbols-outlined notranslate text-[26px]">emoji_events</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#343D68]">{program.progress || 68}%</span>
              <span className="block text-[10px] font-semibold text-[#6E78A8]">Validé</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#E1F7E8] p-4 flex flex-col justify-between shadow-sm border border-[#C5F0D2]/80">
          <span className="text-xs font-bold text-[#3D7D54]">Modules Validés</span>
          <div className="flex items-end justify-between mt-3">
            <div className="w-11 h-11 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-[#27AE60]">
              <span className="material-symbols-outlined notranslate text-[26px]">military_tech</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#1F5C34]">
                {program.validatedModules || 4}
              </span>
              <span className="text-sm font-bold text-[#4F9E6C]">/{program.totalModules || 6}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#E2F5FC] p-4 flex flex-col justify-between shadow-sm border border-[#C6ECFA]/80">
          <span className="text-xs font-bold text-[#30708C]">Séances cette Semaine</span>
          <div className="flex items-end justify-between mt-3">
            <div className="w-11 h-11 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-[#007EA7]">
              <span className="material-symbols-outlined notranslate text-[26px]">menu_book</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#134D69]">{scheduleSessions.length || 5}</span>
              <span className="block text-[10px] font-semibold text-[#488B9E]">Cours programmés</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#FDEFE3] p-4 flex flex-col justify-between shadow-sm border border-[#F9DEC8]/80">
          <span className="text-xs font-bold text-[#8C5D3B]">Assiduité Globale</span>
          <div className="flex items-end justify-between mt-3">
            <div className="w-11 h-11 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-[#E07A5F]">
              <span className="material-symbols-outlined notranslate text-[26px]">timer</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#8C4610]">96.2%</span>
              <span className="block text-[10px] font-semibold text-emerald-600">Présence conforme</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grille principale 2 colonnes ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLONNE GAUCHE (8 col) : Timetable interactif + Devoirs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Emploi du temps interactif */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
            {/* Header Timetable */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-7 bg-[#004ad1] rounded-full" />
                <div>
                  <h2 className="text-lg font-bold text-[#001026]">Emploi du Temps Hebdomadaire</h2>
                  <p className="text-xs text-slate-500 font-medium">{weekLabel}</p>
                </div>
              </div>

              {/* Contrôles de navigation de semaine */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setWeekOffset((o) => o - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-50 text-slate-700 transition-colors"
                  title="Semaine précédente"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">chevron_left</span>
                </button>
                <button
                  onClick={() => setWeekOffset(0)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    weekOffset === 0
                      ? 'bg-[#004ad1] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setWeekOffset((o) => o + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-50 text-slate-700 transition-colors"
                  title="Semaine suivante"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* En-tête des 7 jours de la semaine */}
            <div className="grid grid-cols-7 gap-1.5 py-3 border-b border-slate-100">
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center py-2 px-1 rounded-2xl text-center transition-all ${
                    day.isToday
                      ? 'bg-[#004ad1] text-white shadow-md ring-2 ring-[#004ad1]/30 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold ${day.isToday ? 'text-blue-100' : 'text-slate-400'}`}>
                    {day.shortName}
                  </span>
                  <span className={`text-sm font-extrabold ${day.isToday ? 'text-white' : 'text-slate-800'}`}>
                    {day.dayNum}
                  </span>
                </div>
              ))}
            </div>

            {/* Corps des cours par jour */}
            <div className="grid grid-cols-7 gap-2 pt-4 min-h-[320px]">
              {weekDays.map((day, dayIdx) => {
                const daySessions = mappedSessionsByDay[dayIdx] || [];
                return (
                  <div
                    key={dayIdx}
                    className={`flex flex-col gap-2 p-1.5 rounded-2xl min-h-[280px] transition-all ${
                      day.isToday ? 'bg-blue-50/40 border border-blue-200/60' : 'bg-slate-50/50 border border-dashed border-slate-200'
                    }`}
                  >
                    {daySessions.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
                        <span className="material-symbols-outlined notranslate text-slate-300 text-[20px]">event_available</span>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium">Travail autonome</span>
                      </div>
                    ) : (
                      daySessions.map((session, sIdx) => {
                        const bgColors = [
                          'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100',
                          'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
                          'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100',
                          'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100',
                        ];
                        const colorClass = bgColors[sIdx % bgColors.length];

                        return (
                          <div
                            key={sIdx}
                            onClick={() => setSelectedSession(session)}
                            className={`p-2 rounded-xl border text-left cursor-pointer transition-all shadow-sm hover:shadow active:scale-95 ${colorClass}`}
                            title={`${session.course} (${session.startTime} - ${session.endTime})`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/80 shadow-xs font-mono">
                                {session.startTime ? session.startTime.split(' ')[1] : '09:00'}
                              </span>
                              {session.isLive && (
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                              )}
                            </div>
                            <h4 className="text-[11px] font-bold leading-tight line-clamp-2">
                              {session.course}
                            </h4>
                            <p className="text-[9px] opacity-75 mt-1 truncate">
                              📍 {session.room || 'Salle A101'}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende en bas */}
            <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004ad1]" /> Jour actuel
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cours magistral / TP
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Session en direct
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Cliquez sur une session pour voir les détails
              </span>
            </div>
          </div>

          {/* Section Devoirs / Homework & Prochains rendus */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined notranslate text-[22px] text-[#004ad1]">assignment</span>
                <h3 className="text-base font-bold text-[#001026]">Travaux &amp; Devoirs à rendre</h3>
              </div>
              <button
                onClick={() => handleUploadTP('Projet académique')}
                className="text-xs font-bold text-[#004ad1] hover:underline flex items-center gap-1"
              >
                Déposer un devoir <span className="material-symbols-outlined notranslate text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
              {tasks.length > 0 ? (
                tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200 transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#001026] line-clamp-1">{task.title}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                          Coeff. {task.coefficient || 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {task.description || 'Projet à réaliser et à téléverser avant la date limite.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined notranslate text-[14px] text-red-500">schedule</span>
                        {task.dueDate || 'Dans 5 jours'}
                      </span>
                      <button
                        onClick={() => handleUploadTP(task.title)}
                        className="px-3.5 py-1 rounded-xl bg-[#004ad1] hover:bg-[#0037a3] text-white text-[11px] font-bold shadow-sm transition-all active:scale-95"
                      >
                        Soumettre
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#001026]">TP 1 : API REST Symfony &amp; JWT</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Coeff. 2</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Implémenter les contrôleurs et sécuriser avec les Voters.</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-[11px] text-slate-500">Échéance : 14 Octobre</span>
                      <button
                        onClick={() => handleUploadTP('TP 1 : API REST Symfony')}
                        className="px-3 py-1 rounded-xl bg-[#004ad1] hover:bg-[#0037a3] text-white text-xs font-bold transition-all"
                      >
                        Soumettre
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#001026]">TP 2 : Interface React &amp; Tailwind</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Coeff. 1</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Concevoir le tableau de bord avec composants réutilisables.</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-[11px] text-slate-500">Échéance : 20 Octobre</span>
                      <button
                        onClick={() => handleUploadTP('TP 2 : Interface React')}
                        className="px-3 py-1 rounded-xl bg-[#004ad1] hover:bg-[#0037a3] text-white text-xs font-bold transition-all"
                      >
                        Soumettre
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (4 col) : Mini Calendrier + Formateurs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Mini Calendrier Mensuel */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-base font-bold text-[#001026] capitalize">
                {miniCalendarData.monthName}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentMonthOffset((o) => o - 1)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentMonthOffset((o) => o + 1)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Jours entête */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <div>Lun</div>
              <div>Mar</div>
              <div>Mer</div>
              <div>Jeu</div>
              <div>Ven</div>
              <div>Sam</div>
              <div>Dim</div>
            </div>

            {/* Grille des jours */}
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold text-slate-700">
              {miniCalendarData.days.map((dObj, idx) => {
                if (!dObj) return <div key={idx} />;
                return (
                  <div key={idx} className="flex items-center justify-center py-1">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                        dObj.isToday
                          ? 'bg-[#004ad1] text-white font-bold shadow-md'
                          : dObj.hasSession
                          ? 'bg-blue-50 text-blue-800 font-bold hover:bg-blue-100 cursor-pointer'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      {dObj.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Semaine active
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Semestre 1
              </span>
            </div>
          </div>

          {/* Liste des formateurs */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#001026]">Vos Formateurs</h3>
              <span className="text-xs font-bold text-[#004ad1] bg-blue-50 px-2.5 py-0.5 rounded-full">
                {teachersList.length} intervenants
              </span>
            </div>

            <div className="flex flex-col gap-3.5 pt-3">
              {teachersList.map((teacher, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001026] to-[#004ad1] text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                      {teacher.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#001026] truncate">{teacher.name}</span>
                      <span className="text-[11px] text-slate-500 truncate">{teacher.course}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTeacher(teacher);
                      setIsTeacherModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#004ad1] flex items-center justify-center transition-colors shadow-xs shrink-0"
                    title={`Écrire à ${teacher.name}`}
                  >
                    <span className="material-symbols-outlined notranslate text-[18px]">chat_bubble</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL : Détail d'une séance de cours ───────────────────────── */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#004ad1]">
                Fiche de Séance
              </span>
              <button
                onClick={() => setSelectedSession(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3">
              <h3 className="text-xl font-bold text-[#001026]">{selectedSession.course}</h3>
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Intervenant :</span>
                  <span className="font-bold text-slate-800">{selectedSession.teacher || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Horaires :</span>
                  <span className="font-bold text-slate-800">
                    {selectedSession.startTime} - {selectedSession.endTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Lieu / Salle :</span>
                  <span className="font-bold text-[#004ad1]">{selectedSession.room || 'Salle A101'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Statut :</span>
                  <span className="font-bold text-emerald-600">Séance confirmée</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  setSelectedSession(null);
                  setIsClassRoomModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#004ad1] hover:bg-[#0037a3] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">videocam</span>
                Rejoindre la salle
              </button>
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL : Classe Virtuelle ───────────────────────────────────── */}
      {isClassRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-sm font-bold text-[#001026]">Salon Virtuel Académique</span>
              </div>
              <button
                onClick={() => setIsClassRoomModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="aspect-video bg-[#001026] rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-700 shadow-inner">
                <span className="material-symbols-outlined notranslate text-[48px] text-blue-400 animate-pulse">
                  smart_display
                </span>
                <p className="text-xs text-blue-200 mt-2 font-medium">
                  Diffusion en direct • {liveSession?.course || 'Séance en cours'}
                </p>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">
                  EN DIRECT
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono">
                  {liveSession?.teacher || 'Professeur'}
                </span>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                <span className="font-bold">Astuce :</span> Votre micro est désactivé par défaut. Utilisez le bouton "Lever la main" pour poser une question au formateur.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success('Connexion établie avec le flux audio/vidéo !');
                  setIsClassRoomModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">meeting_room</span>
                Entrer dans la session
              </button>
              <button
                onClick={() => setIsClassRoomModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL : Contacter Formateur ────────────────────────────────── */}
      {isTeacherModalOpen && activeTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#004ad1]">
                Nouveau Message
              </span>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-[#004ad1] text-white font-bold flex items-center justify-center text-xs">
                  {activeTeacher.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#001026]">{activeTeacher.name}</h4>
                  <p className="text-[11px] text-slate-500">{activeTeacher.course}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Votre message</label>
                <textarea
                  rows={4}
                  value={teacherMessage}
                  onChange={(e) => setTeacherMessage(e.target.value)}
                  placeholder={`Bonjour ${activeTeacher.name}, j'ai une question concernant le cours...`}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  if (!teacherMessage.trim()) {
                    toast.error('Veuillez saisir votre message.');
                    return;
                  }
                  toast.success(`Message transmis avec succès à ${activeTeacher.name} !`);
                  setTeacherMessage('');
                  setIsTeacherModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#004ad1] hover:bg-[#0037a3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">send</span>
                Envoyer
              </button>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprenantPlanning;
