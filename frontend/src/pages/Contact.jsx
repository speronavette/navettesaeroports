const Contact = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-6">Contactez notre service de navette aéroport</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <p className="mb-6 text-lg">
              Vous avez des questions sur notre service de navette aéroport ? 
              Besoin d'informations sur nos vans 8 places ou nos trajets vers les aéroports belges et frontaliers ? 
              Notre équipe familiale est à votre disposition.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Nos coordonnées</h2>
              <div className="space-y-3">
                <p className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span><strong>Email :</strong> navettesaeroportsbelgium@gmail.com</span>
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Horaires de service</h2>
              <p className="mb-4">Notre service de navette aéroport opère :</p>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span><strong>Lundi - Vendredi :</strong></span>
                  <span>24h/24</span>
                </li>
                <li className="flex justify-between">
                  <span><strong>Samedi - Dimanche :</strong></span>
                  <span>24h/24</span>
                </li>
                <li className="flex justify-between">
                  <span><strong>Jours fériés :</strong></span>
                  <span>24h/24</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Pour toute question, veuillez nous contacter par email ou utiliser notre formulaire en ligne.
              </p>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Formulaire de contact</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom complet</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre email"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Téléphone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Sujet</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="reservation">Question sur une réservation</option>
                    <option value="information">Demande d'information</option>
                    <option value="tarif">Demande de tarif spécial</option>
                    <option value="groupe">Réservation pour groupe (plus de 8 personnes)</option>
                    <option value="feedback">Commentaire sur notre service</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre message ici..."
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="w-full btn-primary py-2">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Nos destinations principales de navette aéroport</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-medium mb-2">Navette vers Aéroport de Bruxelles</h3>
              <p className="text-sm text-gray-600">Distance : ~65 km | Temps : ~50 min</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-medium mb-2">Navette vers Aéroport de Brussels South</h3>
              <p className="text-sm text-gray-600">Distance : ~30 km | Temps : ~30 min</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-medium mb-2">Navette vers Gare de Bruxelles-Midi</h3>
              <p className="text-sm text-gray-600">Distance : ~60 km | Temps : ~45 min</p>
            </div>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">FAQ rapide - Questions fréquentes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Combien de passagers pouvez-vous transporter ?</h4>
                <p className="text-gray-600">Nos vans peuvent accueillir jusqu'à 8 passagers avec leurs bagages.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Proposez-vous des sièges enfants ?</h4>
                <p className="text-gray-600">Oui, nous proposons des sièges enfants et des réhausseurs sur demande.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Comment puis-je réserver une navette ?</h4>
                <p className="text-gray-600">Vous pouvez réserver directement en ligne sur notre site, par email ou via notre formulaire de contact.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Combien coûte une navette vers l'aéroport de Bruxelles ?</h4>
                <p className="text-gray-600">Les tarifs varient selon votre lieu de départ. Utilisez notre calculateur de prix pour obtenir un tarif précis.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Quel est le délai de réservation minimum ?</h4>
                <p className="text-gray-600">Nous recommandons de réserver 24h à l'avance, mais nous pouvons accepter des réservations de dernière minute selon disponibilité.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">Besoin d'une navette rapidement ?</h2>
          <p className="mb-6">
            Pour toute réservation urgente de navette aéroport, 
            contactez-nous via notre formulaire en ligne ou par email
          </p>
          <a href="/#calculator" className="btn-primary px-6 py-3 inline-block">
            Calculer le prix de ma navette
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact