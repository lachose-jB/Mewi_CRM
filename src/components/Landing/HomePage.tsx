import React from 'react';
import { Shield, Users, Award, TrendingUp, CheckCircle, ArrowRight, Zap, Eye } from 'lucide-react'; // Ajout Zap, Eye
import { motion, AnimatePresence } from 'framer-motion'; // 🔥 Import Framer Motion

interface HomePageProps {
  onNavigate: (page: string) => void;
  onLogin?: () => void; // Ajout onLogin optionnel
}

export default function HomePage({ onNavigate, onLogin }: HomePageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Notre métier',
      description: `Composée de juristes expérimentés de haut niveau.`
    },
    {
      icon: Users,
      title: 'Nos valeurs',
      description: `Nous plaçons l’éthique et l’efficacité au cœur de nos actions.`
    },
    {
      icon: Award,
      title: 'Nos références',
      description: `De grands établissements financiers nous font confiance.`
    },
    {
      icon: TrendingUp,
      title: 'Nos sites de production',
      description: `- MEWI FINANCES Sénégal
      - MEWI FINANCES France`
    }
  ];

  const services = [
    'Gestion préventive du risque',
    'Relance commerciale',
    'Enquête civile Débiteurs Introuvables',
    'Recouvrement amiable',
    'Recouvrement judiciaire'
  ];

  const heroSlides = [
    {
      title: "Mewi Finances",
      subtitle: "Leader sénégalais du recouvrement",
      description: (
        <>
          Depuis sa création en <span className="font-semibold">2022</span>, MEWI FINANCES a centré son organisation autour de la satisfaction client, grâce à une organisation optimale de ses services.<br />
          Le recouvrement de créances, ainsi que la gestion immobilière sont au cœur de nos domaines de compétences.
        </>
      ),
      img: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
    },
    {
      title: "Nos domaines de compétences",
      description: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3 text-blue-100 text-base list-disc list-inside">
            <li className="font-semibold">Droit des affaires et fiscalité</li>
            <li className="font-semibold">Droit privé général</li>
            <li className="font-semibold">Droit des affaires internationales</li>
            <li className="font-semibold">Droit foncier</li>
            <li className="font-semibold">Droit administratif</li>
          </ul>
          <ul className="space-y-3 text-blue-100 text-base list-disc list-inside">
            <li className="font-semibold">Droit de la propriété intellectuelle</li>
            <li className="font-semibold">Droit du travail</li>
            <li className="font-semibold">Management commercial</li>
            <li className="font-semibold">Ingénierie financière</li>
            <li className="font-semibold">Communication</li>
            <li className="font-semibold">Community Manager</li>
          </ul>
        </div>
      ),
      img: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
    },
    {
      title: "MEWI Recouvrement Nouvelle Génération",
      subtitle: "Solution N°1 en France",
      description: (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Solution N°1 en France
            </div>
            <p className="text-xl text-white-600 leading-relaxed">
              Optimisez vos processus de recouvrement avec notre solution intelligente. 
              Automatisation avancée, suivi en temps réel et taux de recouvrement améliorés.
            </p>
          </div>
        </div>
      ),
      img: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg"
    }
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [direction, setDirection] = React.useState(1); // 🔥 direction du slide
  const [selectedFeature, setSelectedFeature] = React.useState<number | null>(null);

  const featuresDetails = [
    {
      title: 'Expertise juridique',
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-2">Expertise juridique</h3>
          <p>
            MEWI FINANCES dispose de compétences diverses 
      et des moyens nécessaires pour appréhender toutes les problématiques juridiques et judiciaires 
      auxquelles vous pouvez être confrontés. 
      Nos collaborateurs, appuyés par un réseau de partenaires (avocats, huissiers), 
      interviennent à chaque étape du recouvrement des créances et réalisent des enquêtes civiles 
      et financières. 
      Nous accompagnons également les bailleurs en gestion immobilière (recherche de locataires, 
      rédaction de baux, remise en état des biens).
          </p>
        </div>
      )
    },
    {
      title: 'Accompagnement personnalisé',
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-2">Accompagnement personnalisé</h3>
          <p>
            Chaque dossier est traité avec rigueur, transparence et une attention particulière portée à la 
      relation client.
          </p>
        </div>
      )
    },
    {
      title: 'Taux de réussite élevé',
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-2">Taux de réussite élevé</h3>
          <p>
             depuis plusieurs années 
      pour nos services de recouvrement et de conseil.
          </p>
        </div>
      )
    },
    {
      title: 'Résultats rapides',
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-2">Résultats rapides</h3>
          <p>
            MEWI FINANCES Sénégal :<br /> 
              - Dakar : [Adresse à préciser]<br /> 
              - Mbour : [Adresse à préciser]<br /> 
            Nous intervenons sur tout le territoire sénégalais. <br />  <br /> 
            MEWI FINANCES France : Solutions globales de recouvrement en Europe via un réseau de partenaires.
          </p>
        </div>
      )
    }
  ];

  function nextSlide() {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }

  function prevSlide() {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }

  // 🔥 Auto-scroll toutes les 6 secondes
  React.useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Variants Framer Motion pour slide horizontal
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8 }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.8 }
    })
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={direction}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {heroSlides[currentSlide].title}
                    <span className="block text-blue-200">{heroSlides[currentSlide].subtitle}</span>
                  </h1>
                  <div className="text-xl mb-6 text-blue-100">
                    {heroSlides[currentSlide].description}
                  </div>
                  <div className="flex gap-2 mt-6 justify-center">
                    <button
                      onClick={prevSlide}
                      className="bg-blue-900/50 hover:bg-blue-900 text-white px-3 py-1 rounded-full"
                      aria-label="Précédent"
                    >
                      ◀
                    </button>
                    <button
                      onClick={nextSlide}
                      className="bg-blue-900/50 hover:bg-blue-900 text-white px-3 py-1 rounded-full"
                      aria-label="Suivant"
                    >
                      ▶
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="relative">
              <AnimatePresence custom={direction} mode="wait">
                <motion.img
                  key={heroSlides[currentSlide].img}
                  src={heroSlides[currentSlide].img}
                  alt="Hero slide"
                  className="rounded-lg shadow-2xl"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={direction}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-blue-600/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Qui sommes – nous ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre expertise et notre approche personnalisée garantissent 
              un recouvrement efficace de vos créances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${selectedFeature === index ? 'ring-2 ring-blue-600' : ''}`}
                onClick={() => setSelectedFeature(index)}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          {selectedFeature !== null && (
            <AnimatePresence>
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
              >
                {featuresDetails[selectedFeature].content}
                <div className="text-right mt-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedFeature(null)}
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nos solutions
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Le Cabinet Mewi Finances  vous fait profiter de son expertise juridique dans les domaines de recouvrement des créances,  de gestion immobilière.
              </p>
              
              <ul className="space-y-3 mb-8">
                {services.map((service, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onNavigate('services')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span>Découvrir nos services</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg" 
                alt="Professional team" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">85%</div>
              <div className="text-blue-200">Taux de réussite</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">15</div>
              <div className="text-blue-200">Années d'expérience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à récupérer vos créances ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et personnalisée
          </p>
          <button 
            onClick={() => onNavigate('contact')}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
          >
            <span>Demander un devis gratuit</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Rejoignez-nous</h2>
            <p className="text-lg text-blue-800 mb-6">
              Pour rejoindre nos équipes, communiquez-nous votre CV et lettre de motivation.<br />
              N'hésitez pas à nous contacter pour toute question !
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulaire de candidature */}
            <form
              className="bg-white rounded-lg shadow-lg p-8 flex flex-col space-y-4"
              action="mailto:info@mefinances.com"
              method="POST"
              encType="multipart/form-data"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Envoyer votre candidature</h3>
              <input
                type="text"
                name="name"
                required
                placeholder="Votre nom"
                className="border border-blue-300 rounded px-4 py-2"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Votre email"
                className="border border-blue-300 rounded px-4 py-2"
              />
              <textarea
                name="message"
                required
                placeholder="Votre lettre de motivation"
                className="border border-blue-300 rounded px-4 py-2"
                rows={4}
              />
              <input
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx"
                className="border border-blue-300 rounded px-4 py-2"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition-colors"
              >
                Envoyer
              </button>
            </form>
            {/* Contact & réseaux */}
            <div className="flex flex-col justify-center items-center space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Contact</h3>
                <p className="text-blue-800 mb-2">MEWI FINANCES SENEGAL</p>
                <p className="text-blue-800 mb-4">MEWI FINANCES FRANCE</p>
                <p className="text-gray-700 mb-2">Email : <a href="mailto:info@mefinances.com" className="text-blue-600 underline">info@mefinances.com</a></p>
                <form
                  action="mailto:info@mefinances.com"
                  method="POST"
                  className="flex flex-col space-y-2"
                >
                  <input
                    type="text"
                    name="contact_name"
                    required
                    placeholder="Votre nom"
                    className="border border-blue-300 rounded px-4 py-2"
                  />
                  <input
                    type="email"
                    name="contact_email"
                    required
                    placeholder="Votre email"
                    className="border border-blue-300 rounded px-4 py-2"
                  />
                  <textarea
                    name="contact_message"
                    required
                    placeholder="Votre message"
                    className="border border-blue-300 rounded px-4 py-2"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold transition-colors"
                  >
                    Envoyer
                  </button>
                </form>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" className="w-8 h-8 hover:scale-110 transition-transform" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:scale-110 transition-transform" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" className="w-8 h-8 hover:scale-110 transition-transform" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" className="w-8 h-8 hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}