import React, { Component } from 'react';

import { Link } from 'react-router-dom';

/**
 * Filet de sécurité de rendu.
 *
 * Sans ErrorBoundary, une exception dans un module livré (ou une donnée
 * manquante) écrase toute l'application en écran blanc, sans trace. Ici on
 * affiche un écran de repli exploitable, et on journalise l'erreur en console
 * pour rester déboguable en développement.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AZ PULSE] Erreur de rendu interceptée :', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fafe] px-6">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-[#e3eaf5] shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <span className="material-symbols-rounded text-3xl">error</span>
          </div>

          <h1 className="text-xl font-semibold text-[#181c1f] mb-2">
            Un écran n&apos;a pas pu s&apos;afficher
          </h1>
          <p className="text-sm text-[#5b6472] mb-6">
            L&apos;erreur a été isolée : le reste de la plateforme reste
            accessible. Revenez à votre espace ou contactez l&apos;administrateur
            si le problème persiste.
          </p>

          <pre className="text-left text-[11px] text-[#8b95a5] bg-[#f6fafe] rounded-lg p-3 mb-6 max-h-32 overflow-auto whitespace-pre-wrap">
            {String(this.state.error?.message || this.state.error)}
          </pre>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[#d8e0ec] text-[#181c1f] hover:bg-[#f6fafe]"
            >
              Réessayer
            </button>
            <Link
              to="/redirect"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[#004ad1] text-white hover:bg-[#003aab]"
            >
              Mon espace
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
