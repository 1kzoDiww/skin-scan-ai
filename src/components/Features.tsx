import { 
  Scan, 
  Target, 
  FileText, 
  Shield, 
  Zap, 
  Stethoscope 
} from "lucide-react";

const features = [
  {
    icon: <Scan className="w-6 h-6" />,
    title: "Определение типа кожи",
    description: "Точное определение вашего типа кожи: сухая, жирная, комбинированная, нормальная или чувствительная"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Анализ проблем",
    description: "Выявление акне, пигментации, морщин, расширенных пор, обезвоженности и других проблем"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Детальный отчёт",
    description: "Визуальные маркеры проблемных зон с оценкой степени тяжести каждой проблемы"
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    title: "Рекомендации",
    description: "Персонализированные советы по уходу, косметике и необходимости консультации врача"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Мгновенный результат",
    description: "Полный анализ и рекомендации готовы за 30 секунд благодаря современным AI-алгоритмам"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% приватность",
    description: "Ваши фотографии не сохраняются на серверах и удаляются сразу после анализа"
  }
];

export function Features() {
  return (
    <section className="py-20 px-4 bg-secondary/30" id="features">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Что умеет наш AI-анализ
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Передовые алгоритмы компьютерного зрения для точной диагностики состояния кожи
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
