new_content = """import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { roleService } from '../services/api';

export default function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [localPermissions, setLocalPermissions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await roleService.list();
      setRoles(res.data.roles);
      setPermissions(res.data.permissions);
    } catch (err) {
      toast.error('Erreur lors du chargement des rôles et permissions.');
    } finally {
      setLoading(false);
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {});

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setLocalPermissions(role.permissions || []);
  };

  const handleTogglePermission = (permCode) => {
    setLocalPermissions((prev) => {
      if (prev.includes(permCode)) {
        return prev.filter((p) => p !== permCode);
      } else {
        return [...prev, permCode];
      }
    });
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    
    setSaving(true);
    try {
      await roleService.updatePermissions(selectedRole.id, localPermissions);
      toast.success(`Les permissions pour ${selectedRole.label} ont été mises à jour.`);
      
      setRoles((prevRoles) => 
        prevRoles.map((r) => 
          r.id === selectedRole.id ? { ...r, permissions: localPermissions } : r
        )
      );
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] gap-6 overflow-hidden">
      {/* SECTION CENTRALE : MATRICE (Scrollable) */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100">
        {!selectedRole ? (
          // PLACEHOLDER ANIMÉ
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-pulse">
            <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-[48px]">security</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Matrice RBAC & Gouvernance Granulaire des Privilèges
            </h2>
            <p className="mt-3 text-slate-500 font-medium max-w-md">
              Sélectionnez un rôle dans la barre latérale à droite pour visualiser et configurer ses permissions.
            </p>
          </div>
        ) : (
          // MATRICE DU ROLE SELECTIONNÉ SOUS FORME DE TABLEAU
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Permissions : <span className="text-secondary">{selectedRole.label}</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">{selectedRole.description}</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saving || selectedRole.code === 'SUPER_ADMIN'}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-white font-bold text-sm shadow-md shadow-secondary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">save</span>
                )}
                Enregistrer
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {selectedRole.code === 'SUPER_ADMIN' && (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-500">warning</span>
                  <div>
                    <strong className="block font-bold">Droits inaltérables</strong>
                    <span className="text-sm font-medium">Les permissions du Super Administrateur ne peuvent pas être révoquées depuis cette interface.</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                  <div key={moduleName} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-4 px-5 font-bold text-slate-800 text-sm whitespace-nowrap bg-slate-50/80 sticky left-0 z-10 border-r border-slate-100">
                              {moduleName}
                            </th>
                            {perms.map(perm => (
                              <th key={perm.code} className="py-4 px-5 font-bold text-slate-600 text-xs text-center">
                                {perm.description}
                                <div className="text-[10px] text-slate-400 font-mono font-normal mt-1">{perm.code}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-5 px-5 font-bold text-slate-700 text-sm whitespace-nowrap bg-white sticky left-0 z-10 border-r border-slate-100">
                              {selectedRole.label}
                            </td>
                            {perms.map(perm => (
                              <td key={perm.code} className="py-5 px-5 text-center">
                                <label className="inline-flex items-center justify-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    disabled={selectedRole.code === 'SUPER_ADMIN'}
                                    checked={selectedRole.code === 'SUPER_ADMIN' ? true : localPermissions.includes(perm.code)}
                                    onChange={() => handleTogglePermission(perm.code)}
                                    className="w-5 h-5 rounded border-slate-300 text-secondary focus:ring-secondary/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                </label>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BARRE LATERALE DROITE : LISTE DES ROLES */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">shield_person</span>
            Rôles Systèmes
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Sélectionnez un rôle pour gérer ses accès.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {roles.map(role => {
            const isSelected = selectedRole?.id === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleClick(role)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  isSelected 
                  ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20' 
                  : 'bg-white text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm">{role.label}</div>
                <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-secondary-fixed' : 'text-slate-500'}`}>
                  {role.permissions.length} privilèges
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"""

open('frontend/src/pages/RolesPermissions.jsx', 'w', encoding='utf-8').write(new_content)
