import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, ShoppingBag } from "lucide-react";
import type { SkinType, SkinCondition } from "@/types/analysis";

interface ProductRecommendation {
  category: string;
  products: {
    brand: string;
    name: string;
    description: string;
    priceRange: "budget" | "mid" | "premium";
  }[];
}

interface ProductRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skinType: SkinType;
  conditions: SkinCondition[];
}

const getProductRecommendations = (
  skinType: SkinType,
  conditions: SkinCondition[]
): ProductRecommendation[] => {
  const recommendations: ProductRecommendation[] = [];

  // Очищение
  const cleansingProducts: ProductRecommendation = {
    category: "Очищение",
    products: [],
  };

  if (skinType === "oily" || skinType === "combination") {
    cleansingProducts.products.push(
      { brand: "CeraVe", name: "Foaming Facial Cleanser", description: "Пенка с церамидами и ниацинамидом", priceRange: "budget" },
      { brand: "La Roche-Posay", name: "Effaclar Gel", description: "Гель для жирной кожи с цинком", priceRange: "mid" },
      { brand: "Paula's Choice", name: "CLEAR Pore Normalizing Cleanser", description: "Мягкое очищение для проблемной кожи", priceRange: "mid" }
    );
  } else if (skinType === "dry" || skinType === "sensitive") {
    cleansingProducts.products.push(
      { brand: "CeraVe", name: "Hydrating Cleanser", description: "Увлажняющее очищение с гиалуроновой кислотой", priceRange: "budget" },
      { brand: "La Roche-Posay", name: "Toleriane Caring Wash", description: "Нежное очищение для чувствительной кожи", priceRange: "mid" },
      { brand: "Avène", name: "Xeracalm A.D Cleansing Oil", description: "Липидовосполняющее масло для очищения", priceRange: "mid" }
    );
  } else {
    cleansingProducts.products.push(
      { brand: "CeraVe", name: "SA Smoothing Cleanser", description: "Очищение с салициловой кислотой", priceRange: "budget" },
      { brand: "Clinique", name: "Liquid Facial Soap Mild", description: "Мягкое мыло для лица", priceRange: "mid" }
    );
  }
  recommendations.push(cleansingProducts);

  // Проверяем на акне
  const hasAcne = conditions.some(c => 
    c.name.toLowerCase().includes("акне") || 
    c.name.toLowerCase().includes("acne") ||
    c.name.toLowerCase().includes("воспалени")
  );

  if (hasAcne) {
    recommendations.push({
      category: "Лечение акне",
      products: [
        { brand: "Paula's Choice", name: "2% BHA Liquid Exfoliant", description: "Культовый эксфолиант с салициловой кислотой", priceRange: "mid" },
        { brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", description: "Сыворотка для сужения пор и контроля себума", priceRange: "budget" },
        { brand: "La Roche-Posay", name: "Effaclar Duo+", description: "Корректирующий крем против несовершенств", priceRange: "mid" },
        { brand: "Differin", name: "Adapalene Gel 0.1%", description: "Ретиноид для лечения акне", priceRange: "budget" }
      ]
    });
  }

  // Проверяем на пигментацию
  const hasPigmentation = conditions.some(c => 
    c.name.toLowerCase().includes("пигментац") || 
    c.name.toLowerCase().includes("пятн") ||
    c.name.toLowerCase().includes("постакне")
  );

  if (hasPigmentation) {
    recommendations.push({
      category: "Осветление и выравнивание тона",
      products: [
        { brand: "The Ordinary", name: "Alpha Arbutin 2% + HA", description: "Сыворотка для осветления пигментации", priceRange: "budget" },
        { brand: "Paula's Choice", name: "C15 Super Booster", description: "Концентрат витамина C 15%", priceRange: "mid" },
        { brand: "Skinceuticals", name: "C E Ferulic", description: "Премиальная сыворотка с витамином C", priceRange: "premium" },
        { brand: "La Roche-Posay", name: "Mela-D Pigment Control", description: "Сыворотка против пигментных пятен", priceRange: "mid" }
      ]
    });
  }

  // Увлажнение
  const moisturizingProducts: ProductRecommendation = {
    category: "Увлажнение",
    products: [],
  };

  if (skinType === "oily" || skinType === "combination") {
    moisturizingProducts.products.push(
      { brand: "CeraVe", name: "PM Facial Moisturizing Lotion", description: "Лёгкий увлажняющий лосьон с ниацинамидом", priceRange: "budget" },
      { brand: "La Roche-Posay", name: "Effaclar Mat", description: "Матирующий увлажняющий крем", priceRange: "mid" },
      { brand: "Neutrogena", name: "Hydro Boost Water Gel", description: "Гель с гиалуроновой кислотой", priceRange: "budget" }
    );
  } else if (skinType === "dry" || skinType === "sensitive") {
    moisturizingProducts.products.push(
      { brand: "CeraVe", name: "Moisturizing Cream", description: "Насыщенный крем с церамидами", priceRange: "budget" },
      { brand: "La Roche-Posay", name: "Cicaplast Baume B5+", description: "Восстанавливающий бальзам", priceRange: "mid" },
      { brand: "Avène", name: "XeraCalm A.D Lipid-Replenishing Cream", description: "Крем для очень сухой кожи", priceRange: "mid" }
    );
  } else {
    moisturizingProducts.products.push(
      { brand: "CeraVe", name: "Daily Moisturizing Lotion", description: "Ежедневный увлажняющий лосьон", priceRange: "budget" },
      { brand: "Clinique", name: "Dramatically Different Moisturizing Gel", description: "Культовый увлажняющий гель", priceRange: "mid" }
    );
  }
  recommendations.push(moisturizingProducts);

  // SPF всегда
  recommendations.push({
    category: "Защита от солнца (SPF)",
    products: [
      { brand: "La Roche-Posay", name: "Anthelios UVMune 400", description: "Флюид SPF50+ с новейшими фильтрами", priceRange: "mid" },
      { brand: "CeraVe", name: "Hydrating Sunscreen SPF50", description: "Увлажняющий солнцезащитный крем", priceRange: "budget" },
      { brand: "Isdin", name: "Fotoprotector Fusion Water", description: "Лёгкая текстура, не оставляет белых следов", priceRange: "mid" },
      { brand: "Bioderma", name: "Photoderm MAX Aquafluide", description: "Аквафлюид для чувствительной кожи", priceRange: "mid" }
    ]
  });

  return recommendations;
};

const getPriceLabel = (priceRange: "budget" | "mid" | "premium") => {
  switch (priceRange) {
    case "budget": return "₽";
    case "mid": return "₽₽";
    case "premium": return "₽₽₽";
  }
};

const getPriceClass = (priceRange: "budget" | "mid" | "premium") => {
  switch (priceRange) {
    case "budget": return "bg-success/10 text-success border-success/30";
    case "mid": return "bg-primary/10 text-primary border-primary/30";
    case "premium": return "bg-accent/10 text-accent border-accent/30";
  }
};

export function ProductRecommendationsModal({
  isOpen,
  onClose,
  skinType,
  conditions,
}: ProductRecommendationsModalProps) {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRecommendations(getProductRecommendations(skinType, conditions));
    }
  }, [isOpen, skinType, conditions]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Рекомендованные средства
          </DialogTitle>
          <DialogDescription>
            Подборка косметических средств на основе вашего типа кожи и выявленных проблем
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {recommendations.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                {category.category}
              </h3>
              <div className="grid gap-3">
                {category.products.map((product, productIndex) => (
                  <div
                    key={productIndex}
                    className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary">{product.brand}</span>
                          <Badge 
                            variant="outline" 
                            className={getPriceClass(product.priceRange)}
                          >
                            {getPriceLabel(product.priceRange)}
                          </Badge>
                        </div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-4">
            * Рекомендации носят информационный характер. Перед использованием новых средств 
            рекомендуем провести тест на небольшом участке кожи.
          </p>
          <Button onClick={onClose} className="w-full">
            Понятно, спасибо!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
