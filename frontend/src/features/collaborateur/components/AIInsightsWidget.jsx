import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';
import { aiService } from '../../../services/api';

export default function AIInsightsWidget({ metrics = {}, scope = 'CRM & Performance', title = 'Insights décisionnels IA' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.getInsights(metrics, scope);
      setData(res.results || {});
    } catch (err) {
      setError("Indisponibilité temporaire des insights IA.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [scope]);

  return (
    <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0B2545]">{title}</h3>
            <p className="text-[11px] text-slate-500 font-medium">Généré par Gemini en temps réel ({scope})</p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition"
          title="Actualiser les insights"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {loading && (
        <div className="py-6 flex flex-col items-center justify-center text-xs text-slate-500 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>L'IA analyse les données et calcule les prédictions...</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4">
          {/* Score & Tendance bar */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Indice de santé</div>
              <div className="text-xl font-extrabold text-[#003366] flex items-center gap-1.5 mt-0.5">
                {data.score ?? '—'} <span className="text-xs text-slate-400 font-normal">{data.score != null ? '/ 100' : ''}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tendance observée</div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="truncate">{data.trends || 'Aucune tendance fournie'}</span>
              </div>
            </div>
          </div>

          {/* Insights phares */}
          {data.insights && data.insights.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Observations clés</div>
              {data.insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          )}

          {/* Alertes critiques si détectées */}
          {data.alerts && data.alerts.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5" />
                Vigilance requise
              </div>
              {data.alerts.map((al, idx) => (
                <p key={idx} className="text-[11px] text-rose-700">• {al}</p>
              ))}
            </div>
          )}

          {/* Actions suggérées */}
          {data.recommendations && data.recommendations.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-[#0B2545] mb-1.5">Recommandation prioritaire</div>
              <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
                <span>{data.recommendations[0]}</span>
                <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
