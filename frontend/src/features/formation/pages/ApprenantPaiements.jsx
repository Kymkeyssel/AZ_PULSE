import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { academyService } from '../../../services/api';

export const ApprenantPaiements = () => {
  const { data } = useOutletContext();
  const financial = data?.financial || {};
  const program = data?.program || {};
  
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('uploading');
      
      try {
        const response = await academyService.uploadDocument(file, 'tuition');
        
        if (response.filename) {
          setUploadStatus('success');
          alert("Document téléversé avec succès !");
        } else {
          throw new Error("Erreur serveur");
        }
      } catch (err) {
        console.error(err);
        setUploadStatus('idle');
        alert("Échec du téléversement");
      }
    }
  };

  const handleDownload = () => {
    window.open('http://localhost:8000/api/dashboard/apprenant/download/attestation.pdf', '_blank');
  };

  const amountPaid = financial.totalAmount !== undefined ? (financial.totalAmount - financial.remainingBalance) : 450000;
  const coveragePercent = financial.totalAmount ? Math.round((amountPaid / financial.totalAmount) * 100) : 75;

  return (
    <div className="flex-1 pb-10">
      <div className="flex flex-col w-full">

<div className="px-8 py-8 space-y-8 max-w-7xl mx-auto w-full">
{/*  1. En-tête Administratif et Actions Rapides  */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
<div className="space-y-1.5 max-w-2xl">
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm uppercase tracking-wider">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Comptabilité &amp; Scolarité
          </span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Matricule: #AZP-APP-2025-88</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
          Gestion Financière, Échéancier de Scolarité &amp; Justificatifs
        </h1>
<p className="font-body-md text-body-md text-on-surface-variant">
          Suivi en temps réel des tranches de paiement, téléversement de bordereaux bancaires avec validation instantanée et quittances officielles certifiées MINEFOP.
        </p>
</div>
<div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
<button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container transition-all text-label-lg font-label-lg font-semibold active:scale-95" onClick={() => document.getElementById('ocr-upload-section').scrollIntoView({behavior: 'smooth'})} type="button">
<span className="material-symbols-outlined notranslate text-[20px] text-secondary">document_scanner</span>
<span className="">Téléverser un bordereau</span>
</button>

<button onClick={handleDownload} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors text-label-md font-label-md font-medium" title="Télécharger l'attestation de scolarité à jour" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">verified</span>
<span className="hidden sm:inline">Attestation solde</span>
</button>
</div>
</div>
{/*  2. Synthèse Financière (KPI Metrics Cards)  */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
{/*  Total Scolarité  */}
<div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="absolute right-0 top-0 w-24 h-24 bg-primary-container/5 rounded-bl-full pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">Scolarité Annuelle</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
<span className="material-symbols-outlined notranslate text-[18px]">account_balance</span>
</div>
</div>
<div className="mt-4">
<div className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">{financial.totalAmount || "600 000"} <span className="font-headline-sm text-headline-sm font-semibold text-on-surface-variant">FCFA</span></div>
<div className="mt-2 flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined notranslate text-[15px] text-secondary">workspace_premium</span>
<span className="">{program.promotionName || "Développeur Fullstack & IA"}</span>
</div>
</div>
<div className="mt-4 pt-3 bg-surface-container-low rounded-lg px-2.5 py-1.5 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">Cycle académique</span>
<span className="font-semibold text-on-surface">2025 - 2026</span>
</div>
</div>
{/*  Montant Réglé  */}
<div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="absolute right-0 top-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">Montant Total Réglé</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
            {financial.paidTranches !== undefined ? `${financial.paidTranches}/${financial.totalTranches}` : "3/4"} Tranches
          </span>
</div>
<div className="mt-4">
<div className="font-headline-xl text-headline-xl text-secondary font-extrabold tracking-tight">{amountPaid} <span className="font-headline-sm text-headline-sm font-semibold text-on-surface-variant">FCFA</span></div>
<div className="mt-2 space-y-1.5">
<div className="flex justify-between items-center font-label-sm text-label-sm">
<span className="text-on-surface-variant font-medium">Couverture des frais</span>
<span className="font-bold text-secondary">{coveragePercent}%</span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
<div className="h-full bg-secondary rounded-full transition-all duration-700" style={{"width":`${coveragePercent}%`}}></div>
</div>
</div>
</div>
<div className="mt-4 pt-3 flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">verified_user</span>
<span className="">Dernier virement validé</span>
</div>
</div>
{/*  Solde Restant Dû  */}
<div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-fixed/30 rounded-bl-full pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">Solde Restant Dû</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
            Échéance finale
          </span>
</div>
<div className="mt-4">
<div className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">{financial.remainingBalance || "150 000"} <span className="font-headline-sm text-headline-sm font-semibold text-on-surface-variant">FCFA</span></div>
<div className="mt-2 flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined notranslate text-[16px] text-tertiary-container">schedule</span>
<span className="">Tranche {financial.paidTranches ? financial.paidTranches + 1 : 4} • Échéance : <strong>{financial.nextDeadline || "15 Janvier 2026"}</strong></span>
</div>
</div>
<div className="mt-4 pt-3 flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant">Délai restant</span>
<span className="font-label-md text-label-md font-bold text-tertiary-container bg-tertiary-fixed/40 px-2 py-0.5 rounded">{financial.nextDeadline ? "A venir" : "45 jours"}</span>
</div>
</div>
{/*  Statut Dossier Financier  */}
<div className="p-5 rounded-xl bg-primary-container text-on-primary shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-primary-fixed uppercase tracking-wider">Statut Comptable</span>
<div className="w-7 h-7 rounded-full bg-surface-container-lowest/10 flex items-center justify-center">
<span className="material-symbols-outlined notranslate text-[18px] text-tertiary-fixed-dim">shield</span>
</div>
</div>
<div className="mt-4">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md mb-2">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
<span className="font-label-md text-label-md font-semibold text-on-primary">En règle / Conforme</span>
</div>
<p className="font-body-sm text-body-sm text-on-primary-container mt-1">
            Aucun arriéré constaté. Accès total maintenu à la plateforme, aux laboratoires &amp; examens officiels.
          </p>
</div>
<div className="mt-4 pt-3 flex items-center justify-between font-label-sm text-label-sm text-primary-fixed-dim bg-surface-container-lowest/5 rounded-lg px-2.5 py-1.5">
<span className="">Direction Administrative</span>
<span className="font-semibold text-on-primary flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px] text-tertiary-fixed-dim">verified</span> Validé
          </span>
</div>
</div>
</div>
{/*  3. Module OCR & Echéancier Prévisionnel (2 colonnes asymétriques)  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
{/*  Échéancier Prévisionnel des Tranches (7 colonnes)  */}
<div className="xl:col-span-7 space-y-5">
<div className="flex items-center justify-between">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary font-bold">Échéancier des Tranches</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Détail des 4 termes contractuels de l'année académique</p>
</div>
<span className="font-label-sm text-label-sm px-2.5 py-1 bg-surface-container-high rounded-full font-semibold text-on-surface-variant">
            Année 2025 - 2026
          </span>
</div>
<div className="space-y-3.5">
{/*  Tranche 1  */}
<div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div className="flex items-start gap-3.5">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
<span className="material-symbols-outlined notranslate text-[20px]">check_circle</span>
</div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline-sm text-headline-sm font-bold text-primary">Tranche 1 • Inscription</h3>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Frais de dossier inclus</span>
</div>
<div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
<span className="">Date limite : 05 Sept. 2025</span>
<span className="text-secondary font-mono text-[11px] font-semibold">Réf : #AZP-2025-0120</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
<span className="font-headline-md text-headline-md font-bold text-primary">100 000 <span className="font-label-sm text-label-sm font-normal text-on-surface-variant">FCFA</span></span>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold mt-0.5">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Payé &amp; Encaissé
              </span>
</div>
</div>
{/*  Tranche 2  */}
<div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div className="flex items-start gap-3.5">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
<span className="material-symbols-outlined notranslate text-[20px]">check_circle</span>
</div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline-sm text-headline-sm font-bold text-primary">Tranche 2 • Pôle Technique</h3>
</div>
<div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
<span className="">Date limite : 15 Oct. 2025</span>
<span className="text-secondary font-mono text-[11px] font-semibold">Réf : #AZP-2025-0451</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
<span className="font-headline-md text-headline-md font-bold text-primary">175 000 <span className="font-label-sm text-label-sm font-normal text-on-surface-variant">FCFA</span></span>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold mt-0.5">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Payé &amp; Encaissé
              </span>
</div>
</div>
{/*  Tranche 3  */}
<div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div className="flex items-start gap-3.5">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
<span className="material-symbols-outlined notranslate text-[20px]">check_circle</span>
</div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline-sm text-headline-sm font-bold text-primary">Tranche 3 • Spécialisation IA</h3>
</div>
<div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
<span className="">Date limite : 30 Nov. 2025</span>
<span className="text-secondary font-mono text-[11px] font-semibold">Réf : #AZP-2025-0988</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
<span className="font-headline-md text-headline-md font-bold text-primary">175 000 <span className="font-label-sm text-label-sm font-normal text-on-surface-variant">FCFA</span></span>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold mt-0.5">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Payé &amp; Encaissé
              </span>
</div>
</div>
{/*  Tranche 4 (Active / Reste à régler)  */}
<div className="p-5 rounded-xl bg-surface-container-lowest shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
<div className="flex items-start gap-3.5 pl-1.5">
<div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center flex-shrink-0 mt-0.5">
<span className="material-symbols-outlined notranslate text-[20px]">pending_actions</span>
</div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline-sm text-headline-sm font-bold text-primary">Tranche 4 • Finalisation &amp; Jury MINEFOP</h3>
<span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/60 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">À solder</span>
</div>
<div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface font-body-sm text-body-sm">
<span className="font-medium text-error">Date limite impérative : 15 Janvier 2026</span>
<span className="text-on-surface-variant">Échéance finale</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
<span className="font-headline-md text-headline-md font-extrabold text-primary">150 000 <span className="font-label-sm text-label-sm font-normal text-on-surface-variant">FCFA</span></span>
<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-label-md text-label-md font-semibold"><span className="material-symbols-outlined notranslate text-[16px]">hourglass_empty</span><span className="">En attente de versement</span></div>
</div>
</div>
</div>
{/*  Coordonnées Bancaires AZ Corp SARL  */}
<div className="p-5 rounded-xl bg-surface-container-low space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined notranslate text-secondary text-[20px]">account_balance</span>
<span className="font-headline-sm text-headline-sm font-bold text-primary">Coordonnées Bancaires Officielles • AZ Corporation SARL</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Agrément MINEFOP Nº 00294</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Pour tout versement au guichet ou virement bancaire, veuillez <strong>impérativement</strong> indiquer en libellé : <code className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono font-bold">AZP-APP-2025-88 / Jean-Marc E.</code>
</p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
<div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-primary">BICEC Cameroun</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Compte Principal</span>
</div>
<div className="mt-1 text-on-surface font-mono font-semibold text-[13px]">RIB: 10001 06815 09876543210 44</div>
<div className="mt-0.5 text-on-surface-variant font-label-sm text-label-sm">Titulaire : AZ CORPORATION SARL - ACADÉMIE</div>
</div>
<div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-primary">UBA Cameroon</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Virements Express</span>
</div>
<div className="mt-1 text-on-surface font-mono font-semibold text-[13px]">RIB: 10033 05240 11223344556 12</div>
<div className="mt-0.5 text-on-surface-variant font-label-sm text-label-sm">Titulaire : AZ CORPORATION SARL</div>
</div>
</div>
</div>
</div>
{/*  Module OCR et Téléversement de Reçu (5 colonnes)  */}
<div className="xl:col-span-5 space-y-5" id="ocr-upload-section">
<div><h2 className="font-headline-lg text-headline-lg text-primary font-bold">Dépôt de Reçu Bancaire</h2><p className="font-body-sm text-body-sm text-on-surface-variant">Transmission de votre bordereau pour validation administrative</p></div>
{/*  AI OCR Card & Drag Area  */}
<div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm space-y-4">
{/*  Alerte explicative IA AZ Pulse  */}
<div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-3"><span className="material-symbols-outlined notranslate text-secondary text-[22px] flex-shrink-0 mt-0.5">receipt_long</span><div className="space-y-0.5"><span className="font-label-md text-label-md font-semibold text-primary">Dépôt de Bordereau de Versement</span><p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Déposez votre reçu bancaire scanné ou bordereau de versement (PDF, JPG, PNG). L'académie AZ Pulse ne traite pas les paiements en ligne : votre justificatif sera transmis à la comptabilité pour vérification manuelle.</p></div></div>
{/*  Zone Drag & Drop  */}
<div className="group relative rounded-xl bg-surface-container-low p-6 text-center cursor-pointer transition-colors hover:bg-surface-container">
<input onChange={handleFileUpload} accept="image/png, image/jpeg, application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="receipt-upload" type="file" />
<div className="flex flex-col items-center justify-center space-y-2 pointer-events-none"><div className="w-12 h-12 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform"><span className="material-symbols-outlined notranslate text-[26px]">cloud_upload</span></div><div className="font-headline-sm text-headline-sm font-semibold text-primary">Glissez votre reçu bancaire ici</div><p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">Bordereau BICEC, UBA ou virement bancaire officiel (PNG, JPG, PDF max 10 Mo)</p><span className="font-label-md text-label-md text-secondary font-semibold pt-1 underline">Parcourir les fichiers</span></div>
</div>
{/*  Aperçu du bordereau simulé en cours d'analyse / vérifié  */}
{selectedFile ? (
  <div className="p-4 rounded-xl bg-surface-container-low space-y-3">
    <div className="flex items-center justify-between pb-1">
      <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5"><span className="material-symbols-outlined notranslate text-secondary text-[18px]">description</span>Nouveau justificatif</span>
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
        {uploadStatus === 'uploading' ? (
          <><span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>Téléversement...</>
        ) : (
          <><span className="material-symbols-outlined notranslate text-[14px]">check_circle</span>Transmis</>
        )}
      </span>
    </div>
    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-lowest shadow-sm">
      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary-container flex-shrink-0">
        <span className="material-symbols-outlined notranslate text-[26px]">picture_as_pdf</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-label-lg text-label-lg font-bold text-primary truncate">{selectedFile.name}</div>
        <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-label-sm text-label-sm">
          <span className="">{(selectedFile.size / 1024 / 1024).toFixed(2)} Mo</span><span className="">•</span>
          <span className="text-on-surface-variant">{uploadStatus === 'uploading' ? 'Analyse en cours' : 'Prêt pour vérification'}</span>
        </div>
      </div>
      <span className={`material-symbols-outlined notranslate text-[20px] ${uploadStatus === 'success' ? 'text-secondary' : 'text-on-surface-variant'}`}>
        {uploadStatus === 'success' ? 'verified' : 'schedule'}
      </span>
    </div>
  </div>
) : (
  <div className="p-4 rounded-xl bg-surface-container-low space-y-3"><div className="flex items-center justify-between pb-1"><span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5"><span className="material-symbols-outlined notranslate text-secondary text-[18px]">description</span>Dernier justificatif transmis</span><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold"><span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>En attente de vérification</span></div><div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-lowest shadow-sm"><div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary-container flex-shrink-0"><span className="material-symbols-outlined notranslate text-[26px]">picture_as_pdf</span></div><div className="min-w-0 flex-1"><div className="font-label-lg text-label-lg font-bold text-primary truncate">Bordereau_Versement_Tranche3_BICEC.pdf</div><div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-label-sm text-label-sm"><span className="">1.4 Mo</span><span className="">•</span><span className="text-on-surface-variant">Transmis à la comptabilité</span></div></div><span className="material-symbols-outlined notranslate text-on-surface-variant text-[20px]">schedule</span></div><div className="p-2.5 bg-surface-container-lowest rounded-lg text-on-surface font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined notranslate text-secondary text-[16px]">info</span><span className="">La comptabilité rapproche manuellement votre bordereau sous 24h à 48h ouvrées.</span></div></div>
)}
</div>
{/*  Assistance et hotline finance  */}
<div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined notranslate text-[18px]">support_agent</span>
</div>
<div>
<div className="font-label-md text-label-md font-bold text-primary">Besoin d'aide comptable ?</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Service financier ouvert Lun-Ven 08h-17h</div>
</div>
</div>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors" type="button">
            Contacter
          </button>
</div>
</div>
</div>
{/*  4. Table des Justificatifs, Factures & Quittances Officielles Certifiées  */}
<div className="space-y-4 pt-2">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            Historique des Paiements &amp; Quittances Officielles
          </h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Pièces comptables authentifiées sous cachet officiel AZ Corporation SARL &amp; Direction des Études
          </p>
</div>
<div className="flex items-center gap-2 self-start sm:self-center">
<div className="relative">
<span className="material-symbols-outlined notranslate absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">filter_list</span>
<select className="h-9 pl-8 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm appearance-none focus:outline-none">
<option>Tous les paiements (4)</option>
<option>Validés</option>
<option>En cours</option>
</select>
</div>
<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-sm font-label-md text-label-md font-semibold transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">file_download</span>
<span className="">Tout exporter (ZIP)</span>
</button>
</div>
</div>
{/*  Tableau Responsive  */}
<div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
<th className="py-3.5 px-5 font-semibold">N° Quittance / Facture</th>
<th className="py-3.5 px-4 font-semibold">Date d'émission</th>
<th className="py-3.5 px-4 font-semibold">Désignation</th>
<th className="py-3.5 px-4 font-semibold">Mode de règlement</th>
<th className="py-3.5 px-4 font-semibold text-right">Montant (FCFA)</th>
<th className="py-3.5 px-4 font-semibold text-center">Validation Direction</th>
<th className="py-3.5 px-5 font-semibold text-right">Document Certifié</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container-low">
{/*  Ligne 1  */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-4 px-5">
<div className="font-mono font-bold text-primary text-[13px]">#AZP-2025-0988</div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Réf bancaire : BICEC-DLA-89021</div>
</td>
<td className="py-4 px-4 font-medium text-on-surface-variant">30 Nov 2025</td>
<td className="py-4 px-4">
<span className="font-semibold text-primary">Tranche 3 (Scolarité IA)</span>
<div className="font-label-sm text-label-sm text-on-surface-variant">Semestre 1 - Module avancé</div>
</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container font-label-md text-label-md text-primary font-medium">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">account_balance</span>
<span className="">Virement BICEC</span>
</div>
</td>
<td className="py-4 px-4 text-right font-bold text-primary font-mono text-[15px]">
                175 000
              </td>
<td className="py-4 px-4 text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Validé Direction
                </span>
</td>
<td className="py-4 px-5 text-right">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-colors shadow-sm" type="button">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">download</span>
<span className="">PDF Certifié</span>
</button>
</td>
</tr>
{/*  Ligne 2  */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-4 px-5">
<div className="font-mono font-bold text-primary text-[13px]">#AZP-2025-0451</div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Réf : MTN-MOMO-778219</div>
</td>
<td className="py-4 px-4 font-medium text-on-surface-variant">15 Oct 2025</td>
<td className="py-4 px-4">
<span className="font-semibold text-primary">Tranche 2 (Pôle Technique)</span>
<div className="font-label-sm text-label-sm text-on-surface-variant">Socle Fullstack &amp; DevOps</div>
</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container font-label-md text-label-md text-primary font-medium">
<span className="material-symbols-outlined notranslate text-[16px] text-tertiary-fixed-dim">smartphone</span>
<span className="">MTN MoMo</span>
</div>
</td>
<td className="py-4 px-4 text-right font-bold text-primary font-mono text-[15px]">
                175 000
              </td>
<td className="py-4 px-4 text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Validé Direction
                </span>
</td>
<td className="py-4 px-5 text-right">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-colors shadow-sm" type="button">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">download</span>
<span className="">PDF Certifié</span>
</button>
</td>
</tr>
{/*  Ligne 3  */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-4 px-5">
<div className="font-mono font-bold text-primary text-[13px]">#AZP-2025-0120</div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Réf : REC-AGENCE-0044</div>
</td>
<td className="py-4 px-4 font-medium text-on-surface-variant">05 Sept 2025</td>
<td className="py-4 px-4">
<span className="font-semibold text-primary">Tranche 1 • Inscription Annuelle</span>
<div className="font-label-sm text-label-sm text-on-surface-variant">Frais de matricule &amp; dossier</div>
</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container font-label-md text-label-md text-primary font-medium">
<span className="material-symbols-outlined notranslate text-[16px] text-primary-container">store</span>
<span className="">Caisse Centrale AZ</span>
</div>
</td>
<td className="py-4 px-4 text-right font-bold text-primary font-mono text-[15px]">
                100 000
              </td>
<td className="py-4 px-4 text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Validé Direction
                </span>
</td>
<td className="py-4 px-5 text-right">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-colors shadow-sm" type="button">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">download</span>
<span className="">PDF Certifié</span>
</button>
</td>
</tr>
{/*  Ligne 4 (En cours de traitement / bordereau récent)  */}
<tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors"><td className="py-4 px-5"><div className="font-mono font-bold text-primary text-[13px]">#AZP-DRAFT-9102</div><div className="font-label-sm text-label-sm text-on-surface-variant">Bordereau déposé en ligne</div></td><td className="py-4 px-4 font-medium text-on-surface-variant">Aujourd'hui</td><td className="py-4 px-4"><span className="font-semibold text-primary">Acompte Anticipé Tranche 4</span><div className="font-label-sm text-label-sm text-on-surface-variant">Bordereau transmis au service compta</div></td><td className="py-4 px-4"><div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container font-label-md text-label-md text-primary font-medium"><span className="material-symbols-outlined notranslate text-[16px] text-secondary">receipt</span><span className="">Dépôt bancaire (Bordereau scanné)</span></div></td><td className="py-4 px-4 text-right font-bold text-on-surface-variant font-mono text-[15px]">50 000</td><td className="py-4 px-4 text-center"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold"><span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>En attente de vérification comptable</span></td><td className="py-4 px-5 text-right"><button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant opacity-60 font-label-sm text-label-sm font-medium cursor-not-allowed" disabled="" type="button"><span className="material-symbols-outlined notranslate text-[16px]">hourglass_top</span><span className="">En attente</span></button></td></tr>
</tbody>
</table>
</div>
</div>
{/*  5. Pied de page informatif et certification MINEFOP  */}
<div className="p-6 rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-4 text-on-surface-variant font-body-sm text-body-sm">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
<span className="material-symbols-outlined notranslate text-[18px]">verified</span>
</div>
<span className="">
          Toutes les quittances émises via le portail AZ Pulse possèdent une signature électronique certifiée conforme pour les démarches administratives, concours d'ingénieurs et équivalences MINEFOP.
        </span>
</div>
<div className="flex items-center gap-2 flex-shrink-0">
<span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">Sécurité Bancaire SSL 256-Bit</span>
</div>
</div>
</div>
</div>
    </div>
  );
};

export default ApprenantPaiements;
