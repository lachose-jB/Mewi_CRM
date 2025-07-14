import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Calendar,
  Users,
  Building,
  Globe,
  HeadphonesIcon,
  Zap,
  Shield,
  Award
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    subject: 'demo',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Contactez-nous
            <span className="text-blue-600 block">Parlons de votre projet</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Prêt à transformer votre processus de recouvrement ? Notre équipe d'experts 
            est là pour vous accompagner dans votre projet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24h</div>
              <div className="text-sm text-gray-600">Réponse garantie</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">15min</div>
              <div className="text-sm text-gray-600">Démo personnalisée</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">0€</div>
              <div className="text-sm text-gray-600">Audit gratuit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact principal */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nos Coordonnées</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Plusieurs moyens de nous contacter selon vos préférences et l'urgence de votre demande.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Siège Social</h3>
                    <p className="text-gray-600">
                      123 Avenue des Champs-Élysées<br />
                      75008 Paris, France
                    </p>
                    <p className="text-sm text-blue-600 mt-1">Métro : Franklin D. Roosevelt</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                    <p className="text-sm text-green-600 mt-1">Appel gratuit depuis la France</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">contact@crm-recouvrement.fr</p>
                    <p className="text-sm text-purple-600 mt-1">Réponse sous 24h garantie</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
                    <div className="text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Lundi - Vendredi</span>
                        <span className="font-medium">9h00 - 18h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samedi</span>
                        <span className="font-medium">9h00 - 12h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimanche</span>
                        <span className="font-medium text-red-600">Fermé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support d'urgence */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <Zap className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="font-semibold text-red-900">Support d'urgence</h3>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  Pour nos clients : assistance technique 24/7 en cas de problème critique
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-red-900 font-medium">+33 1 23 45 67 90</span>
                  <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">Clients uniquement</span>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Demande d'information</h3>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Message envoyé !</h4>
                  <p className="text-gray-600">
                    Nous vous recontacterons dans les 24h. Merci pour votre intérêt !
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email professionnel *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise *</label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sujet de votre demande *</label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="demo">Demande de démonstration</option>
                      <option value="pricing">Information tarifaire</option>
                      <option value="integration">Question technique/intégration</option>
                      <option value="partnership">Partenariat</option>
                      <option value="support">Support client</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Décrivez votre projet, vos besoins ou vos questions..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer la demande
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Autres moyens de contact */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Autres Moyens de Contact
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le canal qui vous convient le mieux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Réserver un créneau',
                description: 'Planifiez un appel avec un expert',
                action: 'Calendrier en ligne',
                color: 'bg-blue-100 text-blue-600',
                bgColor: 'bg-blue-50'
              },
              {
                icon: MessageSquare,
                title: 'Chat en direct',
                description: 'Support instantané pendant les heures ouvrées',
                action: 'Démarrer le chat',
                color: 'bg-green-100 text-green-600',
                bgColor: 'bg-green-50'
              },
              {
                icon: Users,
                title: 'Webinaire',
                description: 'Participez à nos sessions de présentation',
                action: 'Prochaines dates',
                color: 'bg-purple-100 text-purple-600',
                bgColor: 'bg-purple-50'
              },
              {
                icon: Building,
                title: 'Visite sur site',
                description: 'Rencontrez notre équipe dans nos bureaux',
                action: 'Prendre RDV',
                color: 'bg-orange-100 text-orange-600',
                bgColor: 'bg-orange-50'
              }
            ].map((contact, index) => (
              <div key={index} className={`${contact.bgColor} border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all`}>
                <div className={`w-16 h-16 ${contact.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <contact.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  {contact.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bureaux régionaux */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Bureaux
            </h2>
            <p className="text-xl text-gray-600">
              Une présence nationale pour mieux vous servir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                city: 'Paris',
                type: 'Siège Social',
                address: '123 Avenue des Champs-Élysées\n75008 Paris',
                phone: '+33 1 23 45 67 89',
                email: 'paris@crm-recouvrement.fr',
                team: '35 personnes'
              },
              {
                city: 'Lyon',
                type: 'Bureau Régional',
                address: '45 Rue de la République\n69002 Lyon',
                phone: '+33 4 78 90 12 34',
                email: 'lyon@crm-recouvrement.fr',
                team: '12 personnes'
              },
              {
                city: 'Lille',
                type: 'Bureau Régional',
                address: '78 Grand Place\n59000 Lille',
                phone: '+33 3 20 56 78 90',
                email: 'lille@crm-recouvrement.fr',
                team: '8 personnes'
              }
            ].map((office, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{office.city}</h3>
                    <p className="text-sm text-blue-600">{office.type}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-600 whitespace-pre-line">{office.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{office.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{office.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{office.team}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Contact */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Les réponses aux questions les plus courantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'Quel est le délai de réponse ?',
                answer: 'Nous nous engageons à répondre à toute demande dans les 24h ouvrées. Pour les urgences, notre support client répond en moins de 2h.'
              },
              {
                question: 'La démonstration est-elle gratuite ?',
                answer: 'Oui, nous proposons une démonstration personnalisée gratuite de 30 minutes adaptée à vos besoins spécifiques.'
              },
              {
                question: 'Proposez-vous un audit gratuit ?',
                answer: 'Nous offrons un audit gratuit de vos processus actuels avec des recommandations personnalisées pour optimiser votre recouvrement.'
              },
              {
                question: 'Comment se déroule l\'implémentation ?',
                answer: 'Notre équipe vous accompagne de A à Z : analyse, paramétrage, formation, mise en production et suivi. Délai moyen : 2-4 semaines.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour découvrir comment transformer votre processus de recouvrement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg">
              Démo gratuite
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
              Appeler maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;