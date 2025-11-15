// src/components/GasMonsterAI.jsx
import React, { useState, useEffect, useRef } from 'react';
import GroqService from '../services/GroqService';

const GasMonsterAI = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ultimoTema, setUltimoTema] = useState(null);
  const [useAI, setUseAI] = useState(true);
  const messagesEndRef = useRef(null);
  
  const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'ad6312cb55354f9380a1bc0ab3cc1171';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage = {
      role: 'assistant',
      content: `¡Bienvenido a Gas Monster! 🏁

Soy tu asistente experto en el mundo del motor ${useAI ? 'potenciado por IA 🤖' : ''}. Puedo ayudarte con:

🏎️ **Fórmula 1** - Noticias y análisis
🏜️ **Dakar Rally** - Aventura extrema
🏁 **NASCAR** - Carreras americanas
🏍️ **MotoGP** - Velocidad sobre dos ruedas
🏆 **24 Horas de Le Mans** - Resistencia legendaria
🚗 **Rally** - Carreras en tierra
⚡ **Autos deportivos** - Superdeportivos
🚙 **Monster Jam** - Camiones monstruo
⚙️ **Tecnología automotriz**
🎖️ **Autos clásicos vs modernos**

💬 Pregúntame lo que quieras o dime "noticias de F1"!`
    };
    
    setMessages([welcomeMessage]);
  }, [useAI]);

  const buscarNoticias = async (tema) => {
    try {
      let terminoBusqueda = tema;
      let palabrasClave = [];
      
      const temaLower = tema.toLowerCase();
      
      if (temaLower.includes('formula 1') || temaLower.includes('f1')) {
        terminoBusqueda = '(formula 1 OR F1) AND (racing OR GP OR Grand Prix OR Ferrari OR Mercedes OR Red Bull)';
        palabrasClave = ['f1', 'formula', 'grand prix', 'gp', 'ferrari', 'mercedes', 'red bull', 'racing', 'verstappen', 'hamilton'];
      } else if (temaLower.includes('nascar')) {
        terminoBusqueda = 'NASCAR AND (racing OR Cup Series OR Daytona OR driver)';
        palabrasClave = ['nascar', 'cup series', 'racing', 'daytona', 'driver'];
      } else if (temaLower.includes('motogp') || temaLower.includes('moto gp')) {
        terminoBusqueda = '(MotoGP OR "Moto GP") AND (racing OR rider OR motorcycle)';
        palabrasClave = ['motogp', 'motorcycle', 'racing', 'rider', 'marquez', 'rossi'];
      } else if (temaLower.includes('dakar')) {
        terminoBusqueda = 'Dakar AND (rally OR racing OR raid)';
        palabrasClave = ['dakar', 'rally', 'raid', 'desert'];
      } else if (temaLower.includes('le mans')) {
        terminoBusqueda = '"Le Mans" AND (24 hours OR racing OR endurance)';
        palabrasClave = ['le mans', '24 hours', 'endurance', 'racing'];
      } else if (temaLower.includes('rally')) {
        terminoBusqueda = '(rally OR WRC) AND (racing OR championship)';
        palabrasClave = ['rally', 'wrc', 'racing', 'championship'];
      }
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(terminoBusqueda)}&language=es&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles && data.articles.length > 0) {
        let articulosFiltrados = data.articles;
        
        if (palabrasClave.length > 0) {
          articulosFiltrados = data.articles.filter(article => {
            const textoCompleto = `${article.title} ${article.description || ''}`.toLowerCase();
            const coincidencias = palabrasClave.filter(palabra => textoCompleto.includes(palabra));
            return coincidencias.length >= 1;
          });
        }
        
        const titulosVistos = new Set();
        articulosFiltrados = articulosFiltrados.filter(article => {
          const tituloSimple = article.title.toLowerCase().substring(0, 50);
          if (titulosVistos.has(tituloSimple)) {
            return false;
          }
          titulosVistos.add(tituloSimple);
          return true;
        });
        
        return articulosFiltrados.slice(0, 5);
      }
      return null;
    } catch (error) {
      console.error('Error buscando noticias:', error);
      return null;
    }
  };

  const respuestasRapidas = {
    'formula 1': '🏎️ **Fórmula 1** es el pináculo del automovilismo mundial. ¿Quieres ver las últimas noticias de F1?',
    'f1': '🏎️ La F1 combina tecnología de punta y pilotos excepcionales. ¿Te gustaría ver noticias recientes?',
    'nascar': '🏁 **NASCAR** es la categoría más popular en Estados Unidos. ¿Quieres ver noticias actuales?',
    'motogp': '🏍️ **MotoGP** es el campeonato mundial de motociclismo. ¿Te gustaría ver las últimas noticias?',
  };

  const respuestaFallback = (userInput) => {
    const textoLower = userInput.toLowerCase();
    
    for (const [key, respuesta] of Object.entries(respuestasRapidas)) {
      if (textoLower.includes(key)) {
        return respuesta;
      }
    }
    
    return `Interesante pregunta sobre "${userInput}" 🤔\n\nTe puedo ayudar con:\n🏎️ Fórmula 1\n🏁 NASCAR\n🏍️ MotoGP\n📰 Noticias actuales`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      let usarIA = useAI;
      let intent = null;

      if (usarIA) {
        try {
          intent = await GroqService.analyzeIntent(userInput);
        } catch (error) {
          console.warn('⚠️ IA no disponible, usando fallback');
          usarIA = false;
        }
      }

      const necesitaNoticias = 
        intent?.necesita_busqueda || 
        userInput.toLowerCase().includes('noticia');

      if (necesitaNoticias) {
        const noticiasEncontradas = await buscarNoticias(intent?.tema || userInput);
        
        if (noticiasEncontradas && noticiasEncontradas.length > 0) {
          let resumen = null;
          if (usarIA) {
            try {
              resumen = await GroqService.summarizeNews(noticiasEncontradas);
            } catch (error) {
              console.warn('⚠️ Resumen IA falló');
            }
          }
          
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: resumen || `📰 ¡Encontré ${noticiasEncontradas.length} noticias para ti!`
          }]);

          setMessages(prev => [...prev, {
            role: 'system',
            content: 'noticias',
            data: noticiasEncontradas
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `No encontré noticias sobre "${userInput}". ¿Quieres buscar sobre otro tema? 🏁`
          }]);
        }
      } else {
        let respuestaFinal = null;

        if (usarIA) {
          try {
            const conversationHistory = messages
              .filter(m => m.role !== 'system')
              .slice(-6)
              .map(m => ({ role: m.role, content: m.content }));

            const aiResponse = await GroqService.chat(userInput, conversationHistory);
            if (aiResponse.success) {
              respuestaFinal = aiResponse.message;
            }
          } catch (error) {
            console.warn('⚠️ Chat IA falló');
          }
        }

        if (!respuestaFinal) {
          respuestaFinal = respuestaFallback(userInput);
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: respuestaFinal
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Lo siento, hubo un error. Intenta de nuevo.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedTopics = [
    { emoji: '🏎️', text: 'Noticias de Fórmula 1' },
    { emoji: '🏁', text: '¿Qué es NASCAR?' },
    { emoji: '🏍️', text: 'Últimas de MotoGP' },
    { emoji: '⚙️', text: '¿Cómo funciona un turbo?' },
    { emoji: '⚡', text: 'Ferrari vs Lamborghini' },
    { emoji: '🏜️', text: 'Noticias del Dakar' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 0.4s ease'
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .gas-monster-scrollbar::-webkit-scrollbar { width: 8px; }
        .gas-monster-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
        .gas-monster-scrollbar::-webkit-scrollbar-thumb { background: #E50914; border-radius: 4px; }
        .news-card {
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          margin: 8px 0;
          transition: all 0.3s;
        }
        .news-card:hover {
          border-color: #E50914;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
        }
      `}</style>

      {/* Header con botón toggle IA */}
      <div style={{
        background: 'linear-gradient(135deg, #E50914 0%, #8B0000 100%)',
        padding: '20px 32px',
        boxShadow: '0 4px 20px rgba(229, 9, 20, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px' }}>🏁</div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0, color: '#fff' }}>GAS MONSTER</h1>
              <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: '#fff' }}>
                {useAI ? 'Agente IA del Mundo Motor 🤖' : 'Tu Revista del Mundo Motor 📰'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setUseAI(!useAI)}
              style={{
                padding: '8px 16px',
                background: useAI ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${useAI ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 255, 255, 0.3)'}`,
                borderRadius: '20px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {useAI ? '🤖 IA ON' : '📋 IA OFF'}
            </button>
            <button onClick={onClose} style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer'
            }}>✕</button>
          </div>
        </div>
      </div>

      {/* Chat messages - simplificado para brevedad */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="gas-monster-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {messages.map((msg, idx) => {
            if (msg.content === 'noticias' && msg.data) {
              return (
                <div key={idx}>
                  {msg.data.map((noticia, nIdx) => (
                    <div key={nIdx} className="news-card">
                      {noticia.urlToImage && <img src={noticia.urlToImage} alt={noticia.title} style={{ width: '100%', borderRadius: '8px' }} />}
                      <h3 style={{ color: '#fff', fontSize: '15px' }}>{noticia.title}</h3>
                      <p style={{ color: '#999', fontSize: '13px' }}>{noticia.description}</p>
                      <a href={noticia.url} target="_blank" rel="noopener noreferrer" style={{ color: '#E50914' }}>
                        Leer más →
                      </a>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div key={idx} style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: msg.role === 'user' ? '#333' : '#E50914',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div style={{
                  background: msg.role === 'user' ? '#E50914' : '#2a2a2a',
                  padding: '16px',
                  borderRadius: '16px',
                  color: '#fff',
                  maxWidth: '70%',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          {loading && <div style={{ color: '#E50914' }}>Escribiendo...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested topics */}
        <div style={{ padding: '16px', background: 'rgba(229, 9, 20, 0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {suggestedTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setInput(topic.text)}
                style={{
                  background: 'rgba(229, 9, 20, 0.1)',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {topic.emoji} {topic.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', background: '#1a1a1a' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre el mundo del motor..."
              disabled={loading}
              style={{
                flex: 1,
                background: '#2a2a2a',
                border: '2px solid #333',
                borderRadius: '12px',
                padding: '16px',
                color: '#fff',
                fontSize: '15px'
              }}
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: '56px',
                height: '56px',
                background: '#E50914',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              {loading ? '⏳' : '🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GasMonsterAI;