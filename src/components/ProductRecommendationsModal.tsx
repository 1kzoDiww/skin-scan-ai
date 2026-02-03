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
import { Sparkles, ShoppingBag } from "lucide-react";
import type { SkinType, SkinCondition } from "@/types/analysis";

interface Product {
  brand: string;
  name: string;
  description: string;
  price: number; // цена в тенге
  imageUrl: string;
}

interface ProductRecommendation {
  category: string;
  products: Product[];
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
      { 
        brand: "CeraVe", 
        name: "Foaming Facial Cleanser", 
        description: "Пенка с церамидами и ниацинамидом", 
        price: 4500,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop"
      },
      { 
        brand: "La Roche-Posay", 
        name: "Effaclar Gel", 
        description: "Гель для жирной кожи с цинком", 
        price: 7200,
        imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8f04?w=200&h=200&fit=crop"
      },
      { 
        brand: "Paula's Choice", 
        name: "CLEAR Pore Normalizing Cleanser", 
        description: "Мягкое очищение для проблемной кожи", 
        price: 9800,
        imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop"
      }
    );
  } else if (skinType === "dry" || skinType === "sensitive") {
    cleansingProducts.products.push(
      { 
        brand: "CeraVe", 
        name: "Hydrating Cleanser", 
        description: "Увлажняющее очищение с гиалуроновой кислотой", 
        price: 4200,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop"
      },
      { 
        brand: "La Roche-Posay", 
        name: "Toleriane Caring Wash", 
        description: "Нежное очищение для чувствительной кожи", 
        price: 6800,
        imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8f04?w=200&h=200&fit=crop"
      },
      { 
        brand: "Avène", 
        name: "Xeracalm A.D Cleansing Oil", 
        description: "Липидовосполняющее масло для очищения", 
        price: 8500,
        imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=200&h=200&fit=crop"
      }
    );
  } else {
    cleansingProducts.products.push(
      { 
        brand: "CeraVe", 
        name: "SA Smoothing Cleanser", 
        description: "Очищение с салициловой кислотой", 
        price: 4800,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop"
      },
      { 
        brand: "Clinique", 
        name: "Liquid Facial Soap Mild", 
        description: "Мягкое мыло для лица", 
        price: 8200,
        imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop"
      }
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
        { 
          brand: "The Ordinary", 
          name: "Niacinamide 10% + Zinc 1%", 
          description: "Сыворотка для сужения пор и контроля себума", 
          price: 2800,
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop"
        },
        { 
          brand: "Differin", 
          name: "Adapalene Gel 0.1%", 
          description: "Ретиноид для лечения акне", 
          price: 5500,
          imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200&h=200&fit=crop"
        },
        { 
          brand: "Paula's Choice", 
          name: "2% BHA Liquid Exfoliant", 
          description: "Культовый эксфолиант с салициловой кислотой", 
          price: 12500,
          imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop"
        },
        { 
          brand: "La Roche-Posay", 
          name: "Effaclar Duo+", 
          description: "Корректирующий крем против несовершенств", 
          price: 8900,
          imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8f04?w=200&h=200&fit=crop"
        }
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
        { 
          brand: "The Ordinary", 
          name: "Alpha Arbutin 2% + HA", 
          description: "Сыворотка для осветления пигментации", 
          price: 3200,
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop"
        },
        { 
          brand: "Paula's Choice", 
          name: "C15 Super Booster", 
          description: "Концентрат витамина C 15%", 
          price: 18500,
          imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop"
        },
        { 
          brand: "La Roche-Posay", 
          name: "Mela-D Pigment Control", 
          description: "Сыворотка против пигментных пятен", 
          price: 14200,
          imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8f04?w=200&h=200&fit=crop"
        },
        { 
          brand: "Skinceuticals", 
          name: "C E Ferulic", 
          description: "Премиальная сыворотка с витамином C", 
          price: 65000,
          imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=200&h=200&fit=crop"
        }
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
      { 
        brand: "Neutrogena", 
        name: "Hydro Boost Water Gel", 
        description: "Гель с гиалуроновой кислотой", 
        price: 4500,
        imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200&h=200&fit=crop"
      },
      { 
        brand: "CeraVe", 
        name: "PM Facial Moisturizing Lotion", 
        description: "Лёгкий увлажняющий лосьон с ниацинамидом", 
        price: 5200,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop"
      },
      { 
        brand: "La Roche-Posay", 
        name: "Effaclar Mat", 
        description: "Матирующий увлажняющий крем", 
        price: 8500,
        imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8f04?w=200&h=200&fit=crop"
      }
    );
  } else if (skinType === "dry" || skinType === "sensitive") {
    moisturizingProducts.products.push(
      { 
        brand: "CeraVe", 
        name: "Moisturizing Cream", 
        description: "Насыщенный крем с церамидами", 
        price: 4800,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop"
      },
      { 
        brand: "La Roche-Posay", 
        name: "Cicaplast Baume B5+", 
        description: "Восстанавливающий бальзам", 
        price: 7500,
        imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8f04?w=200&h=200&fit=crop"
      },
      { 
        brand: "Avène", 
        name: "XeraCalm A.D Lipid-Replenishing Cream", 
        description: "Крем для очень сухой кожи", 
        price: 9200,
        imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=200&h=200&fit=crop"
      }
    );
  } else {
    moisturizingProducts.products.push(
      { 
        brand: "CeraVe", 
        name: "Daily Moisturizing Lotion", 
        description: "Ежедневный увлажняющий лосьон", 
        price: 4500,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop"
      },
      { 
        brand: "Clinique", 
        name: "Dramatically Different Moisturizing Gel", 
        description: "Культовый увлажняющий гель", 
        price: 12500,
        imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop"
      }
    );
  }
  recommendations.push(moisturizingProducts);

  // SPF всегда
  recommendations.push({
    category: "Защита от солнца (SPF)",
    products: [
      { 
        brand: "CeraVe", 
        name: "Hydrating Sunscreen SPF50", 
        description: "Увлажняющий солнцезащитный крем", 
        price: 5800,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop"
      },
      { 
        brand: "Bioderma", 
        name: "Photoderm MAX Aquafluide", 
        description: "Аквафлюид для чувствительной кожи", 
        price: 8200,
        imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=200&h=200&fit=crop"
      },
      { 
        brand: "La Roche-Posay", 
        name: "Anthelios UVMune 400", 
        description: "Флюид SPF50+ с новейшими фильтрами", 
        price: 11500,
        imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee8f04?w=200&h=200&fit=crop"
      },
      { 
        brand: "Isdin", 
        name: "Fotoprotector Fusion Water", 
        description: "Лёгкая текстура, не оставляет белых следов", 
        price: 14800,
        imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200&h=200&fit=crop"
      }
    ]
  });

  // Сортируем продукты в каждой категории по цене (от дешёвого к дорогому)
  recommendations.forEach(category => {
    category.products.sort((a, b) => a.price - b.price);
  });

  return recommendations;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('kk-KZ').format(price) + ' ₸';
};

const getPriceClass = (price: number) => {
  if (price < 6000) return "bg-success/10 text-success border-success/30";
  if (price < 15000) return "bg-primary/10 text-primary border-primary/30";
  return "bg-accent/10 text-accent border-accent/30";
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
                    <div className="flex items-start gap-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-primary">{product.brand}</span>
                          <Badge 
                            variant="outline" 
                            className={getPriceClass(product.price)}
                          >
                            {formatPrice(product.price)}
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
            рекомендуем провести тест на небольшом участке кожи. Цены указаны ориентировочно.
          </p>
          <Button onClick={onClose} className="w-full">
            Понятно, спасибо!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
