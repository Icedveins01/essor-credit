export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">Mentions Légales</h1>
        
        <div className="prose prose-zinc max-w-none">
          <h2>Informations légales</h2>
          <p><strong>Essor Crédit</strong> est un site exploité par :</p>
          <p>SAS Essor Finance<br />
          Siège social : 123 Avenue des Champs-Élysées, 75008 Paris<br />
          SIREN : XXXXXXXX<br />
          RCS Paris B XXXXXXX</p>

          <h2>Intermédiaire en Opérations de Banque et Services de Paiement (IOBSP)</h2>
          <p>Numéro ORIAS : <strong>XXXXXXXX</strong><br />
          Immatriculé auprès de l'Organisme pour le Registre des Intermédiaires en Assurance, Banque et Finance (ORIAS).</p>

          <h2>Hébergeur</h2>
          <p>Vercel Inc.<br />340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>

          <h2>Directeur de la publication</h2>
          <p>M. [Ton Nom]</p>
        </div>
      </div>
    </main>
  );
}