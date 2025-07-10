import React from 'react';
import { 
  ArrowRight, 
  Zap,
  BarChart3,
  Shield,
  Globe,
  Eye,
  CheckCircle,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface HomePageProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogin, onNavigate }) => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4 mr-2" />
                  Solution N°1 en France
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  MEWI Recouvrement
                  <span className="text-blue-600 block">Nouvelle Génération</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Optimisez vos processus de recouvrement avec notre solution intelligente. 
                  Automatisation avancée, suivi en temps réel et taux de recouvrement améliorés.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onLogin}
                  className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  Démarrer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => onNavigate('crm')}
                  className="flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-lg"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Découvrir
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">+78%</div>
                  <div className="text-sm text-gray-600">Taux de recouvrement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">-45%</div>
                  <div className="text-sm text-gray-600">Temps de traitement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Entreprises clientes</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Dashboard Recouvrement</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.5M€</div>
                      <div className="text-sm text-gray-600">Créances totales</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-gray-600">Taux de succès</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progression mensuelle</span>
                      <span className="text-sm font-medium text-green-600">+12.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une suite complète d'outils pour optimiser votre processus de recouvrement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Automatisation',
                description: 'Relances automatiques intelligentes',
                color: 'bg-yellow-100 text-yellow-600'
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Tableaux de bord en temps réel',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: Shield,
                title: 'Sécurité',
                description: 'Protection des données clients',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: Globe,
                title: 'Multi-canal',
                description: 'Email, SMS, appels intégrés',
                color: 'bg-purple-100 text-purple-600'
              }
            ].map((feature, index) => (
              <div key={index} className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dubois",
                role: "Directrice Financière",
                company: "TechCorp",
                content: "Grâce à cette solution, nous avons amélioré notre taux de recouvrement de 35% en seulement 6 mois.",
                rating: 5
              },
              {
                name: "Pierre Martin",
                role: "Responsable Crédit",
                company: "FinanceGroup",
                content: "L'automatisation des relances nous fait gagner un temps précieux. Interface intuitive et résultats excellents.",
                rating: 5
              },
              {
                name: "Sophie Leroy",
                role: "CEO",
                company: "StartupInnovante",
                content: "Solution parfaite pour une PME comme la nôtre. Support client exceptionnel et ROI rapide.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircle key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;