import React, { createContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

const defaultThemes = {
  light: {
    name: 'light',
    background: '#f5f5f5',
    color: '#222',
    primary: '#ee4c02',
    secondary: '#252525',
    accent: '#0078d7',
  },
  dark: {
    name: 'dark',
    background: '#252525',
    color: '#fff',
    primary: '#ee4c02',
    secondary: '#1d1d1d',
    accent: '#0078d7',
  },
};

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : defaultThemes.dark;
  });
  
  const [backgroundImage, setBackgroundImage] = useState(() => {
    const saved = localStorage.getItem('backgroundImage');
    // Se for só um ID, monta a URL da API
    if (saved && /^[0-9]+$/.test(saved)) {
      return `/api/images/image/${saved}`;
    }
    return saved || '';
  });
  
  const [logo, setLogo] = useState(() => localStorage.getItem('tenantLogo') || '');
  const isInitialMount = useRef(true);

  // Função melhorada para validar imagens
  const validateImage = async (url) => {
    if (!url) return false;
    
    console.log('🔍 Validando imagem:', url);
    
    // Para Data URLs, sempre são válidas
    if (url.startsWith('data:')) return true;
    
    try {
      // Tenta fazer uma requisição HEAD primeiro (mais leve)
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      console.log('📊 Status da imagem:', response.status, response.statusText);
      
      if (response.ok) {
        console.log('✅ Imagem válida:', url);
        return true;
      } else {
        console.warn('❌ Imagem não encontrada (HEAD):', url, response.status);
        return false;
      }
    } catch (headError) {
      console.warn('⚠️ HEAD falhou, tentando GET:', url, headError);
      
      // Se HEAD falhar, tenta GET (pode ser problema de CORS)
      try {
        const getResponse = await fetch(url, { 
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log('📊 Status GET:', getResponse.status);
        
        if (getResponse.ok) {
          console.log('✅ Imagem válida (GET):', url);
          return true;
        } else {
          console.warn('❌ Imagem não encontrada (GET):', url, getResponse.status);
          return false;
        }
      } catch (getError) {
        console.error('💥 Erro ao validar imagem:', url, getError);
        return false;
      }
    }
  };

  // Busca config do tenant
  useEffect(() => {
    async function fetchTenantConfig() {
      if (user && user.tenantId) {
        try {
          console.log('👤 Buscando configuração do tenant:', user.tenantId);
          const res = await fetch(`/api/tenant/${user.tenantId}/config`);
          
          console.log('📡 Resposta do tenant config:', res.status);
          
          if (res.ok) {
            const data = await res.json();
            console.log('🎯 Configuração recebida:', data);
            
            if (data.backgroundImage && !backgroundImage) {
              let bgUrl = data.backgroundImage;
              // Se vier só o ID, monta a URL
              if (/^[0-9]+$/.test(bgUrl)) {
                bgUrl = `/api/images/image/${bgUrl}`;
              }
              console.log('🖼️ Tentando aplicar background do tenant:', bgUrl);
              const isValid = await validateImage(bgUrl);
              if (isValid) {
                setBackgroundImage(bgUrl);
                // Salva só o ID se possível, para evitar URL hardcoded
                if (/^\/api\/images\/image\/(\d+)$/.test(bgUrl)) {
                  localStorage.setItem('backgroundImage', RegExp.$1);
                } else {
                  localStorage.setItem('backgroundImage', bgUrl);
                }
              }
            }
            
            if (data.logo && !logo) {
              console.log('�️ Tentando aplicar logo do tenant:', data.logo);
              const isValid = await validateImage(data.logo);
              if (isValid) {
                setLogo(data.logo);
                localStorage.setItem('tenantLogo', data.logo);
              }
            }
          } else {
            console.warn('⚠️ Erro ao buscar tenant config:', res.status);
          }
        } catch (e) {
          console.warn('💥 Erro ao buscar configuração do tenant:', e);
        }
      }
    }
    
    fetchTenantConfig();
  }, [user]);

  // Aplica o tema e background
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));

    // Aplica variáveis CSS
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--color', theme.color);
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);

    // Função para aplicar background
    const applyBackground = async () => {
      console.log('🎨 Aplicando background:', backgroundImage);
      
      if (!backgroundImage) {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = theme.background;
        return;
      }

      // Para Data URLs, aplica diretamente
      if (backgroundImage.startsWith('data:')) {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundColor = theme.background;
        return;
      }

      // Para URLs, valida antes de aplicar
      const isValid = await validateImage(backgroundImage);
      
      if (isValid) {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundColor = theme.background;
        console.log('✅ Background aplicado com sucesso');
      } else {
        console.warn('❌ Background inválido, usando fallback');
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = theme.background;
      }
    };

    applyBackground();
  }, [theme, backgroundImage]);

  // Limpeza na inicialização
  useEffect(() => {
    if (isInitialMount.current) {
      console.log('🚀 Inicializando ThemeProvider...');
      
      const savedBackground = localStorage.getItem('backgroundImage');
      const savedLogo = localStorage.getItem('tenantLogo');
      
      console.log('💾 Background salvo:', savedBackground);
      console.log('💾 Logo salva:', savedLogo);
      
      isInitialMount.current = false;
    }
  }, []);

  function changeTheme(themeName) {
    setTheme(defaultThemes[themeName] || defaultThemes.dark);
  }

  function setCustomTheme(customTheme) {
    setTheme({ ...theme, ...customTheme });
  }

  async function changeBackground(imgUrl) {
    console.log('🔄 Alterando background para:', imgUrl);
    
    if (!imgUrl) {
      setBackgroundImage('');
      localStorage.removeItem('backgroundImage');
      return;
    }

    // Se for só um ID, monta a URL
    let url = imgUrl;
    if (/^[0-9]+$/.test(imgUrl)) {
      url = `/api/images/image/${imgUrl}`;
    }

    if (url.startsWith('data:')) {
      setBackgroundImage(url);
      localStorage.setItem('backgroundImage', url);
      return;
    }

    const isValid = await validateImage(url);
    if (isValid) {
      setBackgroundImage(url);
      // Salva só o ID se possível
      if (/^\/api\/images\/image\/(\d+)$/.test(url)) {
        localStorage.setItem('backgroundImage', RegExp.$1);
      } else {
        localStorage.setItem('backgroundImage', url);
      }
    } else {
      console.error('❌ Não foi possível carregar a imagem:', url);
      throw new Error(`Imagem não encontrada: ${url}`);
    }
  }

  async function setTenantLogo(logoUrl) {
    console.log('🔄 Alterando logo para:', logoUrl);
    
    if (!logoUrl) {
      setLogo('');
      localStorage.removeItem('tenantLogo');
      return;
    }

    const isValid = await validateImage(logoUrl);
    
    if (isValid) {
      setLogo(logoUrl);
      localStorage.setItem('tenantLogo', logoUrl);
    } else {
      console.error('❌ Não foi possível carregar a logo:', logoUrl);
      throw new Error(`Logo não encontrada: ${logoUrl}`);
    }
  }

  const value = {
    theme,
    changeTheme,
    setCustomTheme,
    backgroundImage,
    changeBackground,
    logo,
    setTenantLogo,
    user
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}