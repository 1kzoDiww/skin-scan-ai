import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageUpload: (file: File, preview: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  uploadedImage: string | null;
  onClearImage: () => void;
}

export function UploadZone({ 
  onImageUpload, 
  onAnalyze, 
  isAnalyzing, 
  uploadedImage,
  onClearImage 
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError("Поддерживаются только JPG, PNG и WebP форматы");
      return false;
    }

    if (file.size > maxSize) {
      setError("Размер файла не должен превышать 10 МБ");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onImageUpload(file, preview);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <section className="py-16 px-4" id="upload">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Загрузите фотографию</h2>
          <p className="text-muted-foreground">
            Сделайте чёткое фото лица при хорошем освещении без макияжа
          </p>
        </div>

        {!uploadedImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer",
              isDragging 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-border hover:border-primary/50 hover:bg-secondary/50",
              error && "border-destructive bg-destructive/5"
            )}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                isDragging ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
              )}>
                <Upload className="w-8 h-8" />
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium mb-1">
                  {isDragging ? "Отпустите для загрузки" : "Перетащите фото или нажмите"}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG или WebP до 10 МБ
                </p>
              </div>
            </div>

            {error && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden border border-border">
              <img 
                src={uploadedImage} 
                alt="Загруженное фото" 
                className="w-full h-auto max-h-[500px] object-contain bg-secondary/30"
              />
              <button
                onClick={onClearImage}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                aria-label="Удалить фото"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="flex-1"
                onClick={onAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-pulse-soft">Анализируем...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    Начать анализ
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={onClearImage}
                disabled={isAnalyzing}
              >
                Выбрать другое фото
              </Button>
            </div>
          </div>
        )}

        {/* Privacy notice */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          🔒 Ваши фотографии обрабатываются локально и не сохраняются на серверах
        </p>
      </div>
    </section>
  );
}
