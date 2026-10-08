import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { itService } from '../../../services/api';

const InfrastructureManager = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  // Équipement inspecté dans le tiroir latéral ; `null` signifie « fermé ».
  // Cet état remplace les manipulations de classes `translate-x-full` et
  // `hidden` que faisait le <script> inline, que React n'exécute pas.
  const [selected, setSelected] = useState(null);
  const [computerDetails, setComputerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Le bouton « Synchroniser GLPI » appelle ce même traitement : il émet
  // réellement une requête. Auparavant il ne faisait que faire tourner une
  // icône pendant 1,4 s, sans une seule requête, ce qui laissait croire à une
  // synchronisation effective.
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
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
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (selected && selected.id) {
      setLoadingDetails(true);
      itService.getComputerDetails(selected.id)
        .then(res => {
          if (res.success) setComputerDetails(res.data);
        })
        .finally(() => setLoadingDetails(false));
    } else {
      setComputerDetails(null);
    }
  }, [selected]);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased flex">
<aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div className="flex flex-col"><div className="h-16 px-space-md flex items-center gap-space-sm bg-surface-container-lowest sticky top-0 z-10"><img alt="AZ PULSE_logo.png" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1XqEXkizcdoEtMT8f8RNRDWQIbH-JBSp6UTRn97ZEZHE2WyunDVdrFbMyYUzhmrOWm0SB4UQ6eKZbzUSijcDfqcy0WXgTTkJh0O-xUpAWQR08DEzXxYrFU_wI7oZCwnGVinp8qynFcjVcSp6obcuLOEQonm0MihvHT5a2Ojptf_x7Y3FVhppkms4Ror0JTl7d0n3CYiEuUv-cLkEjtVvCWL3i5XpPxlPWIwNs9vbZMq7DIAqtymf16YRuBLJI6BEsXU1ZW4Kms3"/><div className="flex flex-col"><span className="font-headline-sm text-headline-sm tracking-tight text-primary font-bold leading-tight">AZ PULSE</span><span className="font-label-sm text-label-sm text-secondary font-bold tracking-wider uppercase">INFRA &amp; IT</span></div></div><div className="px-space-md py-space-sm"><nav className="flex flex-col gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-bold rounded-lg shadow-[0_2px_8px_rgba(11,37,69,0.12)]"><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="dashboard" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">dashboard</span><span className="font-label-lg text-label-lg">Dashboard</span></div></a><div className="flex flex-col gap-space-xs"><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-informatique" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">dns</span><span className="font-label-lg text-label-lg">Parc informatique</span></div><span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span></a><div className="flex flex-col pl-space-lg pr-space-xs gap-space-xs"><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-tous-les-equipements" href="#"><span className="font-body-sm text-body-sm">Tous les équipements</span><span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">248</span></a><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-ordinateurs" href="#"><span className="font-body-sm text-body-sm">Ordinateurs</span><span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">124</span></a><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-serveurs" href="#"><span className="font-body-sm text-body-sm">Serveurs</span><span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">12</span></a><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-imprimantes" href="#"><span className="font-body-sm text-body-sm">Imprimantes</span><span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">24</span></a><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-reseau" href="#"><span className="font-body-sm text-body-sm">Réseau</span><span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">31</span></a><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-telephones" href="#"><span className="font-body-sm text-body-sm">Téléphones</span><span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">38</span></a><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-cameras-securite" href="#"><span className="font-body-sm text-body-sm">Caméras &amp; Sécurité</span></a><a className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parc-autres-equipements" href="#"><span className="font-body-sm text-body-sm">Autres équipements</span><span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">19</span></a></div></div><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="incidents" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">warning</span><span className="font-label-lg text-label-lg">Incidents</span></div><span className="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">12 (3 crit.)</span></a><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="maintenance" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">build</span><span className="font-label-lg text-label-lg">Maintenance</span></div><span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">17</span></a><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="licences" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">vpn_key</span><span className="font-label-lg text-label-lg">Licences</span></div></a><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="garanties-et-contrats" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">verified_user</span><span className="font-label-lg text-label-lg">Garanties &amp; contrats</span></div><span className="px-space-xs py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-bold">8 exp.</span></a><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="synchronisation-glpi" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">sync</span><span className="font-label-lg text-label-lg">Synchronisation GLPI</span></div><span className="px-space-xs py-0.5 rounded bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold">OK</span></a><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="analytics" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px]">monitoring</span><span className="font-label-lg text-label-lg">Analytics</span></div></a><a className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="ai-workspace" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-[20px] text-secondary">auto_awesome</span><span className="font-label-lg text-label-lg">AI Workspace</span></div><span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">NEW</span></a></nav></div></div><div className="p-space-md flex flex-col gap-space-sm bg-surface-container-lowest"><div className="flex flex-col gap-space-xs"><a className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="parametres" href="#"><span className="material-symbols-outlined text-[20px]">settings</span><span className="font-label-lg text-label-lg">Paramètres</span></a><a className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="profil-it" href="#"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-lg text-label-lg">Profil IT</span></a></div><div className="p-space-sm rounded-lg bg-surface-container flex items-center gap-space-xs"><span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span><span className="font-label-sm text-label-sm text-on-surface-variant truncate">Agent GLPI / Symfony Sync: 100% OK</span></div></div></aside>
<div className="pl-72 flex flex-col min-h-screen w-full">
<header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-lg flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-md"><img alt="AZ PULSE_logo.png" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1XqEXkizcdoEtMT8f8RNRDWQIbH-JBSp6UTRn97ZEZHE2WyunDVdrFbMyYUzhmrOWm0SB4UQ6eKZbzUSijcDfqcy0WXgTTkJh0O-xUpAWQR08DEzXxYrFU_wI7oZCwnGVinp8qynFcjVcSp6obcuLOEQonm0MihvHT5a2Ojptf_x7Y3FVhppkms4Ror0JTl7d0n3CYiEuUv-cLkEjtVvCWL3i5XpPxlPWIwNs9vbZMq7DIAqtymf16YRuBLJI6BEsXU1ZW4Kms3"/><div className="flex items-center gap-space-xs"><span className="font-headline-sm text-headline-sm text-primary font-bold">AZ PULSE</span><span className="px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wide">INFRASTRUCTURE &amp; IT / GLPI</span></div></div><div className="flex-1 max-w-2xl flex items-center gap-space-sm"><div className="relative flex-1"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-secondary transition-all" placeholder="Recherche globale équipements, serveurs, IP, GLPI ID..." type="text"/></div><div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-secondary-container"></span><span>Passerelle GLPI v10.0.12 : Synchronisé (18/09/2026 20:44)</span></div></div><div className="flex items-center gap-space-md"><button className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold transition-all" type="button"><span className="material-symbols-outlined text-secondary text-[18px]">auto_awesome</span><span className="hidden md:inline">Copilot IT &amp; Audit</span></button><div className="relative flex items-center"><button aria-label="Notifications" className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all relative" type="button"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-1.5 right-1.5 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold leading-none">3</span></button></div><div className="flex items-center gap-space-sm pl-space-xs"><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div className="hidden 2xl:flex flex-col leading-tight"><span className="font-label-sm text-label-sm text-on-surface font-bold">Serge N.</span><span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Responsable Infra &amp; IT</span></div></div></div></header>
<main className="w-full pt-16 bg-surface px-space-lg py-space-lg flex-1">
<div className="flex flex-col w-full gap-space-lg">
{/*  1. HEADER DE SURVEILLANCE & SYNCHRONISATION GLPI  */}
<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg relative overflow-hidden">
<div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none"></div>
<div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg relative z-10">
{/*  Titres et Métadonnées  */}
<div className="flex flex-col gap-space-xs max-w-3xl">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">IT Asset Management</span>
<span className="flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            GLPI ➜ Symfony REST API ➜ AZ Pulse Infra
          </span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">PARC INFORMATIQUE &amp; INFRASTRUCTURE IT</h1>
<p className="font-body-md text-body-md text-on-surface-variant">
          Couche de pilotage opérationnelle unifiée • Source technique centrale : <strong className="text-on-surface font-semibold">GLPI v10.0.12</strong> en cluster multi-sites (Yaoundé • Douala • Paris).
        </p>
</div>
{/*  Bloc Dynamique de Synchro GLPI  */}
<div className="w-full xl:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md p-space-md rounded-xl bg-surface-container-low">
<div className="flex flex-col gap-space-xs min-w-[240px]">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
<span className="font-label-md text-label-md text-primary font-bold">Connecté (Agent REST API)</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Sync: 20:44 (il y a 4 min)</span>
</div>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span className="text-primary font-bold">248</span> totaux <span className="text-outline-variant">•</span>
<span className="text-secondary font-semibold">245</span> synchro <span className="text-outline-variant">•</span>
<span className="text-on-tertiary-container font-semibold">3</span> modifiés <span className="text-outline-variant">•</span>
<span className="text-error font-semibold">2</span> alertes
          </div>
<div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
<div className="h-full rounded-full bg-secondary-container" style={{ width: "98.8%" }}></div>
</div>
</div>
<button className="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-secondary hover:bg-primary-container text-on-secondary font-label-lg text-label-lg transition-all shadow-sm active:scale-95 whitespace-nowrap disabled:opacity-60" type="button" onClick={fetchInventory} disabled={loading}>
<span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>sync</span>
<span>{loading ? 'Synchronisation…' : 'Synchroniser GLPI'}</span>
</button>
</div>
</div>
</section>
{/*  2. RANGÉE DES 6 KPIS IT & ALERTES DE SURVEILLANCE  */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
{/*  KPI 1 : Équipements Totaux  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary">Parc Global</span>
<span className="material-symbols-outlined text-secondary text-[20px]">devices</span>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-primary font-bold">{loading ? "..." : computers.length}</span>
<span className="font-label-sm text-label-sm text-secondary font-semibold">+6 ce mois</span>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-[11px] bg-surface-container-low px-space-xs py-1 rounded">
<span>124 PC</span>
<span>12 Srv</span>
<span>31 Net</span>
<span>24 Imp</span>
</div>
</div>
{/*  KPI 2 : Incidents Ouverts  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-error">Incidents GLPI</span>
<span className="material-symbols-outlined text-error text-[20px]">warning</span>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-error font-bold">12</span>
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">3 critiques</span>
</div>
<div className="mt-space-sm flex items-center gap-space-xs text-on-surface-variant font-body-sm text-[11px]">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span>SLA &lt; 2h : 2 serveurs concernés</span>
</div>
</div>
{/*  KPI 3 : Maintenances Planifiées  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary">Maintenances</span>
<span className="material-symbols-outlined text-primary-container text-[20px]">build_circle</span>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-primary font-bold">17</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">programmées</span>
</div>
<div className="mt-space-sm text-on-surface-variant font-body-sm text-[11px] truncate" title="Prochaine : 20/09 Cluster Yaoundé">
        Prochaine : <span className="font-semibold text-primary">20/09 Yaoundé</span>
</div>
</div>
{/*  KPI 4 : Garanties Expirant <30j  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-tertiary-container">Fin de Garantie</span>
<span className="material-symbols-outlined text-tertiary-fixed-dim text-[20px]">verified_user</span>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-primary font-bold">8</span>
<span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">&lt; 30 jours</span>
</div>
<div className="mt-space-sm text-on-surface-variant font-body-sm text-[11px] truncate">
        5 HP ProBook • 3 Dell Edge
      </div>
</div>
{/*  KPI 5 : Équipements Non Affectés  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary">Stock &amp; Tampon</span>
<span className="material-symbols-outlined text-outline text-[20px]">inventory_2</span>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-primary font-bold">5</span>
<span className="font-label-sm text-label-sm text-secondary font-semibold">prêts</span>
</div>
<div className="mt-space-sm text-on-surface-variant font-body-sm text-[11px] truncate">
        Non affectés / Disponibles
      </div>
</div>
{/*  KPI 6 : Inventaires Non Récents  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant">Agent Stale</span>
<span className="material-symbols-outlined text-outline text-[20px]">sync_problem</span>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-on-surface-variant font-bold">11</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">&gt; 45 jours</span>
</div>
<div className="mt-space-sm text-on-surface-variant font-body-sm text-[11px] truncate">
        Absence ping GLPI Agent
      </div>
</div>
</section>
{/*  3. BANDEAU D'INTELLIGENCE ARTIFICIELLE & AUDIT PRÉDICTIF IT  */}
<section className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
<div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>
<div className="flex items-start gap-space-md z-10">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 backdrop-blur flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-tertiary-fixed-dim text-[24px]">auto_awesome</span>
</div>
<div className="flex flex-col gap-0.5">
<div className="flex items-center gap-space-xs flex-wrap">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary-fixed font-bold">Copilot IT &amp; Recommandation Prédictive (FastAPI / Qdrant)</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-lowest/15 text-[10px] font-mono tracking-wide">Confidence 94.2%</span>
</div>
<p className="font-body-md text-body-md text-surface-bright">
          « 3 postes de travail <strong className="text-on-primary font-semibold">HP ProBook 650 G4</strong> montrent une dérive thermique anormale (&gt;78°C idle) couplée à un TCO élevé. <span className="text-primary-fixed">Recommandation : Planifier le renouvellement contractuel avant expiration garantie au 15/10/2026.</span> »
        </p>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0 z-10 w-full md:w-auto justify-end">
<button className="px-space-sm py-2 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-md text-label-md transition-all" type="button">
        Filtrer les 3 équipements
      </button>
<button className="px-space-md py-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim font-label-md text-label-md font-bold transition-all shadow-sm flex items-center gap-1.5" type="button">
<span className="material-symbols-outlined text-[18px]">psychology</span>
        Auditer le parc
      </button>
</div>
</section>
{/*  4. BARRE D'OUTILS, RECHERCHE ET FILTRES RAPIDES GLPI  */}
<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-md">
{/*  Ligne supérieure : Recherche & Actions  */}
<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
{/*  Search input dense  */}
<div className="relative flex-1">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input className="w-full h-11 pl-10 pr-12 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-secondary transition-all" placeholder="Rechercher par ID GLPI (#4202), Nom (SRV-PROD), N° Série, UUID, Fabricant, Utilisateur..." type="text" />
<span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-mono">⌘K</span>
</div>
{/*  Action buttons  */}
<div className="flex items-center gap-space-xs flex-wrap justify-end">
<button className="flex items-center gap-1 px-space-sm py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all" type="button">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">view_column</span>
<span>Colonnes (28)</span>
</button>
<button className="flex items-center gap-1 px-space-sm py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all" type="button">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">download</span>
<span>Exporter CSV / XML</span>
</button>
<button className="flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-secondary hover:bg-primary-container text-on-secondary font-label-md text-label-md font-bold transition-all shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">add_circle</span>
<span>Déclarer équipement</span>
</button>
</div>
</div>
{/*  Ligne inférieure : Filtres GLPI  */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs">
<select className="h-9 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Type : Tous (248)</option>
<option>Ordinateurs (124)</option>
<option>Serveurs (12)</option>
<option>Imprimantes (24)</option>
<option>Réseau (31)</option>
<option>Téléphones (38)</option>
</select>
<select className="h-9 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Fabricant : Tous</option>
<option>HP Inc.</option>
<option>Dell Technologies</option>
<option>Cisco Systems</option>
<option>Apple</option>
<option>Lenovo</option>
<option>Ubiquiti</option>
</select>
<select className="h-9 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>État : Tous</option>
<option>En production</option>
<option>Incident critique</option>
<option>En maintenance</option>
<option>En stock tampon</option>
<option>Réformé / Archivé</option>
</select>
<select className="h-9 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Affectation : Tous</option>
<option>Assigné nominativement</option>
<option>Non affecté (Stock)</option>
<option>Département Ventes</option>
<option>Département Infra &amp; Dev</option>
</select>
<select className="h-9 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Localisation : Toutes</option>
<option>Yaoundé - Siège (Biyem-Assi)</option>
<option>Yaoundé - Data Center R+1</option>
<option>Douala - Agence Port</option>
<option>Datacenter Paris (Cloud)</option>
</select>
<select className="h-9 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Inventaire : Récent (&lt; 7j)</option>
<option>Tous les intervalles</option>
<option>Stale (&gt; 45j)</option>
<option>Jamais inventorié</option>
</select>
</div>
</section>
{/*  5. TABLEAU DENSE PRINCIPAL AVEC LIGNES INTERACTIVES & TIROIR DÉPLIÉ  */}
<section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
{/*  Table Header  */}
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none">
<th className="py-3 px-3 w-12 text-center"></th>
<th className="py-3 px-3 w-36">État</th>
<th className="py-3 px-4 min-w-[200px]">Nom d'Équipement (NAME)</th>
<th className="py-3 px-3 min-w-[140px]">Type GLPI</th>
<th className="py-3 px-4 min-w-[170px]">Fabricant &amp; Modèle</th>
<th className="py-3 px-4 min-w-[190px]">N° Série • UUID</th>
<th className="py-3 px-4 min-w-[220px]">Utilisateur • Affectation</th>
<th className="py-3 px-3 min-w-[170px]">Localisation</th>
<th className="py-3 px-3 min-w-[150px]">Dernier Inventaire</th>
<th className="py-3 px-3 w-28 text-right">Actions</th>
</tr>
</thead>

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
            <span className={`material-symbols-outlined text-[18px] text-secondary transition-transform ${expandedId === comp.id ? 'rotate-90' : ''}`}>chevron_right</span>
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
            <button onClick={() => setSelected(comp)} className="text-left font-label-lg text-label-lg text-secondary hover:text-primary-container font-bold flex items-center gap-1 group" type="button">
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
</table>
</div>
{/*  8. PAGINATION & FOOTER DE SYNCHRONISATION  */}
<div className="flex flex-col md:flex-row items-center justify-between p-space-md bg-surface-container-low gap-space-md">
<div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm">
<span>Affichage de <strong className="text-on-surface">1 à 5</strong> sur <strong className="text-on-surface">248 équipements</strong></span>
<div className="hidden sm:flex items-center gap-space-xs text-[11px]">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>10 par page</span>
</div>
</div>
{/*  Pagination Buttons  */}
<div className="flex items-center gap-1">
<button className="px-space-sm py-1.5 rounded bg-surface-container-high text-on-surface-variant/40 font-label-sm text-label-sm font-bold cursor-not-allowed" disabled="" type="button">
          Précédent
        </button>
<button className="w-8 h-8 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center shadow-sm" type="button">
          1
        </button>
<button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center" type="button">
          2
        </button>
<button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center" type="button">
          3
        </button>
<span className="px-1 text-on-surface-variant">...</span>
<button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center" type="button">
          25
        </button>
<button className="px-space-sm py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold" type="button">
          Suivant
        </button>
</div>
</div>
</section>
{/*  NOTE D'ARCHITECTURE SOUS LE TABLEAU  */}
<footer className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">schema</span>
<p>
<strong className="text-primary font-semibold">Frontière d'architecture :</strong> GLPI v10.0.12 demeure la source de vérité opérationnelle pour l'inventaire matériel brut, les agents locaux et les découvertes réseau. <strong className="text-secondary font-semibold">AZ PULSE</strong> intègre la couche de gouvernance décisionnelle, le pilotage financier unifié, l'analyse prédictive d'obsolescence et le découplage via microservices d'automatisation ITIL.
    </p>
</footer>
</div>
</main>
{/*  7. PANNEAU LATÉRAL COULISSANT (SIDE DRAWER D'INSPECTION D'ÉQUIPEMENT)  */}
<div className={`fixed inset-y-0 right-0 w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-hidden ${selected ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={selected ? 'false' : 'true'}>
{/*  Drawer Header  */}
<div className="p-space-md bg-primary-container text-on-primary flex items-start justify-between gap-space-sm shadow-md">
<div className="flex flex-col gap-0.5">
<div className="flex items-center gap-space-xs">
<span className="px-1.5 py-0.5 rounded bg-surface-container-lowest/15 text-[10px] font-mono font-bold text-tertiary-fixed">GLPI #{selected?.id ?? '—'}</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-label-sm font-semibold">{selected?.state?.name ?? selected?.states_id ?? 'État non renseigné'}</span>
</div>
<h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-primary mt-1">{selected?.name ?? 'Aucun équipement sélectionné'}</h2>
<span className="font-body-sm text-body-sm text-primary-fixed">{selected?.computertype?.name ?? selected?.computertypes_id ?? 'Type non renseigné'}</span>
</div>
<button className="p-2 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary transition-all" onClick={() => setSelected(null)} type="button">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/*  Drawer Internal Tabs  */}
<div className="flex items-center bg-surface-container-low px-space-md border-b-0 overflow-x-auto">
<button className="py-2.5 px-space-sm font-label-md text-label-md font-bold text-secondary border-b-2 border-secondary whitespace-nowrap" type="button">Vue d'ensemble</button>
<button className="py-2.5 px-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface whitespace-nowrap" type="button">Composants &amp; OS</button>
<button className="py-2.5 px-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface whitespace-nowrap flex items-center gap-1" type="button">
<span>Incidents</span>
<span className="px-1.5 py-0.2 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">1</span>
</button>
<button className="py-2.5 px-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface whitespace-nowrap" type="button">Historique GLPI</button>
<button className="py-2.5 px-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface whitespace-nowrap" type="button">Maintenance</button>
</div>
{/*  Drawer Scrollable Content Body  */}
<div className="p-space-lg flex-1 overflow-y-auto flex flex-col gap-space-lg">
{/*  Status Synthèse Box  */}
<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Synchronisation Télémétrique</span>
<span className="flex items-center gap-1 text-[11px] text-secondary font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            Agent v1.5 Actif
          </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Inventaire consolidé le 18/09/2026 à 20:12:44. Hash d'intégrité SHA256 vérifié par l'agent local.
        </p>
</div>
{/*  Spécifications Matérielles Détaillees  */}
<div className="flex flex-col gap-space-xs">
<span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">format_h4</span>
          Spécifications (GLPI natif)
        </span>
<div className="grid grid-cols-2 gap-space-xs text-[12px] bg-surface-container-low p-space-sm rounded-lg">
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase font-bold">Fabricant</span>
<span className="font-semibold text-primary">{selected?.manufacturers_id || 'N/A'}</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant text-[10px] uppercase font-bold">Modèle</span>
<span className="font-semibold text-primary">{selected?.computermodels_id || 'N/A'}</span>
</div>
<div className="flex flex-col mt-2">
<span className="text-on-surface-variant text-[10px] uppercase font-bold">Numéro de Série</span>
<span className="font-semibold text-primary">{selected?.serial || 'N/A'}</span>
</div>
<div className="flex flex-col mt-2">
<span className="text-on-surface-variant text-[10px] uppercase font-bold">UUID</span>
<span className="font-semibold text-primary">{selected?.uuid || 'N/A'}</span>
</div>
<div className="flex flex-col mt-2">
<span className="text-on-surface-variant text-[10px] uppercase font-bold">Dernier Démarrage</span>
<span className="font-semibold text-primary">{selected?.last_boot || 'N/A'}</span>
</div>
<div className="flex flex-col mt-2">
<span className="text-on-surface-variant text-[10px] uppercase font-bold">Dernier Inventaire</span>
<span className="font-semibold text-primary">{selected?.last_inventory_update || 'N/A'}</span>
</div>
</div>
</div>
{/* Composants Détaillés Lazy-Loaded */}
<div className="flex flex-col gap-space-xs">
  <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
    <span className="material-symbols-outlined text-secondary text-[18px]">memory</span>
    Composants Internes (Lazy Loaded)
  </span>
  <div className="bg-surface-container-low p-space-sm rounded-lg min-h-[100px] flex flex-col justify-center">
    {loadingDetails ? (
      <div className="flex flex-col items-center justify-center py-4 gap-2">
        <span className="material-symbols-outlined text-secondary animate-spin">progress_activity</span>
        <span className="text-[11px] text-on-surface-variant font-medium">Chargement à chaud depuis GLPI...</span>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm text-[12px]">
        <div className="flex flex-col">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold">Processeurs ({computerDetails?.processor?.length || 0})</span>
          {computerDetails?.processor?.map((p, i) => (
             <span key={i} className="font-semibold text-primary truncate" title={p.designation || p.deviceprocessors_id || 'CPU inconnu'}>{p.designation || p.deviceprocessors_id || 'CPU inconnu'}</span>
          ))}
          {!computerDetails?.processor?.length && <span className="text-on-surface-variant italic">Non renseigné</span>}
        </div>
        
        <div className="flex flex-col">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold">Mémoire Vive ({computerDetails?.memory?.length || 0})</span>
          {computerDetails?.memory?.map((m, i) => (
             <span key={i} className="font-semibold text-primary truncate">{m.designation || m.devicememories_id || (m.size ? `${m.size} MB` : 'RAM inconnue')}</span>
          ))}
          {!computerDetails?.memory?.length && <span className="text-on-surface-variant italic">Non renseigné</span>}
        </div>

        <div className="flex flex-col mt-2">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold">Système d'Exploitation</span>
          {computerDetails?.os?.map((o, i) => (
             <span key={i} className="font-semibold text-primary truncate">{o.name || o.operatingsystems_id || 'OS inconnu'}</span>
          ))}
          {!computerDetails?.os?.length && <span className="text-on-surface-variant italic">Non renseigné</span>}
        </div>

        <div className="flex flex-col mt-2">
          <span className="text-on-surface-variant text-[10px] uppercase font-bold">Stockage ({computerDetails?.harddrive?.length || 0})</span>
          {computerDetails?.harddrive?.map((h, i) => (
             <span key={i} className="font-semibold text-primary truncate">{h.designation || (h.capacity ? `${h.capacity} MB` : 'Disque inconnu')}</span>
          ))}
          {!computerDetails?.harddrive?.length && <span className="text-on-surface-variant italic">Non renseigné</span>}
        </div>
      </div>
    )}
  </div>
</div>
{/*  Bloc Affectation GLPI  */}
<div className="flex flex-col gap-space-xs">
<span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">badge</span>
          Affectation GLPI
        </span>
<div className="flex items-center gap-space-md p-space-sm rounded-lg bg-surface-container-low">
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
            {selected?.contact ? selected.contact.substring(0, 2).toUpperCase() : 'NA'}
          </div>
<div className="flex flex-col">
<span className="font-label-lg text-label-lg font-bold text-primary">{selected?.contact || 'Non assigné'}</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">{selected?.locations_id || 'Localisation non définie'}</span>
<span className="text-[11px] text-secondary font-semibold">Contact: {selected?.contact_num || 'N/A'}</span>
</div>
</div>
</div>
{/*  Incident Actif Lié  */}
<div className="flex flex-col gap-space-xs">
<span className="font-label-md text-label-md font-bold text-error flex items-center gap-1.5">
<span className="material-symbols-outlined text-error text-[18px]">warning</span>
          Incident Actif Déclaré (1)
        </span>
<div className="p-space-sm rounded-lg bg-error-container/40 flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-on-error-container">#INC-1092 • Batterie dégradée</span>
<span className="px-1.5 py-0.5 rounded bg-error text-on-error text-[10px] font-bold">En cours</span>
</div>
<p className="font-body-sm text-body-sm text-on-error-container">
            Capacité mesurée à 62% • Autonomie restante estimée : 1h15. Commande batterie HP OEM réf. HSTNN-DB8E en attente de réception.
          </p>
</div>
</div>
</div>
{/*  Drawer Actions Footer  */}
<div className="p-space-md bg-surface-container-low flex flex-col gap-space-xs shadow-lg">
<div className="flex items-center gap-space-xs">
<a className="flex-1 py-2.5 px-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-all text-center" href="#">
<span className="material-symbols-outlined text-[18px]">open_in_new</span>
<span>Ouvrir GLPI Natif</span>
</a>
<button className="flex-1 py-2.5 px-space-sm rounded-lg bg-secondary hover:bg-primary-container text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-all" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
<span>Déclarer Incident</span>
</button>
</div>
<button className="w-full py-2 px-space-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5" type="button">
<span className="material-symbols-outlined text-[18px]">build</span>
<span>Planifier Intervention Matérielle</span>
</button>
</div>
</div>
{/*  Overlay d'arrière-plan pour le tiroir  */}
<div className={`fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSelected(null)}></div>
</div>
</div>
    );
};

export default InfrastructureManager;
