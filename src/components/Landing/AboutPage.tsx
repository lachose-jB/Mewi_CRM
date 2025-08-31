import React from 'react';
import { Scale, Shield, FileText, AlertCircle } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Mentions Légales</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Informations légales et conditions d'utilisation
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Informations légales</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Raison sociale :</h3>
                <p>MEWI RECOUVREMENT SARL</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Siège social :</h3>
                <p>Dakar, Sénégal</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Forme juridique :</h3>
                <p>Société à Responsabilité Limitée (SARL)</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Activité :</h3>
                <p>Recouvrement de créances commerciales et civiles</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Directeur de publication :</h3>
                <p>Direction Générale</p>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Protection des données personnelles</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Conformément à la loi sur la protection des données personnelles, 
                nous nous engageons à protéger la confidentialité de vos informations.
              </p>
              
              <h3 className="font-semibold mt-6 mb-2">Collecte des données :</h3>
              <p>
                Les données personnelles collectées via notre site web (nom, email, téléphone) 
                sont utilisées uniquement dans le cadre de nos services de recouvrement 
                et ne sont jamais communiquées à des tiers sans votre autorisation.
              </p>
              
              <h3 className="font-semibold mt-6 mb-2">Utilisation des données :</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Traitement de vos demandes de devis</li>
                <li>Communication sur nos services</li>
                <li>Gestion de la relation client</li>
                <li>Respect de nos obligations légales</li>
              </ul>
              
              <h3 className="font-semibold mt-6 mb-2">Vos droits :</h3>
              <p>
                Vous disposez d'un droit d'accès, de rectification et de suppression 
                de vos données personnelles. Pour exercer ces droits, contactez-nous 
                à l'adresse : contact@mewi-recouvrement.sn
              </p>
            </div>
          </div>

          {/* Terms of Service */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Conditions d'utilisation</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <h3 className="font-semibold mb-2">Utilisation du site :</h3>
              <p>
                L'utilisation de ce site web implique l'acceptation pleine et entière 
                des conditions générales d'utilisation décrites ci-après.
              </p>
              
              <h3 className="font-semibold mt-6 mb-2">Propriété intellectuelle :</h3>
              <p>
                Tous les contenus présents sur ce site (textes, images, logos) sont 
                protégés par le droit d'auteur et appartiennent à MEWI RECOUVREMENT.
              </p>
              
              <h3 className="font-semibold mt-6 mb-2">Responsabilité :</h3>
              <p>
                MEWI RECOUVREMENT s'efforce de fournir des informations exactes et à jour. 
                Cependant, nous ne pouvons garantir l'exactitude, la complétude ou 
                l'actualité de toutes les informations présentes sur le site.
              </p>
            </div>
          </div>

          {/* Professional Regulations */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Réglementation professionnelle</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                MEWI RECOUVREMENT exerce son activité dans le strict respect de la 
                réglementation sénégalaise en matière de recouvrement de créances.
              </p>
              
              <h3 className="font-semibold mt-6 mb-2">Autorisations :</h3>
              <p>
                Notre société dispose de toutes les autorisations nécessaires pour 
                exercer l'activité de recouvrement de créances au Sénégal.
              </p>
              
              <h3 className="font-semibold mt-6 mb-2">Code de déontologie :</h3>
              <p>
                Nous respectons strictement le code de déontologie de la profession, 
                garantissant un service éthique et professionnel à nos clients.
              </p>
              
              <h3 className="font-semibold mt-6 mb-2">Assurance professionnelle :</h3>
              <p>
                MEWI RECOUVREMENT est couverte par une assurance responsabilité civile 
                professionnelle pour l'ensemble de ses activités.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}