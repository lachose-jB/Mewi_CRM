import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
  Cloud,
  Shield,
  Settings,
  Play,
  Pause,
  Trash2,
  Eye,
  Copy,
  Archive,
  FileText,
  Server,
  Zap
} from 'lucide-react';

interface BackupItem {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  size: string;
  createdAt: string;
  status: 'completed' | 'running' | 'failed' | 'scheduled';
  location: 'local' | 'cloud';
  retention: number;
}

interface RestorePoint {
  id: string;
  name: string;
  timestamp: string;
  size: string;
  type: 'automatic' | 'manual';
  verified: boolean;
}

const BackupRestore: React.FC = () => {
  const [activeTab, setActiveTab] = useState('backups');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  const [backups] = useState<BackupItem[]>([
    {
      id: '1',
      name: 'Sauvegarde Complète - Décembre 2024',
      type: 'full',
      size: '2.4 GB',
      createdAt: '2024-12-15 02:00:00',
      status: 'completed',
      location: 'cloud',
      retention: 30
    },
    {
      id: '2',
      name: 'Sauvegarde Incrémentale - 14/12',
      type: 'incremental',
      size: '156 MB',
      createdAt: '2024-12-14 02:00:00',
      status: 'completed',
      location: 'local',
      retention: 7
    },
    {
      id: '3',
      name: 'Sauvegarde Manuelle - Avant Mise à Jour',
      type: 'full',
      size: '2.3 GB',
      createdAt: '2024-12-13 15:30:00',
      status: 'completed',
      location: 'cloud',
      retention: 90
    },
    {
      id: '4',
      name: 'Sauvegarde Incrémentale - 13/12',
      type: 'incremental',
      size: '89 MB',
      createdAt: '2024-12-13 02:00:00',
      status: 'running',
      location: 'local',
      retention: 7
    }
  ]);

  const [restorePoints] = useState<RestorePoint[]>([
    {
      id: '1',
      name: 'Point de restauration - Avant maintenance',
      timestamp: '2024-12-15 14:00:00',
      size: '2.4 GB',
      type: 'manual',
      verified: true
    },
    {
      id: '2',
      name: 'Point automatique - Sauvegarde quotidienne',
      timestamp: '2024-12-15 02:00:00',
      size: '2.4 GB',
      type: 'automatic',
      verified: true
    },
    {
      id: '3',
      name: 'Point de restauration - Configuration système',
      timestamp: '2024-12-14 16:30:00',
      size: '1.8 GB',
      type: 'manual',
      verified: false
    }
  ]);

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupTime: '02:00',
    frequency: 'daily',
    retention: 30,
    compression: true,
    encryption: true,
    cloudSync: true,
    emailNotifications: true
  });

  const createBackup = async (type: 'full' | 'incremental') => {
    setIsCreatingBackup(true);
    // Simulation de création de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsCreatingBackup(false);
  };

  const restoreFromBackup = async (backupId: string) => {
    setIsRestoring(true);
    setSelectedBackup(backupId);
    // Simulation de restauration
    await new Promise(resolve => setTimeout(resolve, 8000));
    setIsRestoring(false);
    setSelectedBackup(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'running':
        return RefreshCw;
      case 'failed':
        return AlertCircle;
      case 'scheduled':
        return Clock;
      default:
        return Clock;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full':
        return Database;
      case 'incremental':
        return Archive;
      case 'differential':
        return FileText;
      default:
        return Database;
    }
  };

  const getLocationIcon = (location: string) => {
    return location === 'cloud' ? Cloud : HardDrive;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sauvegarde et Restauration</h1>
          <p className="text-gray-600">Gestion des sauvegardes et points de restauration</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => createBackup('incremental')}
            disabled={isCreatingBackup}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreatingBackup ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Archive className="h-4 w-4 mr-2" />
            )}
            Sauvegarde Rapide
          </button>
          <button
            onClick={() => createBackup('full')}
            disabled={isCreatingBackup}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Database className="h-4 w-4 mr-2" />
            Sauvegarde Complète
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-2 bg-gray-50 p-2 rounded-lg">
        {[
          { id: 'backups', label: 'Sauvegardes', icon: Database },
          { id: 'restore', label: 'Restauration', icon: RefreshCw },
          { id: 'schedule', label: 'Planification', icon: Calendar },
          { id: 'settings', label: 'Paramètres', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Onglet Sauvegardes */}
      {activeTab === 'backups' && (
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sauvegardes</p>
                  <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Réussies</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {backups.filter(b => b.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <HardDrive className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Espace Utilisé</p>
                  <p className="text-2xl font-bold text-gray-900">5.2 GB</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Dernière Sauvegarde</p>
                  <p className="text-sm font-bold text-gray-900">Il y a 2h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des sauvegardes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Historique des Sauvegardes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emplacement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {backups.map((backup) => {
                    const StatusIcon = getStatusIcon(backup.status);
                    const TypeIcon = getTypeIcon(backup.type);
                    const LocationIcon = getLocationIcon(backup.location);
                    
                    return (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TypeIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{backup.name}</div>
                              <div className="text-sm text-gray-500">Rétention: {backup.retention} jours</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            backup.type === 'full' ? 'bg-blue-100 text-blue-800' :
                            backup.type === 'incremental' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {backup.type === 'full' ? 'Complète' :
                             backup.type === 'incremental' ? 'Incrémentale' : 'Différentielle'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {backup.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className={`h-4 w-4 mr-2 ${
                              backup.status === 'completed' ? 'text-green-500' :
                              backup.status === 'running' ? 'text-blue-500 animate-spin' :
                              backup.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                            }`} />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                              {backup.status === 'completed' ? 'Terminée' :
                               backup.status === 'running' ? 'En cours' :
                               backup.status === 'failed' ? 'Échec' : 'Planifiée'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <LocationIcon className={`h-4 w-4 mr-2 ${
                              backup.location === 'cloud' ? 'text-blue-500' : 'text-gray-500'
                            }`} />
                            <span className="text-sm text-gray-900">
                              {backup.location === 'cloud' ? 'Cloud' : 'Local'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(backup.createdAt).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => restoreFromBackup(backup.id)}
                              disabled={backup.status !== 'completed' || isRestoring}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              title="Restaurer"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900" title="Télécharger">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900" title="Détails">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Restauration */}
      {activeTab === 'restore' && (
        <div className="space-y-6">
          {isRestoring && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center">
                <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-blue-900">Restauration en cours...</h3>
                  <p className="text-blue-700">Veuillez patienter pendant la restauration des données.</p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Points de Restauration Disponibles</h3>
            
            <div className="space-y-4">
              {restorePoints.map((point) => (
                <div key={point.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        point.type === 'manual' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {point.type === 'manual' ? (
                          <Shield className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Zap className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{point.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(point.timestamp).toLocaleString('fr-FR')}</span>
                          <span>{point.size}</span>
                          <span className={`inline-flex items-center ${
                            point.verified ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {point.verified ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Vérifié
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Non vérifié
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => restoreFromBackup(point.id)}
                        disabled={isRestoring}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restaurer
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options de restauration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Options de Restauration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input type="checkbox" id="restore-data" className="h-4 w-4 text-blue-600" defaultChecked />
                  <label htmlFor="restore-data" className="ml-2 text-sm text-gray-700">
                    Restaurer les données utilisateur
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="restore-config" className="h-4 w-4 text-blue-600" defaultChecked />
                  <label htmlFor="restore-config" className="ml-2 text-sm text-gray-700">
                    Restaurer la configuration système
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="restore-templates" className="h-4 w-4 text-blue-600" defaultChecked />
                  <label htmlFor="restore-templates" className="ml-2 text-sm text-gray-700">
                    Restaurer les modèles de communication
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input type="checkbox" id="restore-users" className="h-4 w-4 text-blue-600" />
                  <label htmlFor="restore-users" className="ml-2 text-sm text-gray-700">
                    Restaurer les comptes utilisateurs
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="restore-logs" className="h-4 w-4 text-blue-600" />
                  <label htmlFor="restore-logs" className="ml-2 text-sm text-gray-700">
                    Restaurer les journaux d'activité
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="verify-integrity" className="h-4 w-4 text-blue-600" defaultChecked />
                  <label htmlFor="verify-integrity" className="ml-2 text-sm text-gray-700">
                    Vérifier l'intégrité après restauration
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Planification */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Planification Automatique</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence des sauvegardes
                  </label>
                  <select 
                    value={backupSettings.frequency}
                    onChange={(e) => setBackupSettings({...backupSettings, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="hourly">Toutes les heures</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de sauvegarde
                  </label>
                  <input
                    type="time"
                    value={backupSettings.backupTime}
                    onChange={(e) => setBackupSettings({...backupSettings, backupTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rétention (jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={backupSettings.retention}
                    onChange={(e) => setBackupSettings({...backupSettings, retention: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Sauvegarde automatique</span>
                  <button
                    onClick={() => setBackupSettings({...backupSettings, autoBackup: !backupSettings.autoBackup})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      backupSettings.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backupSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Compression</span>
                  <button
                    onClick={() => setBackupSettings({...backupSettings, compression: !backupSettings.compression})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      backupSettings.compression ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backupSettings.compression ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Chiffrement</span>
                  <button
                    onClick={() => setBackupSettings({...backupSettings, encryption: !backupSettings.encryption})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      backupSettings.encryption ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backupSettings.encryption ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Synchronisation cloud</span>
                  <button
                    onClick={() => setBackupSettings({...backupSettings, cloudSync: !backupSettings.cloudSync})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      backupSettings.cloudSync ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backupSettings.cloudSync ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Notifications email</span>
                  <button
                    onClick={() => setBackupSettings({...backupSettings, emailNotifications: !backupSettings.emailNotifications})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      backupSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backupSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sauvegarder la Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupRestore;