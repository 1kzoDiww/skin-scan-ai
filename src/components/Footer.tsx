import { Sparkles, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border bg-secondary/20" id="privacy">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="gradient-text">SkinAI</span>
            </a>
            <p className="text-muted-foreground text-sm">
              Профессиональный AI-анализ состояния кожи для принятия обоснованных решений об уходе
            </p>
          </div>

          {/* Privacy */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Приватность
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Фотографии не сохраняются</li>
              <li>• Данные обрабатываются локально</li>
              <li>• Соответствие GDPR</li>
              <li>• Шифрование при передаче</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />
              Важно
            </h4>
            <p className="text-sm text-muted-foreground">
              Анализ носит информационный характер и не заменяет консультацию врача-дерматолога. 
              При серьёзных проблемах обратитесь к специалисту.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SkinAI. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
