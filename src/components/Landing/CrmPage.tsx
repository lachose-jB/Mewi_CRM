import React from 'react';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  CheckCircle, 
  Cloud, 
  Database, 
  Lock, 
  Smartphone,
  Zap,
  Calendar,
  FileText,
  Phone,
  Mail,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Settings,
  Eye,
  RefreshCw,
  Bell,
  Download
} from 'lucide-react';

const CrmPage: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            CRM Recouvrement
            <span className="text-blue-600 block">Complet et Intelligent</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Une plateforme tout-en-un qui révolutionne la gestion du recouvrement avec 
            des outils avancés, une automatisation intelligente et des analyses prédictives.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-full text-lg font-medium">
            <CheckCircle className="h-5 w-5 mr-2" />
            Augmentation moyenne de 78% du taux de recouvrement
          </div>
        </div>
      </div>

      {/* Modules principaux */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Modules Intégrés
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tous les outils nécessaires dans une seule plateforme unifiée
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Users,
                title: 'Gestion des Dossiers',
                description: 'Module complet de gestion des clients et dossiers de recouvrement',
                features: [
                  'Suivi client 360°',
                  'Historique complet des actions',
                  'Statuts automatisés par règles',
                  'Notes collaboratives en temps réel',
                  'Segmentation intelligente',
                  'Alertes personnalisables'
                ],
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50'
              },
              {
                icon: MessageSquare,
                title: 'Communication Multi-canal',
                description: 'Orchestration complète des communications avec vos débiteurs',
                features: [
                  'Emails automatiques personnalisés',
                  'SMS avec accusés de réception',
                  'Appels intégrés avec enregistrement',
                  'Courriers générés automatiquement',
                  'Chatbot intelligent',
                  'Réseaux sociaux intégrés'
                ],
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50'
              },
              {
                icon: BarChart3,
                title: 'Analytics & Reporting',
                description: 'Tableaux de bord avancés et analyses prédictives',
                features: [
                  'Dashboards en temps réel',
                  'Rapports automatisés',
                  'KPIs personnalisables',
                  'Prédictions par IA',
                  'Analyses de performance',
                  'Export multi-formats'
                ],
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50'
              }
            ].map((module, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                  <module.icon className="h-8 w-8 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-blue-100">{module.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fonctionnalités détaillées */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez toutes les capacités de notre solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Automatisation', description: 'Workflows intelligents' },
              { icon: Calendar, title: 'Planification', description: 'Agenda intégré' },
              { icon: FileText, title: 'Documents', description: 'Génération automatique' },
              { icon: Phone, title: 'Téléphonie', description: 'Click-to-call intégré' },
              { icon: Mail, title: 'Emailing', description: 'Campagnes personnalisées' },
              { icon: Target, title: 'Ciblage', description: 'Segmentation avancée' },
              { icon: TrendingUp, title: 'Prédictions', description: 'IA et machine learning' },
              { icon: Shield, title: 'Conformité', description: 'Respect réglementaire' },
              { icon: Globe, title: 'Multi-pays', description: 'Gestion internationale' },
              { icon: Settings, title: 'Configuration', description: 'Paramétrage flexible' },
              { icon: Eye, title: 'Monitoring', description: 'Surveillance temps réel' },
              { icon: RefreshCw, title: 'Synchronisation', description: 'Intégrations ERP/CRM' }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Technologies de Pointe
            </h2>
            <p className="text-xl text-gray-600">
              Une infrastructure moderne et sécurisée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Cloud, label: 'Cloud Native', description: 'Architecture cloud-first pour une scalabilité maximale' },
                  { icon: Database, label: 'Big Data', description: 'Traitement de volumes massifs de données' },
                  { icon: Lock, label: 'Sécurité Avancée', description: 'Chiffrement end-to-end et conformité RGPD' },
                  { icon: Smartphone, label: 'Mobile First', description: 'Applications natives iOS et Android' }
                ].map((tech, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                      <tech.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{tech.label}</h4>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Architecture Technique</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Disponibilité</span>
                  <span className="font-bold text-green-400">99.99%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Temps de réponse</span>
                  <span className="font-bold text-blue-400">&lt; 200ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sauvegardes</span>
                  <span className="font-bold text-purple-400">Temps réel</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Conformité</span>
                  <span className="font-bold text-orange-400">RGPD, ISO 27001</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-semibold mb-3">Intégrations disponibles</h4>
                <div className="flex flex-wrap gap-2">
                  {['Salesforce', 'SAP', 'Oracle', 'Microsoft', 'Sage', 'Cegid'].map((integration) => (
                    <span key={integration} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processus de recouvrement */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Processus Optimisé
            </h2>
            <p className="text-xl text-gray-600">
              Un workflow intelligent qui s'adapte à chaque situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: '1', title: 'Détection', description: 'Identification automatique des impayés', icon: Eye },
              { step: '2', title: 'Analyse', description: 'Évaluation du risque et de la stratégie', icon: BarChart3 },
              { step: '3', title: 'Action', description: 'Déclenchement des relances appropriées', icon: Zap },
              { step: '4', title: 'Suivi', description: 'Monitoring et ajustement en continu', icon: RefreshCw },
              { step: '5', title: 'Résolution', description: 'Encaissement ou escalade juridique', icon: CheckCircle }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <process.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-2 border-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{process.step}</span>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-sm text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI et bénéfices */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Retour sur Investissement
            </h2>
            <p className="text-xl text-gray-600">
              Des résultats mesurables dès les premiers mois
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { metric: '+78%', label: 'Taux de recouvrement', color: 'text-green-600' },
              { metric: '-45%', label: 'Temps de traitement', color: 'text-blue-600' },
              { metric: '-60%', label: 'Coûts opérationnels', color: 'text-purple-600' },
              { metric: '+250%', label: 'ROI moyen', color: 'text-orange-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.metric}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Calculez votre ROI</h3>
            <p className="text-blue-100 mb-6">
              Découvrez combien vous pourriez économiser avec notre solution
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Simulateur ROI gratuit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmPage;