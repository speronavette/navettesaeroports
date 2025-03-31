const About = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-6">À propos de notre service de navette aéroport</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <p className="mb-4 text-lg">
            <strong>Navette Aéroport Express</strong> est une entreprise familiale belge
            spécialisée dans le transport de passagers vers tous les aéroports belges et frontaliers 
            depuis plus de 10 ans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notre histoire</h2>
            <p className="mb-4">
            Fondée en 2010 par une famille passionnée par le service client, notre entreprise de navette aéroport a démarré avec un seul van et une mission claire : offrir un service de transport fiable, ponctuel et confortable vers les aéroports.
            </p>
            <p className="mb-4">
            Au fil des années, nous avons élargi notre flotte et notre zone de service, tout en conservant une approche familiale et personnalisée. Aujourd'hui, nous sommes fiers d'avoir transporté des milliers de clients satisfaits et d'être devenus un acteur incontournable du transport aéroportuaire dans notre région.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notre flotte</h2>
            <p className="mb-4">
              Nous disposons d'une flotte moderne de vans spacieux pouvant accueillir 
              <strong> jusqu'à 8 passagers</strong> avec leurs bagages. Tous nos véhicules sont :
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Récents et parfaitement entretenus</li>
              <li>Équipés de climatisation</li>
              <li>Dotés de sièges confortables</li>
              <li>Pourvus d'espace généreux pour les bagages</li>
              <li>Équipés sur demande de sièges enfant et réhausseurs</li>
              <li>Nettoyés et désinfectés après chaque trajet</li>
            </ul>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Notre service de navette aéroport</h2>
          <p className="mb-4">
            Spécialisés dans le transport depuis <strong>la Belgique</strong> et toutes les communes 
            environnantes vers les aéroports, nous proposons :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium mb-3">Navettes vers les aéroports belges</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Aéroport de Bruxelles (Zaventem)</strong></li>
                <li><strong>Aéroport de Brussels South</strong></li>
                <li><strong>Aéroport de Liège</strong></li>
                <li><strong>Aéroport d'Ostende</strong></li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium mb-3">Navettes vers les aéroports frontaliers</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Aéroport de Luxembourg</strong></li>
                <li><strong>Aéroport d'Amsterdam Schiphol</strong></li>
                <li><strong>Aéroport de Paris CDG</strong></li>
                <li><strong>Aéroport de Paris Orly</strong></li>
                <li><strong>Aéroport de Lille</strong></li>
              </ul>
            </div>
          </div>
          <p>
            Nous desservons également toutes les gares principales, notamment la Gare du Midi à Bruxelles 
            pour les connexions Thalys et Eurostar.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Nos chauffeurs</h2>
          <p className="mb-4">
            La qualité de notre service repose largement sur nos chauffeurs. Tous nos conducteurs :
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Sont des professionnels expérimentés</li>
            <li>Connaissent parfaitement les routes et tous les aéroports</li>
            <li>Parlent français et comprennent l'anglais de base</li>
            <li>Sont ponctuels et courtois</li>
            <li>Veillent à votre confort et votre sécurité tout au long du trajet</li>
            <li>Vous aident avec vos bagages</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Nos clients</h2>
          <p className="mb-4">
            Depuis notre création, nous avons eu l'honneur de transporter plusieurs milliers de clients 
            satisfaits vers différents aéroports. Nos clients incluent :
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Des familles partant en vacances</li>
            <li>Des voyageurs d'affaires</li>
            <li>Des groupes d'amis</li>
            <li>Des étudiants</li>
            <li>Des seniors</li>
          </ul>
          <p>
            Leur satisfaction et leurs recommandations sont notre meilleure publicité et nous motivent 
            à améliorer constamment notre service.
          </p>
        </div>

        <div className="bg-primary text-neutral-dark p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Réservez votre navette aéroport</h2>
          <p className="mb-4">
            Que vous ayez besoin d'une navette vers l'aéroport de Bruxelles, 
            Brussels South ou tout autre aéroport, nous sommes là pour vous offrir un service de transport fiable, 
            confortable et abordable.
          </p>
          <div className="flex justify-center">
            <a href="/#calculator" className="btn bg-white text-primary hover:bg-gray-100 px-6 py-2">
              Calculer le prix de ma navette
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About