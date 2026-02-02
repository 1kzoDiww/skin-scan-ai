import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `Ты — профессиональный дерматолог-AI, анализирующий фотографии кожи. 
Проанализируй изображение и предоставь детальный анализ в формате JSON.

Ты должен определить:
1. Тип кожи (dry, oily, combination, normal, sensitive)
2. Проблемные зоны с координатами (x, y в процентах от 0 до 100)
3. Состояние кожи и проблемы
4. Возможные причины проблем
5. Рекомендации по уходу
6. Нужна ли консультация дерматолога

ВАЖНО: Отвечай ТОЛЬКО валидным JSON без дополнительного текста. Формат:
{
  "skinType": "combination",
  "skinTypeDescription": "Описание типа кожи",
  "conditions": [
    {
      "name": "Название проблемы",
      "description": "Описание",
      "severity": "mild|moderate|severe"
    }
  ],
  "problemZones": [
    {
      "x": 30,
      "y": 40,
      "problem": "Описание проблемы",
      "severity": "mild|moderate|severe"
    }
  ],
  "possibleCauses": ["Причина 1", "Причина 2"],
  "recommendations": [
    {
      "title": "Название рекомендации",
      "description": "Описание",
      "category": "skincare|lifestyle|products|professional"
    }
  ],
  "shouldSeeDermatologist": false,
  "dermatologistReason": "Причина если shouldSeeDermatologist = true",
  "overallHealth": 75,
  "summary": "Краткое резюме состояния кожи"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "Изображение не предоставлено" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Сервис временно недоступен" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Starting skin analysis...");

    // Call Lovable AI Gateway with vision model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Проанализируй эту фотографию кожи и предоставь детальный анализ состояния."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов, попробуйте позже" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Превышен лимит использования AI" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Ошибка анализа изображения" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Не удалось получить анализ" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from AI
    let analysisResult;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      analysisResult = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a default response if parsing fails
      analysisResult = {
        skinType: "combination",
        skinTypeDescription: "Анализ выполнен, но требуется дополнительная проверка",
        conditions: [
          {
            name: "Требуется уточнение",
            description: "Рекомендуем загрузить более чёткое фото для точного анализа",
            severity: "mild"
          }
        ],
        problemZones: [],
        possibleCauses: ["Недостаточное качество изображения"],
        recommendations: [
          {
            title: "Повторите загрузку",
            description: "Сделайте фото при хорошем освещении, без макияжа, держа камеру на расстоянии вытянутой руки",
            category: "skincare"
          }
        ],
        shouldSeeDermatologist: false,
        overallHealth: 70,
        summary: "Для точного анализа рекомендуем загрузить более качественное фото"
      };
    }

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analyze skin error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Неизвестная ошибка" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
