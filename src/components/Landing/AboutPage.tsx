import React from 'react';
import { 
  Award, 
  Shield, 
  HeadphonesIcon, 
  TrendingUp,
  Users,
  Globe,
  Clock,
  Target,
  CheckCircle,
  Star,
  Building,
  Briefcase,
  GraduationCap,
  Heart,
  Lightbulb,
  Zap,
  Eye,
  Handshake
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
                  PRESENTATION DE MEWI-FINANCES ET RECOUVREMENT
                  <span className="text-blue-600 block"></span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Depuis plus de 15 ans, nous développons des solutions innovantes pour 
                  optimiser les processus de recouvrement. Notre expertise technique et 
                  notre connaissance métier nous permettent de proposer la solution la 
                  plus avancée du marché.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nous accompagnons plus de 800 entreprises dans leur transformation 
                  digitale du recouvrement, avec des résultats mesurables et un ROI 
                  démontré.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">Années d'expérience</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-green-600">800+</div>
                  <div className="text-sm text-gray-600">Clients satisfaits</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-600">Experts dédiés</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-orange-600">99.9%</div>
                  <div className="text-sm text-gray-600">Disponibilité</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notre Mission</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Target className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Transformer le recouvrement</h4>
                      <p className="text-gray-600 text-sm">Révolutionner les processus traditionnels avec l'innovation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-6 w-6 text-red-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Préserver les relations</h4>
                      <p className="text-gray-600 text-sm">Maintenir la qualité relationnelle client-fournisseur</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Lightbulb className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Innover constamment</h4>
                      <p className="text-gray-600 text-sm">Anticiper les besoins futurs du marché</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notre Histoire */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Notre Parcours
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              15 années d'innovation et de croissance au service de nos clients
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
            
            <div className="space-y-12">
              {[
                {
                  year: '2009',
                  title: 'Création de l\'entreprise',
                  description: 'Fondation par une équipe d\'experts en recouvrement et développement logiciel',
                  icon: Building,
                  side: 'left'
                },
                {
                  year: '2012',
                  title: 'Premier client bancaire',
                  description: 'Déploiement de notre solution dans une banque régionale, validation du marché',
                  icon: Award,
                  side: 'right'
                },
                {
                  year: '2015',
                  title: 'Expansion nationale',
                  description: '100 clients, ouverture de bureaux régionaux, équipe de 20 personnes',
                  icon: Globe,
                  side: 'left'
                },
                {
                  year: '2018',
                  title: 'Innovation IA',
                  description: 'Intégration de l\'intelligence artificielle pour les prédictions de recouvrement',
                  icon: Zap,
                  side: 'right'
                },
                {
                  year: '2021',
                  title: 'Certification ISO 27001',
                  description: 'Obtention de la certification sécurité, renforcement de la confiance client',
                  icon: Shield,
                  side: 'left'
                },
                {
                  year: '2024',
                  title: 'Leader du marché',
                  description: '800+ clients, 50+ collaborateurs, solution nouvelle génération',
                  icon: Star,
                  side: 'right'
                }
              ].map((milestone, index) => (
                <div key={index} className={`flex items-center ${milestone.side === 'right' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-1/2 ${milestone.side === 'right' ? 'pl-8' : 'pr-8'}`}>
                    <div className={`bg-white rounded-xl shadow-lg p-6 ${milestone.side === 'right' ? 'text-right' : ''}`}>
                      <div className="flex items-center mb-4">
                        <div className={`bg-blue-100 p-3 rounded-lg ${milestone.side === 'right' ? 'ml-auto' : 'mr-4'}`}>
                          <milestone.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        {milestone.side === 'left' && (
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{milestone.year}</div>
                            <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                          </div>
                        )}
                        {milestone.side === 'right' && (
                          <div className="mr-4">
                            <div className="text-2xl font-bold text-blue-600">{milestone.year}</div>
                            <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nos Valeurs */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Excellence',
                description: 'Nous visons l\'excellence dans chaque fonctionnalité, chaque interaction client et chaque ligne de code.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: Shield,
                title: 'Sécurité',
                description: 'La protection des données sensibles est notre priorité absolue avec les plus hauts standards de sécurité.',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: HeadphonesIcon,
                title: 'Support',
                description: 'Un accompagnement personnalisé et réactif pour garantir le succès de nos clients.',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: TrendingUp,
                title: 'Innovation',
                description: 'Nous investissons constamment dans les technologies de pointe pour rester à l\'avant-garde.',
                color: 'bg-orange-100 text-orange-600'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notre Équipe */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600">
              Des experts passionnés au service de votre réussite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: 'Jean-Pierre Dubois',
                role: 'CEO & Fondateur',
                experience: '20 ans en recouvrement',
                description: 'Expert reconnu du secteur, ancien directeur de recouvrement dans une grande banque.',
                icon: Briefcase
              },
              {
                name: 'Marie-Claire Martin',
                role: 'CTO',
                experience: '15 ans en développement',
                description: 'Architecte logiciel passionnée par l\'innovation et les nouvelles technologies.',
                icon: GraduationCap
              },
              {
                name: 'Pierre Leroy',
                role: 'Directeur Commercial',
                experience: '12 ans en solutions B2B',
                description: 'Spécialiste de l\'accompagnement client et de la transformation digitale.',
                icon: Handshake
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <member.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 mb-3">{member.experience}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>

          {/* Statistiques équipe */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Collaborateurs</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-blue-100">Ingénieurs</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="text-blue-100">Années d'ancienneté moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Satisfaction interne</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications et Partenaires */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Certifications & Labels</h3>
              <div className="space-y-6">
                {[
                  {
                    title: 'ISO 27001',
                    description: 'Certification sécurité de l\'information',
                    icon: Shield,
                    color: 'bg-green-100 text-green-600'
                  },
                  {
                    title: 'RGPD Compliant',
                    description: 'Conformité totale au règlement européen',
                    icon: Eye,
                    color: 'bg-blue-100 text-blue-600'
                  },
                  {
                    title: 'HDS Hébergeur',
                    description: 'Hébergement de données de santé',
                    icon: HeadphonesIcon,
                    color: 'bg-purple-100 text-purple-600'
                  }
                ].map((cert, index) => (
                  <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow">
                    <div className={`w-12 h-12 ${cert.color} rounded-lg flex items-center justify-center mr-4`}>
                      <cert.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                      <p className="text-sm text-gray-600">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partenaires */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Partenaires Technologiques</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Microsoft Azure',
                  'Amazon AWS',
                  'Salesforce',
                  'SAP',
                  'Oracle',
                  'Sage',
                  'Cegid',
                  'OVH Cloud'
                ].map((partner, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Building className="h-6 w-6 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement RSE */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Notre Engagement RSE
            </h2>
            <p className="text-xl text-gray-600">
              Une entreprise responsable et engagée pour l'avenir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Environnement',
                description: 'Hébergement 100% énergies renouvelables, bureaux éco-responsables',
                actions: ['Serveurs verts', 'Télétravail encouragé', 'Zéro papier']
              },
              {
                icon: Users,
                title: 'Social',
                description: 'Bien-être au travail, diversité et inclusion, formation continue',
                actions: ['Égalité H/F', 'Formation 40h/an', 'Télétravail flexible']
              },
              {
                icon: Heart,
                title: 'Solidarité',
                description: 'Soutien aux associations, mécénat de compétences',
                actions: ['Pro bono 5%', 'Bénévolat encouragé', 'Dons réguliers']
              }
            ].map((engagement, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <engagement.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{engagement.title}</h3>
                <p className="text-gray-600 mb-4">{engagement.description}</p>
                <ul className="space-y-2">
                  {engagement.actions.map((action, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rejoignez l'aventure !
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nous recrutons des talents passionnés pour continuer à innover ensemble.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg">
              Voir nos offres
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
              Candidature spontanée
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;