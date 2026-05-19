import { useState } from "react";
import { motion } from "framer-motion";
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
  Globe,
  Menu,
  X,
} from "lucide-react";
import { Link } from "wouter";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import heroMockup from "@/assets/hero-dashboard.png";

function LandingLangSwitch({
  lang,
  onChange,
  layout = "inline",
}: {
  lang: string;
  onChange: (code: string) => void;
  layout?: "inline" | "full";
}) {
  return (
    <div
      role="group"
      aria-label="Choisir la langue"
      className={cn(
        "inline-flex rounded-full bg-black/20 p-1 ring-1 ring-sidebar-border/60 shadow-inner backdrop-blur-sm",
        layout === "full" && "w-full max-w-xs justify-stretch",
      )}
    >
      {(["FR", "EN", "AR"] as const).map(code => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(code)}
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
              layout === "full" && "min-w-0 flex-1 text-center",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm ring-1 ring-black/10"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center sm:mb-12">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p> : null}
    </div>
  );
}

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

export default function SafeOrderLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState("FR");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Navbar — même hiérarchie visuelle que la barre latérale marchand (couleur sidebar) */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-foreground/10 bg-sidebar text-sidebar-foreground shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-md pr-2 -ml-1 outline-none ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
          >
            <img
              src="/favicon.png"
              alt=""
              width={40}
              height={40}
              className="h-9 w-9 rounded-md border border-sidebar-border bg-card object-contain shadow-sm sm:h-10 sm:w-10"
            />
            <div className="leading-tight">
              <span className="block text-lg font-bold tracking-tight sm:text-xl">SafeOrder</span>
              <span className="hidden text-[11px] font-medium text-sidebar-foreground/70 sm:block">E-commerce sécurisé</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
            <a href="#features" className="text-sm font-medium text-sidebar-foreground/90 transition-colors hover:text-sidebar-primary-foreground">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-sm font-medium text-sidebar-foreground/90 transition-colors hover:text-sidebar-primary-foreground">
              Tarifs
            </a>
            <a href="#about" className="text-sm font-medium text-sidebar-foreground/90 transition-colors hover:text-sidebar-primary-foreground">
              À propos
            </a>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-sidebar-foreground/60" aria-hidden />
              <LandingLangSwitch lang={lang} onChange={setLang} />
            </div>
            <Button asChild size="default" className="font-semibold shadow-sm">
              <Link href="/merchant/register">Démarrer gratuitement</Link>
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setIsMenuOpen(o => !o)} aria-expanded={isMenuOpen} aria-label="Menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-sidebar-border px-4 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:px-2">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="rounded-md py-2.5 text-sm font-medium text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                Fonctionnalités
              </a>
              <a href="#tarifs" onClick={() => setIsMenuOpen(false)} className="rounded-md py-2.5 text-sm font-medium text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                Tarifs
              </a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="rounded-md py-2.5 text-sm font-medium text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                À propos
              </a>
              <Button asChild variant="secondary" className="mt-2 w-full font-semibold">
                <Link href="/merchant/register" onClick={() => setIsMenuOpen(false)}>Démarrer gratuitement</Link>
              </Button>
              <div className="mt-4 flex flex-col items-center gap-2 border-t border-sidebar-border pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">Langue</span>
                <LandingLangSwitch lang={lang} onChange={setLang} layout="full" />
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        {/* Hero — titrages alignés sur l’app (tracking-tight, hiérarchie type tableau de bord) */}
        <section className="border-b border-border/80 bg-gradient-to-b from-muted/40 to-background px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6 sm:space-y-8">
              <motion.div variants={fadeIn}>
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs font-medium sm:text-sm">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  La confiance au cœur du e-commerce algérien
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[2.75rem] lg:leading-[1.12]">
                Gérez vos commandes. <br />
                <span className="text-primary">Réduisez vos retours.</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                SafeOrder connecte marchands et acheteurs avec un dépôt intelligent, un suivi en temps réel et des analyses pour sécuriser chaque transaction.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button asChild size="lg" className="w-full font-semibold sm:w-auto">
                  <Link href="/merchant/register" className="gap-2">
                    Créer un compte marchand
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full font-semibold sm:w-auto">
                  <a href="#features">Découvrir Safe Pay</a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="relative">
              <Card className="overflow-hidden border-border/80 p-0 shadow-md">
                <div className="border-b border-border/60 bg-muted/30 px-4 py-2.5">
                  <p className="text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Aperçu tableau de bord</p>
                </div>
                <CardContent className="p-0">
                  <img src={heroMockup} alt="Aperçu du tableau de bord SafeOrder" className="w-full object-cover" loading="eager" />
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="absolute -bottom-5 left-4 right-4 sm:-bottom-6 sm:left-auto sm:right-auto sm:min-w-[260px]"
              >
                <Card className="border-border/80 shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/15">
                      <span className="text-base font-bold text-success">40%</span>
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold leading-snug text-foreground">Taux de retour réduit</p>
                      <p className="text-xs text-muted-foreground">En moyenne chez nos marchands</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Rôles */}
        <section id="about" className="border-t border-border bg-muted/25 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Pour commencer"
              title="Choisissez votre espace"
              description="Même interface soignée que dans l’app : parcours dédié marchand ou client."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
            >
              <motion.div variants={fadeIn} className="min-h-0">
                <Link href="/merchant/register" className="block h-full">
                  <Card className="group h-full border-border/80 transition-all hover:border-primary hover:shadow-md">
                    <CardHeader className="space-y-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
                        <Store className="h-7 w-7 text-primary" aria-hidden />
                      </div>
                      <CardTitle className="text-xl">E-commerçant</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        Gérez vos commandes, réduisez vos retours et augmentez votre chiffre d’affaires grâce à notre écosystème de confiance.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>

              <motion.div variants={fadeIn} className="min-h-0">
                <Link href="/client/login" className="block h-full">
                  <Card className="group h-full border-border/80 transition-all hover:border-primary hover:shadow-md">
                    <CardHeader className="space-y-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
                        <User className="h-7 w-7 text-success" aria-hidden />
                      </div>
                      <CardTitle className="text-xl">Client</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        Commandez en toute confiance, suivez vos colis en temps réel et récupérez votre caution systématiquement.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section id="features" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Produit"
              title="L’écosystème de confiance"
              description="Des outils pensés pour le e-commerce en Algérie — cartes et typographie comme dans votre espace marchand."
            />

            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                <Card className="relative h-full overflow-hidden border-border/80 shadow-sm">
                  <div className="absolute -right-10 -top-10 z-0 h-32 w-32 rounded-bl-full bg-primary/10" aria-hidden />
                  <CardHeader className="relative z-10 space-y-4 pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                      <Shield className="h-6 w-6" aria-hidden />
                    </div>
                    <CardTitle className="text-xl tracking-tight">Safe Pay</CardTitle>
                    <CardDescription>
                      Dépôt intelligent de 10 % remboursable à la livraison. Protégez-vous contre les fausses commandes tout en rassurant vos clients.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-2 pb-6">
                    <ul className="space-y-2 text-sm font-medium text-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        Intégration transparente
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        Remboursement automatique
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.06 }}>
                <Card className="relative h-full overflow-hidden border-border/80 shadow-sm">
                  <div className="absolute -right-10 -top-10 z-0 h-32 w-32 rounded-bl-full bg-success/15" aria-hidden />
                  <CardHeader className="relative z-10 space-y-4 pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-success text-success-foreground shadow-sm">
                      <MapPin className="h-6 w-6" aria-hidden />
                    </div>
                    <CardTitle className="text-xl tracking-tight">Safe Track</CardTitle>
                    <CardDescription>
                      Suivi en temps réel avec 6 statuts précis. Ne laissez plus vos clients dans le flou.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-2 pb-6">
                    <ul className="space-y-2 text-sm font-medium text-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />
                        SMS & notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />
                        Connexion APIs livreurs
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.12 }}>
                <Card className="relative h-full overflow-hidden border-border/80 shadow-sm">
                  <div className="absolute -right-10 -top-10 z-0 h-32 w-32 rounded-bl-full bg-brand-amber/20" aria-hidden />
                  <CardHeader className="relative z-10 space-y-4 pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-amber text-brand-amber-foreground shadow-sm">
                      <Star className="h-6 w-6 text-primary-foreground" aria-hidden />
                    </div>
                    <CardTitle className="text-xl tracking-tight">Trust Score</CardTitle>
                    <CardDescription>
                      Score de confiance bidirectionnel basé sur l’historique réel. Bâtissez votre réputation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-2 pb-6">
                    <ul className="space-y-2 text-sm font-medium text-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-amber" aria-hidden />
                        Évaluation post-livraison
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-amber" aria-hidden />
                        Badge de confiance public
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.18 }}>
                <Card className="relative h-full overflow-hidden border-border/80 shadow-sm">
                  <div className="absolute -right-10 -top-10 z-0 h-32 w-32 rounded-bl-full bg-chart-5/15" aria-hidden />
                  <CardHeader className="relative z-10 space-y-4 pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-chart-5 text-primary-foreground shadow-sm">
                      <BrainCircuit className="h-6 w-6" aria-hidden />
                    </div>
                    <CardTitle className="text-xl tracking-tight">Safe Insights IA</CardTitle>
                    <CardDescription>
                      Analyse prédictive : repérez les zones à risque et optimisez vos opérations logistiques.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-2 pb-6">
                    <ul className="space-y-2 text-sm font-medium text-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-chart-5" aria-hidden />
                        Prédiction des retours
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-chart-5" aria-hidden />
                        Tableaux de bord avancés
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Chiffres */}
        <section id="tarifs" className="border-y border-primary/20 bg-primary py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Impact mesurable</h2>
              <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">Des indicateurs suivis dans la même logique que votre tableau de bord.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-10">
              {[
                { v: "50%", l: "Taux de retour réduit" },
                { v: "6", l: "Statuts en temps réel" },
                { v: "4+", l: "Livreurs intégrés" },
                { v: "10k+", l: "Commandes sécurisées" },
              ].map(row => (
                <div key={row.l} className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/[0.06] px-3 py-5 sm:py-6">
                  <div className="text-3xl font-bold tracking-tight text-brand-mint sm:text-4xl">{row.v}</div>
                  <div className="mt-2 text-xs font-medium text-primary-foreground/85 sm:text-sm">{row.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parcours */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Un processus fluide" description="De la commande à la livraison, chaque étape est structurée comme dans l’application." />
            <div className="relative flex flex-col items-stretch gap-6 md:flex-row md:justify-between md:gap-8">
              <div className="absolute left-4 right-4 top-10 hidden h-px bg-border md:block" aria-hidden />
              {[
                { step: "1", title: "Création", desc: "Le marchand crée la commande" },
                { step: "2", title: "Caution", desc: "Le client dépose 10 % via Safe Pay" },
                { step: "3", title: "Suivi", desc: "Tracking activé en temps réel" },
                { step: "4", title: "Livraison", desc: "Colis livré, caution remboursée" },
              ].map(s => (
                <Card key={s.step} className="relative z-10 w-full border-border/80 text-center shadow-sm md:w-1/4">
                  <CardHeader className="space-y-3 pb-2 pt-6">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                      {s.step}
                    </div>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{s.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partenaires */}
        <section className="border-y border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Partenaires logistiques intégrés</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 transition-opacity md:gap-x-16">
              {["Yalidine", "ZR Express", "Maystro", "Procolis"].map(p => (
                <span key={p} className="text-lg font-semibold tracking-tight text-foreground/80 sm:text-xl">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Ils nous font confiance" description="Retours d’expérience de marchands déjà équipés." />
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <Card className="border-border/80 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="flex gap-0.5 text-brand-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" aria-hidden />
                    ))}
                  </div>
                  <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
                    « Avant SafeOrder, on perdait un temps fou avec les retours injustifiés. La caution Safe Pay a changé notre clientèle : des acheteurs sérieux. »
                  </p>
                </CardHeader>
                <CardContent className="flex items-center gap-4 pb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">AK</div>
                  <div>
                    <p className="text-sm font-semibold">Amine K.</p>
                    <p className="text-xs text-muted-foreground">Gérant, TechDz</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/80 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="flex gap-0.5 text-brand-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" aria-hidden />
                    ))}
                  </div>
                  <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
                    « L’intégration livreurs et les SMS ont réduit les appels au support. Le tableau de bord nous aide à cibler nos campagnes. »
                  </p>
                </CardHeader>
                <CardContent className="flex items-center gap-4 pb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/15 text-sm font-bold text-success">SM</div>
                  <div>
                    <p className="text-sm font-semibold">Sara M.</p>
                    <p className="text-xs text-muted-foreground">CEO, ModeAlgerie</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Questions fréquentes" description="Les réponses aux questions les plus courantes avant de vous lancer." />
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="rounded-xl border border-border bg-card px-1 shadow-sm">
                <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold hover:no-underline hover:text-primary">
                  Comment fonctionne le dépôt Safe Pay ?
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Lorsqu&apos;un client passe commande, il reçoit un lien sécurisé pour déposer 10 % du montant total. Ce montant est conservé sur un compte séquestre. Une fois la livraison confirmée, le montant est déduit du reste à payer au livreur ou remboursé selon les conditions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="rounded-xl border border-border bg-card px-1 shadow-sm">
                <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold hover:no-underline hover:text-primary">
                  Que se passe-t-il si le client refuse la livraison ?
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Si le refus est injustifié ou si le client est injoignable, le dépôt de 10 % est transféré au marchand pour couvrir les frais de retour logistique. Si le refus est justifié (produit non conforme), le dépôt est restitué au client après vérification.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="rounded-xl border border-border bg-card px-1 shadow-sm">
                <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold hover:no-underline hover:text-primary">
                  Comment le Trust Score est-il calculé ?
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Le Trust Score prend en compte l&apos;historique des transactions, le taux d&apos;acceptation des livraisons, la rapidité des dépôts Safe Pay, et les évaluations laissées après chaque commande. Un algorithme ajuste le score pour prévenir les fraudes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="rounded-xl border border-border bg-card px-1 shadow-sm">
                <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold hover:no-underline hover:text-primary">
                  Quelles sociétés de livraison sont compatibles ?
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  SafeOrder est intégré avec Yalidine, ZR Express, Maystro et Procolis. Une API permet d&apos;ajouter d&apos;autres transporteurs locaux.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-gradient-to-br from-primary to-[color:var(--safeorder-blue-700)] py-16 text-primary-foreground sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Prêt à sécuriser votre e-commerce ?</h2>
            <p className="mt-4 text-sm text-primary-foreground/85 sm:text-base">
              Rejoignez les marchands qui ont choisi la tranquillité d&apos;exploitation avec SafeOrder.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="bg-brand-mint px-8 font-semibold text-brand-mint-foreground shadow-lg hover:bg-primary-foreground hover:text-primary">
                <Link href="/merchant/register">Créer mon compte gratuitement</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/60 bg-[color:var(--safeorder-ink)] py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-10 md:grid-cols-4 md:gap-8">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <img src="/favicon.png" alt="" width={32} height={32} className="h-8 w-8 rounded-md border border-primary-foreground/20 bg-card object-contain" />
                <span className="text-lg font-bold tracking-tight">SafeOrder</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/60">
                Gestion de commandes et livraisons sécurisées. Le même socle technique que votre espace marchand et client.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">Liens utiles</h4>
              <ul className="space-y-2.5 text-sm text-primary-foreground/70">
                <li>
                  <a href="#about" className="rounded transition-colors hover:text-primary-foreground">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="rounded transition-colors hover:text-primary-foreground">
                    Tarifs
                  </a>
                </li>
                <li>
                  <Link href="/merchant/login" className="rounded transition-colors hover:text-primary-foreground">
                    Connexion marchand
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">Légal</h4>
              <ul className="space-y-2.5 text-sm text-primary-foreground/70">
                <li>
                  <a href="#" className="rounded transition-colors hover:text-primary-foreground">
                    CGU
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded transition-colors hover:text-primary-foreground">
                    Confidentialité
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-xs text-primary-foreground/50 sm:flex-row sm:text-sm">
            <p>© {new Date().getFullYear()} SafeOrder. Tous droits réservés.</p>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" aria-hidden />
              <span>Alger, Algérie</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
