import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchApi } from '../services/api';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'COLLABORATEUR',
    domain: 'Général',
    sendInvite: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Dans une vraie application, on appellerait : fetchApi('/admin/users')
    // Pour l'instant, on simule des données puisqu'on bâtit l'UI de gestion
    setTimeout(() => {
      setUsers([
        { id: '1', firstName: 'Alice', lastName: 'Dupont', email: 'alice@az-corporation.com', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2026-10-03T10:00:00Z' },
        { id: '2', firstName: 'Jean', lastName: 'Martin', email: 'j.martin@az-corporation.com', role: 'COLLABORATEUR', status: 'ACTIVE', lastLogin: '2026-10-02T14:30:00Z' },
        { id: '3', firstName: 'Sophie', lastName: 'Durand', email: 's.durand@az-corporation.com', role: 'APPRENANT', status: 'INACTIVE', lastLogin: null }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulation d'un ajout direct (sans passer par la demande d'accès)
      // await fetchApi('/admin/users', { method: 'POST', body: JSON.stringify(formData) });
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      const newUser = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        status: 'ACTIVE',
        lastLogin: null
      };
      
      setUsers(prev => [newUser, ...prev]);
      setShowAddModal(false);
      toast.success(`Utilisateur ${formData.firstName} ${formData.lastName} créé avec succès.`);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'COLLABORATEUR', domain: 'Général', sendInvite: true });
    } catch (err) {
      toast.error('Erreur lors de la création de l\'utilisateur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-800 border-purple-200',
      'ADMIN': 'bg-red-100 text-red-800 border-red-200',
      'COLLABORATEUR': 'bg-blue-100 text-blue-800 border-blue-200',
      'APPRENANT': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    const style = badges[role] || 'bg-slate-100 text-slate-800 border-slate-200';
    return <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${style}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 mb-3">
            <span className="material-symbols-outlined notranslate text-[14px]">group</span>
            Gestion des Utilisateurs
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Utilisateurs</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium max-w-2xl">
            Gérez les comptes actifs, ajoutez de nouveaux collaborateurs directement et contrôlez l'accès global au système AZ PULSE.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          <span className="material-symbols-outlined notranslate text-[18px]">person_add</span>
          Ajout direct
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl p-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Chargement des utilisateurs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Utilisateur</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Rôle principal</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="font-bold text-slate-800">{user.firstName} {user.lastName}</div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600 font-medium">{user.email}</td>
                    <td className="py-4">{getRoleBadge(user.role)}</td>
                    <td className="py-4">
                      {user.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Inactif
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined notranslate text-[20px]">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative glass-panel w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined notranslate text-[24px]">person_add</span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">Ajouter un utilisateur</h2>
                  <p className="text-xs text-slate-500 font-medium">Création directe d'un compte actif avec attribution de rôle.</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                <span className="material-symbols-outlined notranslate text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Prénom</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Jean" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nom</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Dupont" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Adresse email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="jean.dupont@az-corporation.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Téléphone (Optionnel)</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="+33 6 00 00 00 00" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Rôle attribué</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <option value="COLLABORATEUR">Collaborateur (Standard)</option>
                    <option value="APPRENANT">Apprenant</option>
                    <option value="FORMATEUR">Formateur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Domaine / Pôle</label>
                  <select name="domain" value={formData.domain} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <option value="Général">Général</option>
                    <option value="Direction">Direction Générale</option>
                    <option value="IT">Infrastructure & IT</option>
                    <option value="Commercial">Commercial & CRM</option>
                    <option value="Formation">Pôle Formation</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="sendInvite" checked={formData.sendInvite} onChange={handleInputChange} className="peer sr-only" />
                    <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                    <span className="material-symbols-outlined notranslate text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    Envoyer l'email d'invitation avec le mot de passe temporaire
                  </span>
                </label>
              </div>

              <div className="pt-6 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70">
                  {isSubmitting ? (
                    <span className="material-symbols-outlined notranslate text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined notranslate text-[18px]">check_circle</span>
                  )}
                  {isSubmitting ? 'Création...' : 'Créer l\'utilisateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
