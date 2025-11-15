// src/services/GroqService.js
import Groq from "groq-sdk";

class GroqService {
  constructor() {
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;
    
    console.log('🔑 Groq API Key:', apiKey ? '✅ Encontrada' : '❌ Faltante');
    
    if (apiKey && apiKey !== 'your_key_here' && apiKey.startsWith('gsk_')) {
      try {
        this.groq = new Groq({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
        this.enabled = true;
        console.log('✅ Groq IA activada correctamente');
      } catch (error) {
        console.error('❌ Error inicializando Groq:', error);
        this.enabled = false;
      }
    } else {
      console.warn('⚠️ Groq deshabilitado - modo fallback activo');
      this.groq = null;
      this.enabled = false;
    }
    
    this.systemPrompt = `Eres Gas Monster, un asistente experto en automovilismo y motorsports.

CONOCIMIENTOS:
- Fórmula 1, NASCAR, MotoGP, Rally Dakar, WRC, Le Mans
- Historia del automovilismo
- Tecnología automotriz (turbos, motores, aerodinámica)
- Pilotos legendarios y actuales
- Circuitos famosos

PERSONALIDAD:
- Apasionado por el motor 🏁
- Conversacional y amigable
- Usa emojis relacionados con carreras (🏎️🏁🏍️⚙️🔧)
- Respuestas concisas pero informativas (2-4 párrafos máximo)
- Entusiasta pero profesional

ESTILO DE RESPUESTA:
- Directo al punto
- Explica conceptos de forma clara
- Usa comparaciones cuando sea útil
- Da datos interesantes y curiosos
- Si no sabes algo, admítelo honestamente

RESTRICCIONES:
- Si te piden noticias actuales, indica que puedes buscarlas
- No inventes estadísticas específicas
- Mantén las respuestas entre 100-300 palabras`;
  }

  async chat(userMessage, conversationHistory = []) {
    if (!this.enabled || !this.groq) {
      throw new Error('Groq not configured - using fallback');
    }

    try {
      const messages = [
        { role: "system", content: this.systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];

      const completion = await this.groq.chat.completions.create({
        messages: messages,
     model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1
      });

      return {
        success: true,
        message: completion.choices[0]?.message?.content || "Sin respuesta"
      };
    } catch (error) {
      console.error("Error en Groq chat:", error);
      throw error;
    }
  }

  async analyzeIntent(userMessage) {
    if (!this.enabled || !this.groq) {
      throw new Error('Groq not configured');
    }

    try {
      const prompt = `Analiza la siguiente consulta del usuario y clasifícala:

Usuario: "${userMessage}"

Responde SOLO con un JSON válido en este formato exacto (sin texto adicional):
{
  "tipo": "saludo|noticias|pregunta_tecnica|conversacion|despedida",
  "tema": "f1|nascar|motogp|dakar|rally|lemans|deportivos|general|null",
  "necesita_busqueda": true,
  "confianza": 0.9
}

Reglas:
- Si menciona "noticia", "últimas", "actualidad" → necesita_busqueda: true
- Si pregunta sobre conceptos, historia, comparaciones → necesita_busqueda: false
- tipo "noticias" solo si pide información actual/reciente`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 150
      });

      const response = completion.choices[0]?.message?.content || "{}";
      
      // Limpiar respuesta por si tiene texto extra
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : "{}";
      
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Error analizando intención:", error);
      throw error;
    }
  }

  async summarizeNews(articles) {
    if (!this.enabled || !this.groq) {
      throw new Error('Groq not configured');
    }

    try {
      const newsText = articles.map((art, idx) => 
        `${idx + 1}. ${art.title}\n${art.description || ''}`
      ).join('\n\n');

      const prompt = `Resume estas noticias de motorsports de forma breve y entusiasta para un fanático del motor:

${newsText}

Da un resumen general en 2-3 líneas destacando las tendencias principales o lo más emocionante. Usa emojis de carreras 🏎️🏁 apropiadamente.`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 200
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error resumiendo noticias:", error);
      throw error;
    }
  }
}

export default new GroqService();