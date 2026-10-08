knowledge_jsx_path = 'frontend/src/features/collaborateur/pages/KnowledgeHub.jsx'

header = """import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../contexts/AuthContext';

const KnowledgeHub = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const canReadKnowledge = hasPermission('knowledge.read');
  const canWriteKnowledge = hasPermission('knowledge.write');

  if (!canReadKnowledge) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-100">
        <h2 className="text-red-600 font-bold mb-2">Accès refusé</h2>
        <p className="text-sm text-slate-500">Vous n'avez pas la permission d'accéder au Knowledge Hub.</p>
      </div>
    );
  }

  return (
"""

with open('.stitch/designs/c2702603fabf496fa7624aa7f02f71f3.html.jsx', 'r', encoding='utf-8') as f:
    new_jsx = f.read()

new_code = header + new_jsx + '\n  );\n};\n\nexport default KnowledgeHub;\n'

with open(knowledge_jsx_path, 'w', encoding='utf-8') as f:
    f.write(new_code)
print('Fixed KnowledgeHub.')
