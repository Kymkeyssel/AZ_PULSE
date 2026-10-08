import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../contexts/AuthContext';

const MOCK_PAYMENTS = [
  {
    id: 'TXN-2025-089',
    student: 'M. Talla',
    parent: 'Parent Talla',
    amount: 150000,
    currency: 'FCFA',
    date: '2025-11-06T14:30:00Z',
    status: 'PENDING',
    method: 'Orange Money',
    ocrConfidence: 98,
    fileUrl: '/mock-receipt-1.jpg',
    aiNotes: 'Correspondance exacte du montant et du destinataire trouvée sur le reçu.'
  },
  {
    id: 'TXN-2025-090',
    student: 'A. Kamga',
    parent: 'Parent Kamga',
    amount: 50000,
    currency: 'FCFA',
    date: '2025-11-07T09:15:00Z',
    status: 'PENDING',
    method: 'MTN Mobile Money',
    ocrConfidence: 65,
    fileUrl: '/mock-receipt-2.jpg',
    aiNotes: 'Le numéro de transaction est flou. Vérification manuelle requise.'
  },
  {
    id: 'TXN-2025-085',
    student: 'C. Ndi',
    parent: 'Parent Ndi',
    amount: 300000,
    currency: 'FCFA',
    date: '2025-11-05T11:00:00Z',
    status: 'VALIDATED',
    method: 'Virement Bancaire',
    ocrConfidence: 100,
    fileUrl: '/mock-receipt-3.jpg',
    aiNotes: 'Validation automatique réussie via rapprochement bancaire.'
  }
];

const PaiementsValidation = () => {
  const { hasPermission } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState(MOCK_PAYMENTS[0]);
  const [filter, setFilter] = useState('PENDING'); // PENDING, VALIDATED, REJECTED

  const filteredPayments = MOCK_PAYMENTS.filter(p => p.status === filter);

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 pb-20">
      {/* ── En-tête ───────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2.5 py-1 rounded bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-wider">
              Espace Responsable Formation
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#001026] tracking-tight">Validation des Paiements</h1>
          <p className="text-sm text-[#6b7a99] mt-1">
            Vérifiez et validez les justificatifs de paiement soumis. L'IA pré-analyse les reçus pour vous faire gagner du temps.
          </p>
        </div>
      </header>

      {/* ── KPIs ──────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#dde3ef] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">hourglass_empty</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">12</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider">En attente</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#dde3ef] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">845</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider">Validés ce mois</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#dde3ef] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">4.5M FCFA</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider">Recouvré ce mois</p>
          </div>
        </div>
      </section>

      {/* ── Contenu Principal ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Liste des paiements (Sidebar gauche) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#dde3ef] shadow-sm overflow-hidden flex flex-col h-[600px]">
            {/* Tabs */}
            <div className="flex border-b border-[#dde3ef]">
              {['PENDING', 'VALIDATED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
                    filter === status 
                      ? 'border-[#004ad1] text-[#004ad1] bg-[#eff6ff]/50' 
                      : 'border-transparent text-[#6b7a99] hover:bg-slate-50'
                  }`}
                >
                  {status === 'PENDING' ? 'À vérifier (12)' : 'Historique'}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {filteredPayments.map(payment => (
                <button
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedPayment.id === payment.id
                      ? 'bg-[#eff6ff] border-[#004ad1] shadow-sm'
                      : 'bg-white border-transparent hover:bg-slate-50 border-b-[#dde3ef]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#001026] text-sm">{payment.student}</span>
                    <span className="text-xs font-mono font-bold text-[#004ad1]">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#6b7a99]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">smartphone</span>
                      {payment.method}
                    </span>
                    <span>{new Date(payment.date).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
              {filteredPayments.length === 0 && (
                <div className="p-8 text-center text-[#6b7a99]">
                  <p className="text-sm">Aucun justificatif trouvé.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détail et Validation (Droite) */}
        <div className="lg:col-span-8">
          {selectedPayment ? (
            <div className="bg-white rounded-2xl border border-[#dde3ef] shadow-sm flex flex-col h-[600px] overflow-hidden">
              
              <div className="p-5 border-b border-[#dde3ef] flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-[#001026]">Détails du paiement {selectedPayment.id}</h2>
                  <p className="text-sm text-[#6b7a99]">Soumis par : {selectedPayment.parent} pour l'apprenant {selectedPayment.student}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#001026]">{selectedPayment.amount.toLocaleString()} {selectedPayment.currency}</p>
                  <p className="text-xs text-[#6b7a99] uppercase font-bold">{selectedPayment.method}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Zone AI & Info */}
                <div className="md:w-1/2 p-5 border-r border-[#dde3ef] flex flex-col gap-6 overflow-y-auto">
                  
                  {/* Analyse IA */}
                  <div className={`p-4 rounded-xl border ${selectedPayment.ocrConfidence > 80 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`material-symbols-outlined ${selectedPayment.ocrConfidence > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedPayment.ocrConfidence > 80 ? 'auto_awesome' : 'warning'}
                      </span>
                      <h3 className={`font-bold text-sm ${selectedPayment.ocrConfidence > 80 ? 'text-emerald-800' : 'text-amber-800'}`}>
                        Analyse IA (Confiance : {selectedPayment.ocrConfidence}%)
                      </h3>
                    </div>
                    <p className={`text-sm ${selectedPayment.ocrConfidence > 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedPayment.aiNotes}
                    </p>
                  </div>

                  {/* Infos Extraites */}
                  <div>
                    <h3 className="text-sm font-bold text-[#6b7a99] uppercase tracking-wider mb-3">Données Extraites (OCR)</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-[#6b7a99]">Montant lu</span>
                        <span className="font-bold text-[#001026]">{selectedPayment.amount.toLocaleString()} {selectedPayment.currency}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-[#6b7a99]">Date lue</span>
                        <span className="font-bold text-[#001026]">{new Date(selectedPayment.date).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-[#6b7a99]">Destinataire</span>
                        <span className="font-bold text-[#001026]">AZ CORPORATION</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-[#6b7a99]">Réf. Transaction</span>
                        <span className="font-bold font-mono text-[#001026]">MP251106.1430.B849</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedPayment.status === 'PENDING' && (
                    <div className="mt-auto pt-4 flex gap-3">
                      <button className="flex-1 h-11 rounded-xl bg-white border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                        Rejeter
                      </button>
                      <button className="flex-1 h-11 rounded-xl bg-[#004ad1] text-white font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        Valider & Générer Reçu
                      </button>
                    </div>
                  )}

                  {selectedPayment.status === 'VALIDATED' && (
                    <div className="mt-auto pt-4">
                      <div className="w-full h-11 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center gap-2 border border-emerald-100">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Paiement Validé
                      </div>
                    </div>
                  )}
                </div>

                {/* Preuve d'image */}
                <div className="md:w-1/2 bg-slate-100 flex flex-col">
                  <div className="p-3 border-b border-[#dde3ef] bg-white flex justify-between items-center">
                    <span className="text-sm font-bold text-[#6b7a99]">Justificatif original</span>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-lg bg-slate-100 text-[#6b7a99] hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-slate-100 text-[#6b7a99] hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-4">
                    {/* Placeholder for actual image */}
                    <div className="w-full h-full max-h-[400px] border-2 border-dashed border-[#dde3ef] rounded-xl flex flex-col items-center justify-center text-[#6b7a99] bg-white">
                      <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">receipt_long</span>
                      <p className="text-sm font-medium">Aperçu du justificatif</p>
                      <p className="text-xs mt-1">Image {selectedPayment.method}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#dde3ef] shadow-sm h-[600px] flex flex-col items-center justify-center text-[#6b7a99]">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">swipe_right</span>
              <p>Sélectionnez un paiement pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaiementsValidation;
