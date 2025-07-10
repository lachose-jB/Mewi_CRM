import React from 'react';
import { 
  Building, 
  Factory, 
  Briefcase, 
  CreditCard, 
  FileText, 
  Target,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Zap,
  BarChart3,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Clock,
  Settings
} from 'lucide-react';

const TargetPage: React.FC = () => {
  const sectors = [
    {
      icon: Building,
      title: 'Grandes Entreprises',
      subtitle: 'Solutions Enterprise',
      description: 'Pour les groupes et multinationales avec des volumes élevés de créances',
      features: [
        'Architecture multi-entités et filiales',
        'APIs avancées pour intégrations complexes',
        'Support dédié 24/7 avec SLA garantis',
        'Conformité internationale (RGPD, SOX)',
        'Tableaux de bord consolidés groupe',
        'Workflows personnalisés par entité'
      ],
      benefits: [
        'Gestion centralisée de milliers de dossiers',
        'Réduction des coûts opérationnels de 40%',
        'Harmonisation des processus groupe',
        'Reporting consolidé en temps réel'
      ],
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      stats: { clients: '50+', volume: '100K+', satisfaction: '98%' }
    },
    {
      icon: Factory,
      title: 'PME/ETI',
      subtitle: 'Solutions Adaptées',
      description: 'Outils performants et accessibles pour les moyennes entreprises',
      features: [
        'Déploiement rapide en moins de 48h',
        'Formation complète des équipes incluse',
        'Tarification adaptée aux budgets PME',
        'Interface intuitive sans formation complexe',
        'Support en français par des experts',
        'Évolutivité selon la croissance'
      ],
      benefits: [
        'Amélioration immédiate du cash-flow',
        'Professionnalisation du recouvrement',
        'Gain de temps de 60% sur les tâches',
        'ROI positif dès le 3ème mois'
      ],
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600',
      stats: { clients: '300+', volume: '50K+', satisfaction: '96%' }
    },
    {
      icon: Briefcase,
      title: 'Cabinets de Recouvrement',
      subtitle: 'Solutions Métier',
      description: 'Spécialement conçu pour les professionnels du recouvrement',
      features: [
        'Gestion multi-clients et mandats',
        'Facturation automatique des honoraires',
        'Conformité totale avec la réglementation',
        'Modèles de lettres juridiques intégrés',
        'Suivi des procédures judiciaires',
        'Reporting détaillé par mandant'
      ],
      benefits: [
        'Augmentation de la productivité de 80%',
        'Réduction des erreurs de procédure',
        'Amélioration de la satisfaction client',
        'Optimisation de la rentabilité'
      ],
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600',
      stats: { clients: '120+', volume: '200K+', satisfaction: '99%' }
    },
    {
      icon: CreditCard,
      title: 'Secteur Financier',
      subtitle: 'Conformité Renforcée',
      description: 'Banques, assurances, établissements de crédit',
      features: [
        'Conformité réglementaire bancaire',
        'Sécurité renforcée et chiffrement',
        'Audit trail complet et traçabilité',
        'Intégration avec les systèmes core banking',
        'Gestion des provisions et comptabilité',
        'Reporting réglementaire automatisé'
      ],
      benefits: [
        'Réduction du risque de crédit',
        'Conformité réglementaire garantie',
        'Amélioration des ratios prudentiels',
        'Optimisation des provisions'
      ],
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      iconColor: 'text-orange-600',
      stats: { clients: '25+', volume: '500K+', satisfaction: '97%' }
    },
    {
      icon: FileText,
      title: 'Services B2B',
      subtitle: 'Solutions Sectorielles',
      description: 'Entreprises de services aux entreprises',
      features: [
        'Gestion de la facturation récurrente',
        'Suivi des contrats et abonnements',
        'Relances douces préservant la relation',
        'Intégration CRM et facturation',
        'Gestion des échéanciers personnalisés',
        'Alertes préventives de retard'
      ],
      benefits: [
        'Préservation de la relation client',
        'Réduction des impayés de 50%',
        'Automatisation du suivi contrats',
        'Amélioration de la trésorerie'
      ],
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
      iconColor: 'text-pink-600',
      stats: { clients: '200+', volume: '75K+', satisfaction: '95%' }
    },
    {
      icon: Target,
      title: 'E-commerce',
      subtitle: 'Solutions Digitales',
      description: 'Boutiques en ligne et marketplaces',
      features: [
        'Intégration API avec plateformes e-commerce',
        'Gestion des paiements et remboursements',
        'Automatisation complète des processus',
        'Suivi des commandes et livraisons',
        'Gestion multi-devises et pays',
        'Analytics avancées des paiements'
      ],
      benefits: [
        'Réduction des abandons de panier',
        'Amélioration du taux de conversion',
        'Optimisation des flux de paiement',
        'Croissance du chiffre d\'affaires'
      ],
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      iconColor: 'text-indigo-600',
      stats: { clients: '150+', volume: '300K+', satisfaction: '94%' }
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Pour qui ?
            <span className="text-blue-600 block">Solutions Sectorielles</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Notre solution s'adapte à tous les secteurs et tailles d'entreprise. 
            Découvrez comment nous répondons spécifiquement à vos besoins métier.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Secteurs spécialisés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">800+</div>
              <div className="text-sm text-gray-600">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-gray-600">Années d'expertise</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secteurs détaillés */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {sectors.map((sector, index) => (
              <div key={index} className={`${sector.color} border-2 rounded-2xl p-8 transition-all duration-300`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* En-tête du secteur */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-6">
                      <div className="bg-white p-4 rounded-xl shadow-md mr-4">
                        <sector.icon className={`h-8 w-8 ${sector.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{sector.title}</h3>
                        <p className="text-sm font-medium text-gray-600">{sector.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6">{sector.description}</p>
                    
                    {/* Statistiques */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-3">Nos résultats</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Clients</span>
                          <span className="font-medium">{sector.stats.clients}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Dossiers traités</span>
                          <span className="font-medium">{sector.stats.volume}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Satisfaction</span>
                          <span className="font-medium text-green-600">{sector.stats.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <div className="lg:col-span-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités spécialisées</h4>
                    <ul className="space-y-3">
                      {sector.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bénéfices */}
                  <div className="lg:col-span-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Bénéfices métier</h4>
                    <ul className="space-y-3 mb-6">
                      {sector.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <TrendingUp className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold border border-gray-200">
                      Demander une démo secteur
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetPage;