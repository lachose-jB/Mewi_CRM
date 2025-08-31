import React from 'react';
import { Shield, Gavel, FileText, Clock, Users, Target } from 'lucide-react';

export default function ServicesPage() {
  const [hoveredServiceId, setHoveredServiceId] = React.useState<number | null>(null);

  const services = [
    {
      id: 1,
      icon: Shield,
      title: 'Gestion préventive du risque',
      intro: "Nous vous assistons dès l’entrée en relation commerciale, au moment de la première facturation, afin que l’encours détenu n’évolue vers un risque. Nous vous aidons à anticiper ces évolutions, grâce à nos techniques d’accompagnement, et en plaçant la satisfaction client au cœur de notre démarche.",
      details: (
        <>
          <br />
          Les retards de paiement alourdissent les comptes financiers de votre entreprise et fragilisent vos trésoreries. Nous intervenons pour :
          <ul className="list-disc list-inside mt-2 text-gray-700">
            <li>La mise en place d’une antenne de relance quotidienne rappelant aux clients leurs dates d’échéances par mails, téléphone, SMS</li>
            <li>L’anticipation sur les dates de règlement évitant un éventuel impayé</li>
          </ul>
        </>
      ),
      color: 'blue'
    },
    {
      id: 2,
      icon: Users,
      title: 'Relance commerciale',
      intro: "Dès que l’impayé est constaté, nous pouvons relancer votre client. Cela permet d’identifier rapidement les litiges, de permettre aux clients de bonne foi de régler rapidement et de détecter les « réels mauvais payeurs ». Cette étape est fondamentale dans le processus global de recouvrement et permet d’éviter que certaines situations ne se dégradent.",
      details: (
        <>
          <br />
          Nos conseillers, formés aux méthodes de négociation par téléphone, s’impliquent positivement dans votre relation client.<br /><br />
          En plus des reporting et suivis réguliers, MEWI met à disposition un extranet pour l’échange d’informations et le suivi des transactions.
        </>
      ),
      color: 'green'
    },
    {
      id: 3,
      icon: FileText,
      title: 'Enquête civile Débiteurs Introuvables',
      intro: "Notre équipe de recouvrement procède à la fois à une géolocalisation de vos débiteurs et mène parallèlement une enquête de solvabilité sur ces derniers en un temps record.",
      details: (
        <>
          <br />
          Il s’agit entre autres de :
          <ul className="list-disc list-inside mt-2 text-gray-700">
            <li>Localiser la nouvelle adresse du débiteur à l’appui d’une photo et croquis</li>
            <li>Obtenir les coordonnées (téléphone, mails) sur le territoire sénégalais ou européen</li>
            <li>Retrouver le client salarié disparu avec ses nouvelles filiations contractuelles sur le territoire sénégalais ou européen</li>
            <li>Retrouver le client personne morale (changement de dénomination sociale, changement d’adresse, changement de logo, etc.)</li>
          </ul>
        </>
      ),
      color: 'green'
    },
    {
      id: 4,
      icon: Shield,
      title: 'Recouvrement amiable',
      intro: "MEWI offre son expertise ainsi que les méthodes, outils et effectifs adaptés à ses clients partenaires. Nos équipes, spécialisées en recouvrement amiable de créances, recherchent des solutions auprès de vos clients débiteurs.",
      details: (
        <>
          <br />
          <ul className="list-disc list-inside mt-2 text-gray-700">
            <li>Le contact téléphonique direct est privilégié mais tous les canaux de communication sont utilisés (courrier, fax, mail, SMS) pour permettre un recouvrement efficace et personnalisé</li>
            <li>MEWI négocie et veille au respect des accords de règlement</li>
            <li>Le recouvrement amiable est adapté à la situation de chaque client</li>
            <li>Votre interlocuteur privilégié pilote le partenariat en liaison avec les équipes opérationnelles de terrain (huissiers, avocats...)</li>
          </ul>
          <br />
          En plus des reporting et suivis réguliers, MEWI met à votre disposition un extranet pour l’échange d’informations et le suivi des transactions. Pour les cas les plus difficiles, nous vous proposerons le recouvrement judiciaire.
        </>
      ),
      color: 'blue'
    },
    {
      id: 5,
      icon: Gavel,
      title: 'Recouvrement judiciaire',
      intro: "En matière de recouvrements de créances judiciaires, nous affichons des taux de réussite de plus de 85%, celui de fidélisation proche de 95%, et une moyenne de 90 jours passés par dossier en phase contentieuse.",
      details: (
        <>
          <br />
          <ul className="list-disc list-inside mt-2 text-gray-700">
            <li>Nous entamons toujours les négociations en recherchant la conciliation</li>
            <li>MEWI pratique des études de solvabilité de vos clients afin de trouver les solutions de recouvrement judiciaire les plus adaptées</li>
            <li>Vous bénéficiez d’un réseau étendu d’huissiers et d’avocats reconnus pour leur savoir-faire et leur efficacité</li>
          </ul>
          <br />
          En plus des reporting et suivis réguliers, MEWI met à disposition un extranet pour l’échange d’informations et le suivi des transactions.
        </>
      ),
      color: 'blue'
    }
  ];

  const advantages = [
    {
      icon: Clock,
      title: 'Rapidité d\'intervention',
      description: 'Prise en charge sous 24h'
    },
    {
      icon: Users,
      title: 'Équipe experte',
      description: 'Juristes spécialisés'
    },
    {
      icon: Target,
      title: 'Résultats garantis',
      description: '85% de taux de réussite'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Une gamme complète de services de recouvrement adaptés à vos besoins spécifiques
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredServiceId(service.id)}
                onMouseLeave={() => setHoveredServiceId(null)}
                className={`bg-white rounded-lg overflow-hidden transition-shadow ${
                  hoveredServiceId === service.id ? 'shadow-lg' : ''
                }`}>
                <div id={`service-card-${service.id}`} className={`bg-${service.color}-50 p-6 border-b`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${service.color}-100 rounded-lg flex items-center justify-center`}>
                      <service.icon className={`w-6 h-6 text-${service.color}-600`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <div className="text-gray-600 mt-4 min-h-[60px]">{service.intro}</div>
                  <div
                    id={`service-details-${service.id}`}
                    className={`text-gray-700 mt-2 transition-all duration-300 max-h-0 overflow-hidden ${
                      hoveredServiceId === service.id ? 'max-h-[500px] mt-4' : ''
                    }`}
                  >
                    {service.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre processus</h2>
            <p className="text-lg text-gray-600">Une approche méthodique pour maximiser vos chances de recouvrement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Analyse</h3>
              <p className="text-gray-600">Étude approfondie de votre dossier</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Stratégie</h3>
              <p className="text-gray-600">Définition de la meilleure approche</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Action</h3>
              <p className="text-gray-600">Mise en œuvre des procédures</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Résultats</h3>
              <p className="text-gray-600">Recouvrement de vos créances</p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Nos engagements</h2>
          <ul className="list-disc list-inside text-lg text-blue-900 space-y-4">
            <li>Déontologie</li>
            <li>Respect du secret bancaire, de la personne, de la vie privée et du contenu des fichiers informatiques</li>
            <li>Éthique</li>
            <li>Respect de nos clients et de leurs propres clients</li>
          </ul>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos avantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <advantage.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}