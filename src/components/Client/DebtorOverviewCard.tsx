import React from 'react';
import { 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  CreditCard,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { Debtor } from '../../types';
import { formatCurrency, getRecoveryStatusConfig, getDebtorStatusConfig, formatDate } from '../../utils/dataUtils';
import { Link } from 'react-router-dom';

interface DebtorOverviewCardProps {
  debtor: Debtor;
  showDetails?: boolean;
}

const DebtorOverviewCard: React.FC<DebtorOverviewCardProps> = ({ debtor, showDetails = false }) => {
  const recoveryStatusConfig = getRecoveryStatusConfig(debtor.recoveryStatus);
  const statusConfig = getDebtorStatusConfig(debtor.status);
  const recoveryRate = debtor.originalAmount > 0 
    ? (debtor.paidAmount / debtor.originalAmount) * 100 
    : 0;

  // Determine icon based on recovery status
  const getStatusIcon = () => {
    if (debtor.recoveryStatus === 'critical') return <AlertCircle className="h-5 w-5 text-red-600" />;
    if (debtor.recoveryStatus === 'orange') return <Clock className="h-5 w-5 text-orange-600" />;
    if (debtor.recoveryStatus === 'yellow') return <Clock className="h-5 w-5 text-yellow-600" />;
    if (debtor.status === 'recovered') return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <CreditCard className="h-5 w-5 text-blue-600" />;
  };

  return (
    <Link 
      to={`/debtors/${debtor.id}`}
      className="block bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 transition-all hover:shadow"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${
            debtor.recoveryStatus === 'critical' ? 'bg-red-100' :
            debtor.recoveryStatus === 'orange' ? 'bg-orange-100' :
            debtor.recoveryStatus === 'yellow' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            {debtor.type === 'company' ? (
              <Building className={`h-5 w-5 ${
                debtor.recoveryStatus === 'critical' ? 'text-red-600' :
                debtor.recoveryStatus === 'orange' ? 'text-orange-600' :
                debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
              }`} />
            ) : (
              <User className={`h-5 w-5 ${
                debtor.recoveryStatus === 'critical' ? 'text-red-600' :
                debtor.recoveryStatus === 'orange' ? 'text-orange-600' :
                debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
              }`} />
            )}
          </div>
          
          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-900">{debtor.name}</h4>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${recoveryStatusConfig.color}`}>
                {recoveryStatusConfig.label}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 mt-1">
              {debtor.company && (
                <span className="inline-block mr-3">{debtor.company}</span>
              )}
              <span>Dossier #{debtor.id.substring(0, 6)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{formatCurrency(debtor.totalAmount)}</p>
          {debtor.paidAmount > 0 && (
            <p className="text-xs text-green-600">
              {formatCurrency(debtor.paidAmount)} payé
            </p>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Statut:</span>
            <span className="ml-2 font-medium text-gray-900">
              {statusConfig.label}
            </span>
          </div>
          
          <div>
            <span className="text-gray-500">Créé le:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(debtor.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          <div>
            <span className="text-gray-500">Dernier contact:</span>
            <span className="ml-2 font-medium text-gray-900">
              {debtor.lastContact ? formatDate(debtor.lastContact) : 'N/A'}
            </span>
          </div>
          
          <div>
            <span className="text-gray-500">Factures:</span>
            <span className="ml-2 font-medium text-gray-900">
              {debtor.invoiceCount}
            </span>
          </div>
        </div>
      )}
      
      <div className="mt-3">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-500">Progression</span>
          <span className="text-gray-700 font-medium">{recoveryRate.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${recoveryRate}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        {debtor.daysOverdue > 0 ? (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-orange-500" />
            <span className={`${debtor.daysOverdue > 30 ? 'text-red-600' : 'text-orange-600'}`}>
              {debtor.daysOverdue} jours de retard
            </span>
          </div>
        ) : (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-blue-600">
              À jour
            </span>
          </div>
        )}
        
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </Link>
  );
};

export default DebtorOverviewCard;