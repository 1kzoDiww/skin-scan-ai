import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="gradient-text">SkinAI</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Возможности
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            Как это работает
          </a>
          <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Приватность
          </a>
        </nav>
      </div>
    </header>
  );
}
