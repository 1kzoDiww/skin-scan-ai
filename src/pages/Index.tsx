import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UploadZone } from "@/components/UploadZone";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";
import type { SkinAnalysisResult } from "@/types/analysis";

type AppState = "landing" | "upload" | "analyzing" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const { toast } = useToast();

  const handleStartAnalysis = () => {
    setAppState("upload");
    setTimeout(() => {
      document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedFile(file);
    setUploadedImage(preview);
  };

  const handleClearImage = () => {
    setUploadedFile(null);
    setUploadedImage(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage || !uploadedFile) return;

    setAppState("analyzing");
    setAnalysisStep(0);

    try {
      // Simulate step progression for UX
      const stepInterval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev >= 4) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);

      // Call the AI analysis edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-skin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            image: uploadedImage,
          }),
        }
      );

      clearInterval(stepInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка анализа");
      }

      const result = await response.json();
      setAnalysisResult(result);
      setAnalysisStep(5);
      setAppState("results");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Ошибка анализа",
        description: error instanceof Error ? error.message : "Попробуйте ещё раз позже",
        variant: "destructive",
      });
      setAppState("upload");
    }
  };

  const handleBackToUpload = () => {
    setAppState("upload");
    setAnalysisResult(null);
  };

  // Reset scroll position when changing states
  useEffect(() => {
    if (appState === "landing" || appState === "results") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [appState]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {appState === "landing" && (
          <>
            <Hero onStartAnalysis={handleStartAnalysis} />
            <Features />
            <HowItWorks />
          </>
        )}

        {appState === "upload" && (
          <>
            <div className="py-8" />
            <UploadZone
              onImageUpload={handleImageUpload}
              onAnalyze={handleAnalyze}
              isAnalyzing={false}
              uploadedImage={uploadedImage}
              onClearImage={handleClearImage}
            />
            <Features />
          </>
        )}

        {appState === "analyzing" && (
          <LoadingAnalysis currentStep={analysisStep} />
        )}

        {appState === "results" && analysisResult && uploadedImage && (
          <AnalysisResults
            result={analysisResult}
            imageUrl={uploadedImage}
            onBack={handleBackToUpload}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
