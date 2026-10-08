import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { workspaceService, aiService } from '../../../services/api';

const STATUS_CONFIG = {
  PLANNED: { label: 'Planifié', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  IN_PROGRESS: { label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  REVIEW: { label: 'En revue', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  COMPLETED: { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
};

const WorkspaceProjects = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingProjectId, setAnalyzingProjectId] = useState(null);

  // Formulaire création
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', status: 'PLANNED', priority: 'MEDIUM' });
  const [submitting, setSubmitting] = useState(false);

  // Projets & Tâches sélectionnées
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const canReadWorkspace = hasPermission('workspace.read');
  const canWriteWorkspace = hasPermission('workspace.write');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await workspaceService.listProjects();
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch (err) {
      toast.error("Erreur de chargement des projets: " + (err.message || "Erreur serveur"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canReadWorkspace) {
      fetchProjects();
    }
  }, [canReadWorkspace]);

  const handleOpenProject = async (project) => {
    setSelectedProject(project);
    setLoadingTasks(true);
    try {
      const res = await workspaceService.listTasks(project.id);
      if (res.success && Array.isArray(res.data)) {
        setProjectTasks(res.data);
      } else {
        setProjectTasks([]);
      }
    } catch (err) {
      toast.error("Impossible de charger les tâches du projet");
      setProjectTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      toast.error("Le nom du projet est obligatoire");
      return;
    }
    setSubmitting(true);
    try {
      const res = await workspaceService.createProject(createForm);
      if (res.success) {
        toast.success("Projet créé avec succès");
        setShowCreate(false);
        setCreateForm({ name: '', description: '', status: 'PLANNED', priority: 'MEDIUM' });
        fetchProjects();
      }
    } catch (err) {
      toast.error("Erreur lors de la création du projet: " + (err.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;
    try {
      const res = await workspaceService.createTask(selectedProject.id, {
        title: newTaskTitle.trim(),
        status: 'TODO',
        priority: 'MEDIUM'
      });
      if (res.success) {
        toast.success("Tâche ajoutée");
        setNewTaskTitle('');
        handleOpenProject(selectedProject);
        fetchProjects();
      }
    } catch (err) {
      toast.error("Impossible d'ajouter la tâche");
    }
  };

  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    try {
      const res = await workspaceService.updateTask(task.id, { status: nextStatus });
      if (res.success) {
        setProjectTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
        toast.success(nextStatus === 'DONE' ? "Tâche terminée" : "Tâche rouverte");
      }
    } catch (err) {
      toast.error("Erreur de mise à jour de la tâche");
    }
  };

  const handleAnalyze = async (project, e) => {
    e?.stopPropagation();
    if (analyzingProjectId === project.id) return;
    setAnalyzingProjectId(project.id);
    try {
      toast.info(`Analyse du projet "${project.name}" par l'IA...`);
      const response = await aiService.analyzeProject(project.id, "Réalise un diagnostic complet des risques, de l'avancement et des points d'attention de ce projet.");
      setAiAnalysis({ project, data: response });
      toast.success("Analyse IA terminée");
    } catch (err) {
      toast.error("Erreur lors de l'analyse IA: " + (err.message || "Service indisponible"));
    } finally {
      setAnalyzingProjectId(null);
    }
  };

  if (!canReadWorkspace) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-red-100 max-w-lg mx-auto mt-12">
        <span className="material-symbols-outlined text-red-500 text-4xl mb-3">lock</span>
        <h2 className="text-red-600 font-extrabold text-lg mb-1">Accès refusé</h2>
        <p className="text-sm text-slate-500">Vous ne disposez pas des permissions requises (`workspace.read`) pour consulter l'espace projets.</p>
      </div>
    );
  }

  // Filtrage des projets
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPIs dynamiques
  const activeProjectsCount = projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PLANNED').length;
  const totalTasksCount = projects.reduce((acc, p) => acc + (p.tasks_count || 0), 0);
  const completedProjectsCount = projects.filter(p => p.status === 'COMPLETED').length;

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      {/* ── En-tête ───────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001026] tracking-tight">Workspace Projets</h1>
          <p className="text-sm text-[#6b7a99] mt-1">Pilotez vos projets opérationnels, vos tâches et vos diagnostics IA contextuels.</p>
        </div>
        {canWriteWorkspace && (
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all bg-[#004ad1]"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nouveau Projet
          </button>
        )}
      </header>

      {/* ── KPIs Réels ──────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
            <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">{activeProjectsCount}</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider mt-0.5">Projets Actifs</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
            <span className="material-symbols-outlined text-[24px]">assignment</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">{totalTasksCount}</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider mt-0.5">Tâches Associées</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">{completedProjectsCount}</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider mt-0.5">Projets Livrés</p>
          </div>
        </div>
      </section>

      {/* ── Filtres & Barre de recherche ──────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-[#dde3ef] shadow-sm">
        <div className="relative w-full sm:w-96 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#6b7a99]">search</span>
          <input 
            type="text" 
            placeholder="Rechercher un projet ou un client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-sm font-medium text-[#001026] placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PLANNED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setStatusFilter(statusKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                statusFilter === statusKey
                  ? 'bg-[#004ad1] text-white shadow-sm'
                  : 'bg-slate-100 text-[#6b7a99] hover:bg-slate-200'
              }`}
            >
              {statusKey === 'ALL' ? 'Tous' : (STATUS_CONFIG[statusKey]?.label || statusKey)}
            </button>
          ))}
        </div>
      </section>

      {/* ── Grille de Projets ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-[#6b7a99] bg-white rounded-2xl border border-[#dde3ef]">
            <span className="material-symbols-outlined animate-spin text-3xl text-blue-600 mb-2">sync</span>
            <p className="text-sm font-medium">Chargement sécurisé des projets du Workspace...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-[#dde3ef]">
            <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">folder_off</span>
            <p className="text-sm font-bold text-[#001026]">Aucun projet trouvé</p>
            <p className="text-xs text-[#6b7a99] mt-1">Ajustez vos filtres ou créez votre premier projet d'entreprise.</p>
          </div>
        ) : (
          filteredProjects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => handleOpenProject(project)}
              className="bg-white rounded-2xl border border-[#dde3ef] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${STATUS_CONFIG[project.status]?.color || STATUS_CONFIG.PLANNED.color}`}>
                  {STATUS_CONFIG[project.status]?.label || project.status}
                </span>
                
                <button 
                  onClick={(e) => handleAnalyze(project, e)}
                  title="Lancer une analyse diagnostic IA"
                  className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <span className={`material-symbols-outlined text-[16px] ${analyzingProjectId === project.id ? 'animate-spin' : ''}`}>
                    {analyzingProjectId === project.id ? 'sync' : 'auto_awesome'}
                  </span>
                  {analyzingProjectId === project.id ? 'Analyse...' : 'IA Analysis'}
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-[#001026] leading-snug mb-1 group-hover:text-[#004ad1] transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-[#6b7a99] flex items-center gap-1.5 mb-6">
                <span className="material-symbols-outlined text-[16px]">business</span>
                {project.customer_name || 'Client AZ Corporation'}
              </p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7a99] font-medium flex items-center gap-1.5 text-xs">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    {project.tasks_count || 0} Tâche(s) • Progression
                  </span>
                  <span className="font-bold text-[#001026] text-xs">{project.progress || 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#004ad1] rounded-full transition-all duration-500"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-extrabold text-[10px] text-blue-700" title={project.manager_name}>
                      {project.manager_name ? project.manager_name.substring(0, 2).toUpperCase() : 'PM'}
                    </div>
                    <span className="text-[#6b7a99] font-medium text-xs">{project.manager_name || 'Chef de Projet'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-[#6b7a99]">
                    <span className="material-symbols-outlined text-[15px]">event</span>
                    {project.endDate ? new Date(project.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Flexible'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </section>

      {/* ── Modal Détails & Tâches Projet ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001026]/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8"
            >
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${STATUS_CONFIG[selectedProject.status]?.color || STATUS_CONFIG.PLANNED.color}`}>
                    {STATUS_CONFIG[selectedProject.status]?.label || selectedProject.status}
                  </span>
                  <h2 className="text-xl font-black text-[#001026] mt-2">{selectedProject.name}</h2>
                  <p className="text-xs text-[#6b7a99] mt-0.5">{selectedProject.description || 'Pas de description fournie pour ce projet.'}</p>
                </div>
                <button onClick={() => setSelectedProject(null)} className="text-[#6b7a99] hover:text-[#001026] p-1 rounded-lg">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Actions IA Rapide */}
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-purple-600 text-2xl">auto_awesome</span>
                    <div>
                      <p className="text-xs font-bold text-purple-900">Diagnostic Intelligent AZ AI</p>
                      <p className="text-[11px] text-purple-700">Générez une analyse des risques et recommandations basées sur les tâches.</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleAnalyze(selectedProject, e)}
                    disabled={analyzingProjectId === selectedProject.id}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors shrink-0"
                  >
                    {analyzingProjectId === selectedProject.id ? 'Analyse...' : 'Lancer Diagnostic IA'}
                  </button>
                </div>

                {/* Section Tâches */}
                <div>
                  <h3 className="text-sm font-extrabold text-[#001026] uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Tâches du projet ({projectTasks.length})</span>
                  </h3>

                  {canWriteWorkspace && (
                    <form onSubmit={handleCreateTask} className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="Ajouter une nouvelle tâche..." 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-[#001026] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-[#004ad1] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                      >
                        Ajouter
                      </button>
                    </form>
                  )}

                  {loadingTasks ? (
                    <p className="text-xs text-[#6b7a99] py-4 text-center">Chargement des tâches...</p>
                  ) : projectTasks.length === 0 ? (
                    <p className="text-xs text-[#6b7a99] py-4 text-center bg-slate-50 rounded-xl border border-slate-100">Aucune tâche enregistrée pour le moment.</p>
                  ) : (
                    <div className="space-y-2">
                      {projectTasks.map((t) => (
                        <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleToggleTaskStatus(t)}
                              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                t.status === 'DONE' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-slate-400'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </button>
                            <span className={`font-semibold ${t.status === 'DONE' ? 'line-through text-slate-400' : 'text-[#001026]'}`}>
                              {t.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal de création de projet ──────────────────────────────────── */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001026]/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-[#001026]">Nouveau Projet Workspace</h3>
                <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#001026] mb-1">Nom du projet *</label>
                  <input 
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Ex: Migration Cloud Enterprise"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-[#001026] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#001026] mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Objectifs et livrables attendus..."
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-[#001026] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#001026] mb-1">Statut initial</label>
                    <select 
                      value={createForm.status}
                      onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-[#001026] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20"
                    >
                      <option value="PLANNED">Planifié</option>
                      <option value="IN_PROGRESS">En cours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#001026] mb-1">Priorité</label>
                    <select 
                      value={createForm.priority}
                      onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-[#001026] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20"
                    >
                      <option value="LOW">Basse</option>
                      <option value="MEDIUM">Moyenne</option>
                      <option value="HIGH">Haute</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#004ad1] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                  >
                    {submitting ? 'Création...' : 'Créer Projet'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal d'analyse IA ───────────────────────────────────────────── */}
      <AnimatePresence>
        {aiAnalysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001026]/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#001026]">Analyse IA du Projet</h3>
                    <p className="text-xs text-purple-600 font-semibold">{aiAnalysis.project?.name} • Gemini Flash AI Agent</p>
                  </div>
                </div>
                <button onClick={() => setAiAnalysis(null)} className="text-[#6b7a99] hover:text-[#001026] p-2 rounded-lg">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                {aiAnalysis.data?.analysis && (
                  <div>
                    <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-600 text-sm">summarize</span>
                      Synthèse Diagnostic
                    </h4>
                    <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {aiAnalysis.data.analysis}
                    </div>
                  </div>
                )}
                
                {aiAnalysis.data?.risks && aiAnalysis.data.risks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-extrabold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-600 text-sm">warning</span>
                      Risques Détectés ({aiAnalysis.data.risks.length})
                    </h4>
                    <div className="space-y-2">
                      {aiAnalysis.data.risks.map((risk, i) => (
                        <div key={i} className="text-xs text-red-900 bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                          <span className="font-medium">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aiAnalysis.data?.recommendations && aiAnalysis.data.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">lightbulb</span>
                      Recommandations Stratégiques ({aiAnalysis.data.recommendations.length})
                    </h4>
                    <div className="space-y-2">
                      {aiAnalysis.data.recommendations.map((rec, i) => (
                        <div key={i} className="text-xs text-emerald-900 bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                          <span className="font-medium">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceProjects;
