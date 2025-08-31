import React from 'react';
import { Building, Target, Users, Award, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Building,
      title: 'Professionnalisme',
      description: 'Une approche rigoureuse et éthique dans toutes nos interventions'
    },
    {
      icon: Target,
      title: 'Efficacité',
      description: 'Des résultats concrets grâce à notre expertise et nos méthodes éprouvées'
    },
    {
      icon: Users,
      title: 'Proximité',
      description: 'Un accompagnement personnalisé et un contact direct avec nos experts'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Un engagement constant vers l\'amélioration de nos services'
    }
  ];

  const achievements = [
    'Plus de 15 ans d\'expérience',
    'Plus de 500 clients accompagnés',
    '85% de taux de réussite',
    'Équipe de juristes qualifiés',
    'Couverture nationale',
    'Certifications professionnelles'
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos de nous</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            MEWI RECOUVREMENT, votre partenaire de confiance pour le recouvrement de créances
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre histoire</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Fondée avec la mission de fournir des services de recouvrement de créances 
                  professionnels et éthiques, MEWI RECOUVREMENT s'est imposée comme un acteur 
                  de référence dans le secteur.
                </p>
                <p>
                  Notre équipe d'experts juridiques combine expertise technique et approche 
                  humaine pour offrir des solutions adaptées à chaque situation. Nous intervenons 
                  sur l'ensemble du territoire sénégalais et accompagnons nos clients dans 
                  toutes leurs démarches de recouvrement.
                </p>
                <p>
                  Fort de notre expérience et de notre connaissance approfondie du droit 
                  commercial, nous garantissons un service professionnel respectueux de 
                  la réglementation en vigueur.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" 
                alt="Modern office" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
            <p className="text-lg text-gray-600">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg" 
                alt="Professional team meeting" 
                className="rounded-lg shadow-xl"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nos réalisations</h2>
              <p className="text-lg text-gray-600 mb-6">
                Des résultats concrets qui témoignent de notre expertise et de notre engagement
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre équipe</h2>
            <p className="text-lg text-gray-600">
              Des professionnels expérimentés à votre service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" 
                alt="Team member"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Direction Générale</h3>
                <p className="text-gray-600 mb-3">Stratégie et développement</p>
                <p className="text-sm text-gray-500">
                  15+ années d'expérience dans le secteur financier et juridique
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg" 
                alt="Team member"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Équipe Juridique</h3>
                <p className="text-gray-600 mb-3">Experts en droit commercial</p>
                <p className="text-sm text-gray-500">
                  Juristes spécialisés en recouvrement et contentieux
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg" 
                alt="Team member"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Client</h3>
                <p className="text-gray-600 mb-3">Accompagnement et suivi</p>
                <p className="text-sm text-gray-500">
                  Conseillers dédiés pour un service personnalisé
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Notre mission</h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            "Accompagner nos clients dans la récupération de leurs créances en privilégiant 
            le dialogue et la négociation, tout en garantissant le respect de la réglementation 
            et des droits de chacun."
          </p>
        </div>
      </section>
    </div>
  );
}