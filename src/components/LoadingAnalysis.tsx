import { cn } from "@/lib/utils";

const analysisSteps = [
  "Загрузка изображения...",
  "Определение типа кожи...",
  "Анализ проблемных зон...",
  "Оценка состояния...",
  "Формирование рекомендаций..."
];

interface LoadingAnalysisProps {
  currentStep: number;
}

export function LoadingAnalysis({ currentStep }: LoadingAnalysisProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-lg">
        <div className="glass-card p-8 text-center">
          {/* Animated circle */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: "1.5s" }}
            />
            <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {Math.round((currentStep / analysisSteps.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Current step */}
          <h3 className="text-xl font-semibold mb-6">Анализируем вашу кожу</h3>
          
          {/* Steps list */}
          <div className="space-y-3 text-left">
            {analysisSteps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                  index < currentStep && "bg-success/10 text-success",
                  index === currentStep && "bg-primary/10 text-primary animate-pulse-soft",
                  index > currentStep && "text-muted-foreground opacity-50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  index < currentStep && "bg-success text-success-foreground",
                  index === currentStep && "bg-primary text-primary-foreground",
                  index > currentStep && "bg-muted text-muted-foreground"
                )}>
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Это займёт около 30 секунд
          </p>
        </div>
      </div>
    </section>
  );
}
