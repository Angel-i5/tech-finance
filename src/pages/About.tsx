import { motion } from 'motion/react';
import { Cpu, TrendingUp, Users } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold tracking-tight mb-6">Sobre Nosotros</h1>
        <p className="text-xl text-black/60 leading-relaxed">
          TechFinance Insights nació con una misión clara: democratizar el conocimiento sobre las dos fuerzas más disruptivas de nuestra era: la Inteligencia Artificial y las Finanzas Modernas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white mb-4">
            <Cpu size={24} />
          </div>
          <h2 className="text-2xl font-bold">Nuestra Visión Tecnológica</h2>
          <p className="text-black/60 leading-relaxed">
            Creemos que la IA no es solo una herramienta para programadores, sino un catalizador de productividad para todos. Nos enfocamos en aplicaciones prácticas que ahorran tiempo y abren nuevas posibilidades creativas.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white mb-4">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-2xl font-bold">Nuestra Visión Financiera</h2>
          <p className="text-black/60 leading-relaxed">
            El dinero es libertad. Exploramos desde las inversiones tradicionales hasta las criptomonedas, siempre con un enfoque en la planificación a largo plazo y la gestión inteligente del riesgo.
          </p>
        </div>
      </div>

      <div className="bg-black text-white p-12 rounded-3xl text-center">
        <Users className="mx-auto mb-6 opacity-50" size={48} />
        <h2 className="text-3xl font-bold mb-4">Nuestra Comunidad</h2>
        <p className="text-white/60 mb-8 max-w-2xl mx-auto">
          Somos un equipo de entusiastas de la tecnología y expertos en finanzas dedicados a traerte la información más relevante y actualizada.
        </p>
      </div>
    </div>
  );
}
