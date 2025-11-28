import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Lock, Users, TrendingUp, Zap, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/images/adobe-20express-20-20file.png"
              alt="Republicar"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-bold text-foreground">Republicar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Começar</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/20 text-sm text-primary font-medium">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            Gestão inteligente de repúblicas
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Contas Claras,{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Repúblicas Unidas
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Republicar simplifica a divisão de despesas da sua república com cálculos automáticos, relatórios claros e
            total transparência. Todos sabem exatamente o que devem pagar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
              >
                Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/5 bg-transparent"
              >
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Repúblicas Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Usuários Felizes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">+R$ 2M</div>
            <div className="text-sm text-muted-foreground">Contas Organizadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Satisfação</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tudo que você precisa</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestão de república simplificada, justa e completamente transparente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Dashboard Financeiro</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Visualize gastos por categoria com gráficos intuitivos e tendências de despesas em tempo real.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Divisão Automática</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Escolha entre igualitária ou proporcional à renda. Cálculos justos em segundos.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Transparência Total</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Moradores acessam débitos e histórico de pagamentos de forma segura e clara.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Gestão de Moradores</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Controle ocupantes, rendas, períodos e histórico de forma centralizada.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Relatórios Detalhados</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Histórico financeiro, tendências e análises por período para cada república.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Dados Protegidos</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Segurança de ponta com os mais altos padrões de privacidade e proteção.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Confiança de repúblicas em todo o Brasil</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Mais de 500 repúblicas confiam em nós</h3>
                  <p className="text-sm text-muted-foreground">Desde repúblicas pequenas até grandes condomínios</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">99% de satisfação</h3>
                  <p className="text-sm text-muted-foreground">Avaliações excelentes de administradores e moradores</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Suporte em português 24/7</h3>
                  <p className="text-sm text-muted-foreground">Equipe dedicada para ajudar sua república</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Média de tempo economizado</p>
                <p className="text-2xl font-bold text-primary">8h por mês</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Precisão nos cálculos</p>
                <p className="text-2xl font-bold text-accent">100%</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Moradores satisfeitos</p>
                <p className="text-2xl font-bold text-primary">+95%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary via-primary/80 to-accent rounded-2xl p-12 sm:p-16 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pronto para simplificar suas contas?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto leading-relaxed">
            Cadastre sua república agora e comece a gerenciar despesas de forma organizada, justa e completamente
            transparente.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-primary shadow-lg hover:shadow-xl transition-shadow"
            >
              Criar Minha Conta Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Republicar. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}
