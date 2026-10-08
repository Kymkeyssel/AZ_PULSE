const fs = require('fs');

const file = 'h:/PROJETS/VS_Projects/L3_LICENCE_ING/AZ_PULSE/frontend/src/features/collaborateur/pages/InfrastructureManager.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';\nimport { itService } from '../../../services/api';");

// Add state and fetch logic
const stateLogic = `
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await itService.getComputers();
        if (response.success) {
          setComputers(response.data);
        } else {
          setError(response.message || 'Erreur API');
        }
      } catch (err) {
        setError(err.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
`;

content = content.replace("const InfrastructureManager = () => {", "const InfrastructureManager = () => {" + stateLogic);

// Replace tbody
const tbodyStart = content.indexOf('<tbody className="font-body-sm text-body-sm text-on-surface divide-y-0">');
const tableEnd = content.indexOf('</table>');

if (tbodyStart > -1 && tableEnd > -1) {
  const dynamicTbody = `
<tbody className="font-body-sm text-body-sm text-on-surface divide-y-0">
  {loading && (
    <tr>
      <td colSpan="10" className="py-8 text-center text-on-surface-variant">Chargement de l'inventaire GLPI...</td>
    </tr>
  )}
  {error && (
    <tr>
      <td colSpan="10" className="py-8 text-center text-error">Erreur: {error}</td>
    </tr>
  )}
  {!loading && !error && computers.length === 0 && (
    <tr>
      <td colSpan="10" className="py-8 text-center text-on-surface-variant">Aucun équipement trouvé.</td>
    </tr>
  )}
  {!loading && !error && computers.map((comp) => (
    <React.Fragment key={comp.id}>
      <tr className="hover:bg-surface-container-low/60 transition-colors bg-surface-container-low/30">
        <td className="py-3 px-3 text-center">
          <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container transition-all" onClick={() => toggleAccordion(comp.id)} type="button">
            <span className={\`material-symbols-outlined text-[18px] text-secondary transition-transform \${expandedId === comp.id ? 'rotate-90' : ''}\`}>chevron_right</span>
          </button>
        </td>
        <td className="py-3 px-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            {comp.states_id || 'En production'}
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="flex flex-col">
            <button className="text-left font-label-lg text-label-lg text-secondary hover:text-primary-container font-bold flex items-center gap-1 group" type="button">
              <span>{comp.name || 'Sans nom'}</span>
              <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
            </button>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="px-1 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-mono">GLPI #{comp.id}</span>
            </div>
          </div>
        </td>
        <td className="py-3 px-3">
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-semibold">
            {comp.computertypes_id || 'Ordinateur'}
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="font-semibold text-primary">{comp.manufacturers_id || 'N/A'}</div>
          <div className="text-on-surface-variant text-[11px]">{comp.computermodels_id || 'N/A'}</div>
        </td>
        <td className="py-3 px-4 font-mono text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-primary font-semibold">{comp.serial || 'N/A'}</span>
          </div>
          <div className="text-on-surface-variant truncate max-w-[150px]">{comp.otherserial}</div>
        </td>
        <td className="py-3 px-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-primary">{comp.contact || 'N/A'}</span>
              <span className="px-1 py-0.2 rounded bg-primary-fixed text-on-primary-fixed text-[9px] font-bold">GLPI</span>
            </div>
          </div>
        </td>
        <td className="py-3 px-3 text-on-surface-variant text-[12px]">
          <div className="font-semibold text-primary">{comp.locations_id || 'Non assigné'}</div>
        </td>
        <td className="py-3 px-3">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span>
            <span className="font-semibold">{comp.date_mod ? new Date(comp.date_mod).toLocaleDateString() : 'N/A'}</span>
          </div>
        </td>
        <td className="py-3 px-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-secondary" type="button">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>
        </td>
      </tr>
      {expandedId === comp.id && (
        <tr className="bg-surface-container/60">
          <td className="p-space-md" colSpan="10">
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm bg-surface-container-low/40 p-space-sm rounded-lg">
                <div className="flex items-center gap-space-sm">
                  <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-mono text-[11px] font-bold">FICHE TECHNIQUE GLPI NATIVE #{comp.id}</span>
                  <span className="font-label-md text-label-md font-bold text-primary">{comp.name}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
                    <span>Identifiants</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <span className="text-on-surface-variant">ID GLPI natif :</span>
                    <span className="font-mono font-bold text-primary">#{comp.id}</span>
                    <span className="text-on-surface-variant">N° Inventaire (OTHER) :</span>
                    <span className="font-mono text-on-surface font-semibold">{comp.otherserial}</span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
`;
  content = content.substring(0, tbodyStart) + dynamicTbody + content.substring(tableEnd);
}

// Also update KPIs with dynamic variables
content = content.replace('<span className="font-headline-xl text-headline-xl text-primary font-bold">248</span>', '<span className="font-headline-xl text-headline-xl text-primary font-bold">{loading ? "..." : computers.length}</span>');

content = content.replace(/onclick=/g, 'onClick=');

fs.writeFileSync(file, content);
console.log('Successfully updated InfrastructureManager.jsx');
