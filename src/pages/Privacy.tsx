import { ShieldAlert, Info } from 'lucide-react';

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Políticas de Privacidad y Descargo de Responsabilidad</h1>
      
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-12 flex gap-4">
        <ShieldAlert className="text-amber-600 shrink-0" size={24} />
        <div>
          <h2 className="font-bold text-amber-900 mb-1">AVISO IMPORTANTE</h2>
          <p className="text-amber-800 text-sm leading-relaxed">
            Todo el contenido publicado en TechFinance Insights tiene fines <strong>estrictamente educativos e informativos</strong>. Nada de lo aquí expuesto constituye consejo de inversión, asesoría financiera, legal o fiscal.
          </p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>1. Descargo de Responsabilidad Financiera</h2>
        <p>
          Invertir en mercados financieros, incluyendo acciones, ETFs y criptomonedas, conlleva un riesgo significativo de pérdida. TechFinance Insights no se hace responsable de las decisiones financieras tomadas por los lectores basadas en la información de este sitio. Recomendamos encarecidamente consultar con un profesional financiero certificado antes de realizar cualquier inversión.
        </p>

        <h2>2. Uso de la Información</h2>
        <p>
          Aunque nos esforzamos por mantener la información actualizada y precisa, no garantizamos la integridad o exactitud de los datos. La tecnología y los mercados financieros evolucionan rápidamente.
        </p>

        <h2>3. Publicidad y Enlaces de Terceros</h2>
        <p>
          Este sitio utiliza servicios de publicidad de terceros (como Adsterra). Estos servicios pueden utilizar cookies para mostrar anuncios basados en sus visitas anteriores. No tenemos control sobre las políticas de privacidad de estos terceros.
        </p>

        <h2>4. Protección de Datos</h2>
        <p>
          Valoramos su privacidad. Si se suscribe a nuestro boletín, su correo electrónico se utilizará exclusivamente para enviarle actualizaciones del blog y nunca será vendido a terceros.
        </p>

        <div className="bg-black/5 p-6 rounded-2xl mt-12 flex gap-4 items-start">
          <Info className="text-black/40 shrink-0 mt-1" size={20} />
          <p className="text-sm text-black/60 italic">
            Al utilizar este sitio web, usted acepta los términos de este descargo de responsabilidad. Si no está de acuerdo, por favor absténgase de utilizar nuestra información para fines de inversión.
          </p>
        </div>
      </div>
    </div>
  );
}
