import { Upload, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-8 h-8" />,
    number: "01",
    title: "Загрузите фото",
    description: "Сделайте чёткое фото лица при хорошем освещении без макияжа и загрузите его"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    number: "02",
    title: "AI-анализ",
    description: "Наши алгоритмы проанализируют состояние вашей кожи за 30 секунд"
  },
  {
    icon: <FileCheck className="w-8 h-8" />,
    number: "03",
    title: "Получите отчёт",
    description: "Детальный отчёт с визуализацией проблем и персональными рекомендациями"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4" id="how-it-works">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Как это работает
          </h2>
          <p className="text-lg text-muted-foreground">
            Три простых шага до персонального анализа
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
