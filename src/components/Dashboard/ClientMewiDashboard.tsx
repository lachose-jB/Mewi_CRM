import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCrm } from '../../contexts/CrmContext';

const DashboardMewi: React.FC = () => {
  const { user } = useAuth();
  const { debiteurs, invoices, payments, communications } = useCrm();

  // Filtrer les débiteurs confiés à Mewi Recouvrement
  const debiteursMewi = debiteurs.filter(d => d.assignedTo === user?.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Mewi Recouvrement</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debiteursMewi.map(debiteur => (
          <div key={debiteur.id} className="bg-white rounded shadow p-4">
            <h2 className="font-semibold">{debiteur.name}</h2>
            <p>Status : {debiteur.status}</p>
            {/* Ajoute ici l’avancement, factures, paiements, relances, etc. */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMewi;