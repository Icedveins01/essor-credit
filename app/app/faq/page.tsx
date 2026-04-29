// app/faq/page.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function FAQ() {
  const faqs = [
    { q: "Quels sont les montants de prêt proposés ?", a: "De 2 000 € à 1 500 000 € selon votre projet et votre situation financière." },
    { q: "Quel est le taux d'intérêt appliqué ?", a: "Nous proposons un taux fixe à partir de 3.0% (selon dossier)." },
    { q: "Combien de temps faut-il pour obtenir une réponse ?", a: "Une première étude est réalisée sous 24 heures." },
    { q: "Puis-je faire une simulation sans engagement ?", a: "Oui, la simulation est totalement gratuite et sans engagement." },
    { q: "Acceptez-vous les profils indépendants ?", a: "Oui, nous avons des solutions adaptées aux travailleurs indépendants." },
    { q: "Est-ce que je peux regrouper plusieurs crédits ?", a: "Oui, le rachat de crédit fait partie de nos spécialités." },
    { q: "Quels documents sont nécessaires ?", a: "Pièce d’identité, justificatifs de revenus, et relevés bancaires récents." },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-4">Questions Fréquentes</h1>
        <p className="text-center text-zinc-600 mb-16">Tout ce que vous devez savoir sur nos services</p>

        <div className="space-y-6">
          {faqs.map((item, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-emerald-700">{item.q}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}