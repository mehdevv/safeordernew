import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  Star, 
  BrainCircuit, 
  ArrowRight,
  Store,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'wouter';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroMockup from '@/assets/hero-dashboard.png';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState('FR');

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1A1A2E] overflow-hidden font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0D3B66] text-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0080FF] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Safe Order</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-[#00FF91] transition-colors">Fonctionnalités</a>
              <a href="#tarifs" className="text-sm font-medium hover:text-[#00FF91] transition-colors">Tarifs</a>
              <a href="#about" className="text-sm font-medium hover:text-[#00FF91] transition-colors">À propos</a>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center bg-white/10 rounded-full p-1">
                {['FR', 'EN', 'AR'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${lang === l ? 'bg-[#F0AE1A] text-[#0D3B66]' : 'text-white hover:text-white/80'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button className="bg-[#0080FF] hover:bg-[#0080FF]/90 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,128,255,0.3)] hover:shadow-[0_0_20px_rgba(0,128,255,0.5)]">
                Démarrer gratuitement
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-[#E8F0FE] text-[#1A5C99] px-4 py-2 rounded-full text-sm font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>La confiance au cœur du e-commerce algérien</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Gérez vos commandes. <br/>
              <span className="text-[#0D3B66]">Réduisez vos retours.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-[#6B7280] text-lg max-w-xl">
              Safe Order connecte marchands et acheteurs avec un système de dépôt intelligent, un suivi en temps réel et des analyses IA pour sécuriser chaque transaction.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#0D3B66] text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-[#0D3B66]/90 transition-colors flex items-center justify-center gap-2">
                Créer un compte marchand <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white text-[#0D3B66] border border-[#D1D5DB] px-8 py-3 rounded-lg font-bold text-base hover:bg-[#E8F0FE] transition-colors">
                Découvrir Safe Pay
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(13,59,102,0.15)] border border-[#E5E7EB] bg-white">
              <img src={heroMockup} alt="Safe Order Dashboard" className="w-full h-auto object-cover" />
            </div>
            
            {/* Floating stat badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-[#E5E7EB] flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[#E6F7EE] rounded-full flex items-center justify-center">
                <span className="text-[#0D6E3F] font-bold text-lg">40%</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A1A2E]">Taux de retour réduit</p>
                <p className="text-xs text-[#6B7280]">En moyenne chez nos marchands</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeIn} className="group bg-[#F0F2F5] rounded-xl p-8 border border-[#E5E7EB] hover:border-[#0D3B66] hover:shadow-lg transition-all cursor-pointer">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Store className="w-7 h-7 text-[#0080FF]" />
              </div>
              <h3 className="text-xl font-bold mb-3">E-commerçant</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Gérez vos commandes, réduisez vos retours et augmentez votre chiffre d'affaires grâce à notre écosystème de confiance.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="group bg-[#F0F2F5] rounded-xl p-8 border border-[#E5E7EB] hover:border-[#0D3B66] hover:shadow-lg transition-all cursor-pointer">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <User className="w-7 h-7 text-[#0D6E3F]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Client</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Commandez en toute confiance, suivez vos colis en temps réel et récupérez votre caution systématiquement.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="group bg-[#F0F2F5] rounded-xl p-8 border border-[#E5E7EB] hover:border-[#0D3B66] hover:shadow-lg transition-all cursor-pointer">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-[#F0AE1A]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Administrateur</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Supervisez la plateforme, configurez les paramètres de sécurité et analysez les données de performance globales.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">L'écosystème de confiance</h2>
          <p className="text-[#6B7280]">Des outils puissants conçus spécifiquement pour résoudre les défis du e-commerce en Algérie.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F0FE] rounded-bl-full -mr-10 -mt-10 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#0080FF] text-white rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Safe Pay</h3>
              <p className="text-[#6B7280] mb-4">Dépôt intelligent de 10% remboursable à la livraison. Protégez-vous contre les fausses commandes tout en rassurant vos clients.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#0080FF]" /> Intégration transparente</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#0080FF]" /> Remboursement automatique</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6F7EE] rounded-bl-full -mr-10 -mt-10 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#0D6E3F] text-white rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Safe Track</h3>
              <p className="text-[#6B7280] mb-4">Suivi de livraison en temps réel avec 6 statuts précis. Ne laissez plus vos clients dans le flou.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#0D6E3F]" /> SMS & Notifications en direct</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#0D6E3F]" /> Connexion APIs livreurs</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEF7E0] rounded-bl-full -mr-10 -mt-10 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#F0AE1A] text-white rounded-lg flex items-center justify-center mb-6">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Trust Score</h3>
              <p className="text-[#6B7280] mb-4">Score de confiance bidirectionnel basé sur l'historique réel. Privilégiez les clients fiables et bâtissez votre réputation.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#F0AE1A]" /> Évaluation post-livraison</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#F0AE1A]" /> Badge de confiance public</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EDE9FE] rounded-bl-full -mr-10 -mt-10 z-0"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#5B21B6] text-white rounded-lg flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Safe Insights IA</h3>
              <p className="text-[#6B7280] mb-4">Analyse prédictive propulsée par l'IA. Identifiez les zones à risque et optimisez vos opérations logistiques.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#5B21B6]" /> Prédiction des retours</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#5B21B6]" /> Dashboard analytique avancé</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0D3B66] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#00FF91] mb-2">50%</div>
              <div className="text-sm font-medium text-[#E8F0FE]">Taux de retour réduit</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#00FF91] mb-2">6</div>
              <div className="text-sm font-medium text-[#E8F0FE]">Statuts en temps réel</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#00FF91] mb-2">4+</div>
              <div className="text-sm font-medium text-[#E8F0FE]">Livreurs intégrés</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#00FF91] mb-2">10k+</div>
              <div className="text-sm font-medium text-[#E8F0FE]">Commandes sécurisées</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Un processus fluide</h2>
          <p className="text-[#6B7280]">De la commande à la livraison, chaque étape est sécurisée.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#E5E7EB] -translate-y-1/2 z-0"></div>
          
          {[
            { step: '1', title: 'Création', desc: 'Le marchand crée la commande' },
            { step: '2', title: 'Caution', desc: 'Le client dépose 10% via Safe Pay' },
            { step: '3', title: 'Suivi', desc: 'Tracking activé en temps réel' },
            { step: '4', title: 'Livraison', desc: 'Colis livré, caution remboursée' }
          ].map((s, i) => (
            <div key={i} className="relative z-10 bg-white border border-[#E5E7EB] p-6 rounded-xl shadow-sm text-center w-full md:w-1/4">
              <div className="w-10 h-10 bg-[#0080FF] text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 border-4 border-white shadow-sm">
                {s.step}
              </div>
              <h4 className="font-bold text-lg mb-2">{s.title}</h4>
              <p className="text-sm text-[#6B7280]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 border-y border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-8">Partenaires logistiques intégrés</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            {['Yalidine', 'ZR Express', 'Maystro', 'Procolis'].map((p, i) => (
              <div key={i} className="text-2xl font-bold text-[#1A1A2E]">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Ils nous font confiance</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="flex gap-1 text-[#F0AE1A] mb-6">
              {[...Array(5)].map((_,i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-lg font-medium mb-6 leading-relaxed">
              "Avant Safe Order, on perdait un temps fou et beaucoup d'argent avec les retours injustifiés. La caution Safe Pay a complètement changé notre clientèle : on n'a plus que des acheteurs sérieux."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#1A5C99] font-bold">AK</div>
              <div>
                <p className="font-bold">Amine K.</p>
                <p className="text-sm text-[#6B7280]">Gérant, TechDz</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="flex gap-1 text-[#F0AE1A] mb-6">
              {[...Array(5)].map((_,i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-lg font-medium mb-6 leading-relaxed">
              "L'intégration avec nos livreurs et les alertes SMS ont drastiquement réduit les appels au service client. Le tableau de bord IA nous aide même à cibler nos campagnes marketing."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E6F7EE] rounded-full flex items-center justify-center text-[#0D6E3F] font-bold">SM</div>
              <div>
                <p className="font-bold">Sara M.</p>
                <p className="text-sm text-[#6B7280]">CEO, ModeAlgerie</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#F0F2F5] max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Questions Fréquentes</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-white px-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-[#0080FF] py-6">Comment fonctionne le dépôt Safe Pay ?</AccordionTrigger>
            <AccordionContent className="text-[#6B7280] text-base leading-relaxed pb-6">
              Lorsqu'un client passe commande, il reçoit un lien sécurisé pour déposer 10% du montant total. Ce montant est conservé sur un compte séquestre. Une fois la livraison confirmée, le montant est déduit du reste à payer au livreur ou remboursé selon les conditions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="bg-white px-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-[#0080FF] py-6">Que se passe-t-il si le client refuse la livraison ?</AccordionTrigger>
            <AccordionContent className="text-[#6B7280] text-base leading-relaxed pb-6">
              Si le refus est injustifié ou si le client est injoignable, le dépôt de 10% est transféré au marchand pour couvrir les frais de retour logistique. Si le refus est justifié (produit non conforme), le dépôt est restitué au client après vérification.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="bg-white px-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-[#0080FF] py-6">Comment le Trust Score est-il calculé ?</AccordionTrigger>
            <AccordionContent className="text-[#6B7280] text-base leading-relaxed pb-6">
              Le Trust Score prend en compte l'historique des transactions, le taux d'acceptation des livraisons, la rapidité des dépôts Safe Pay, et les évaluations laissées après chaque commande. Un algorithme IA ajuste le score pour prévenir les fraudes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="bg-white px-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-[#0080FF] py-6">Quelles sociétés de livraison sont compatibles ?</AccordionTrigger>
            <AccordionContent className="text-[#6B7280] text-base leading-relaxed pb-6">
              Safe Order est nativement intégré avec Yalidine, ZR Express, Maystro et Procolis. Nous fournissons également une API ouverte pour intégrer n'importe quelle autre société de logistique locale.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0D3B66] to-[#1A5C99] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à sécuriser votre e-commerce ?</h2>
          <p className="text-lg text-[#E8F0FE] mb-10">Rejoignez des centaines de marchands qui ont déjà fait le choix de la rentabilité et de la tranquillité.</p>
          <button className="bg-[#00FF91] text-[#0D3B66] px-10 py-4 rounded-lg font-bold text-lg hover:bg-white transition-colors shadow-lg">
            Créer mon compte gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#0080FF] rounded-md flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-lg">Safe Order</span>
              </div>
              <p className="text-[#9CA3AF] text-sm max-w-sm">
                Smart order management. Full control. Le standard de confiance pour le e-commerce en Algérie.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#6B7280]">
            <p>© {new Date().getFullYear()} Safe Order. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Globe className="w-4 h-4" />
              <span>Alger, Algérie</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
