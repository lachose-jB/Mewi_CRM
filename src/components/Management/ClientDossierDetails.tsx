import React from 'react';
import { Mail, Phone, User, Building2, Calendar, Tag, ArrowLeft } from 'lucide-react';

interface ClientDossierDetailsProps {
  dossier: any;
  onBack?: () => void;
}

const statusLabels: Record<string, string> = {
  blue: 'Normal',
  yellow: 'Attention',
  orange: 'Urgent',
  critical: 'Critique'
};

const priorityLabels: Record<string, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente'
};

const ClientDossierDetails: React.FC<ClientDossierDetailsProps> = ({ dossier, onBack }) => {
  if (!dossier) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </button>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
        <User className="h-6 w-6 mr-2 text-blue-500" />
        {dossier.clientName}
      </h2>
      <div className="mb-4 text-gray-600">{dossier.company}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span>{dossier.email}</span>
          </div>
          <div className="flex items-center mb-2">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            <span>{dossier.phone}</span>
          </div>
          <div className="flex items-center mb-2">
            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
            <span>{dossier.address}</span>
          </div>
          <div className="flex items-center mb-2">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span>Gestionnaire : {dossier.managerName}</span>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="font-medium">Statut : </span>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              dossier.status === 'critical'
                ? 'bg-red-100 text-red-800'
                : dossier.status === 'orange'
                ? 'bg-orange-100 text-orange-800'
                : dossier.status === 'yellow'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {statusLabels[dossier.status] || dossier.status}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Priorité : </span>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              dossier.priority === 'urgent'
                ? 'bg-red-100 text-red-800'
                : dossier.priority === 'high'
                ? 'bg-orange-100 text-orange-800'
                : dossier.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {priorityLabels[dossier.priority] || dossier.priority}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Créé le : </span>
            <span>{dossier.createdAt}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Dernier contact : </span>
            <span>{dossier.lastContact || '-'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <div className="font-medium text-gray-700">Montant total dû (€)</div>
          <div className="text-lg font-bold text-red-600">{dossier.totalAmount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div>
          <div className="font-medium text-gray-700">Montant original (€)</div>
          <div className="text-lg font-bold">{dossier.originalAmount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div>
          <div className="font-medium text-gray-700">Montant payé (€)</div>
          <div className="text-lg font-bold text-green-600">{dossier.paidAmount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="font-medium text-gray-700 mb-1">Tags :</div>
        <div className="flex flex-wrap gap-2">
          {dossier.tags?.map((tag: string, idx: number) => (
            <span key={idx} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              <Tag className="h-3 w-3 mr-1" /> {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="font-medium text-gray-700 mb-1">Notes :</div>
        <ul className="list-disc pl-5 text-gray-600">
          {dossier.notes?.map((note: string, idx: number) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <div className="font-medium text-gray-700 mb-1">Dernier paiement :</div>
        <div>
          {dossier.lastPayment ? (
            <span>
              <Calendar className="h-4 w-4 inline mr-1 text-gray-400" />
              {dossier.lastPayment}
            </span>
          ) : (
            <span>-</span>
          )}
        </div>
      </div>

      {dossier.nextAction && (
        <div className="mb-6">
          <div className="font-medium text-gray-700 mb-1">Prochaine action :</div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="font-semibold">{dossier.nextAction.type}</div>
            <div className="text-sm text-gray-600">{dossier.nextAction.date}</div>
            <div className="text-sm">{dossier.nextAction.description}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-8">
        <div>
          <span className="font-medium">Nombre de factures :</span> {dossier.invoiceCount}
        </div>
        <div>
          <span className="font-medium">Jours de retard :</span> {dossier.daysOverdue}
        </div>
      </div>
    </div>
  );
};

export default ClientDossierDetails;