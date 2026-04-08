# 🎸 Afinador de Violão

Afinador de violão PWA (Progressive Web App) que funciona 100% no dispositivo do usuário — **nenhum dado de áudio é enviado para servidores**.

## Funcionalidades

- **Modo Violão**: afinação padrão EADGBE com indicação visual da corda detectada
- **Modo Cromático**: detecta qualquer nota musical
- **Medidor de cents**: agulha visual mostra o desvio da afinação ideal
- **PWA instalável**: funciona offline após a primeira visita
- **Mobile-first**: interface otimizada para telas de celular, tablet e desktop
- **100% local**: privacidade total — o áudio fica no seu dispositivo

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari)
- HTTPS (ou localhost) — necessário para acesso ao microfone
- Microfone funcional

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Visualizar build
npm run preview
```

## Publicação no GitHub Pages

Com **Settings → Pages → Build and deployment → GitHub Actions**, o workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publica automaticamente a cada push na branch `main`. O build define `VITE_BASE_URL` como `/<nome-do-repositório>/`, alinhado à URL `https://<usuário>.github.io/<repositório>/`. Desenvolvimento local continua com `base: '/'` (sem variável).

## Como instalar como PWA

1. Acesse o afinador pelo navegador (Chrome/Edge recomendados)
2. Clique no ícone de instalação na barra de endereço (ou menu > "Instalar aplicativo")
3. Pronto! O afinador estará disponível na sua tela inicial e funcionará offline

## Uso

1. Clique no botão do microfone para iniciar (o navegador pedirá permissão)
2. Toque uma corda do violão perto do microfone
3. Observe a nota detectada e ajuste até o indicador ficar verde (±5 cents)
4. Use o botão de modo para alternar entre Violão e Cromático

## Limitações

- A precisão depende da qualidade do microfone e do ambiente (evite ruídos)
- Em ambientes muito ruidosos, a detecção pode oscilar
- Safari no iOS pode exigir um toque explícito para iniciar o áudio

## Stack técnica

- **Vite** + **React** + **TypeScript**
- **Web Audio API** + **pitchy** (detecção de pitch)
- **vite-plugin-pwa** (Service Worker e manifest)
- **Lucide React** (ícones)

## Estrutura do projeto

```
src/
├── audio/         # Pipeline de áudio e detecção de pitch
├── components/    # Componentes React (Meter, Controls, etc.)
├── lib/           # Utilitários (conversão Hz/nota/cents)
├── App.tsx        # Componente principal
└── App.css        # Estilos mobile-first
```

## Privacidade

Este afinador processa todo o áudio **localmente no seu dispositivo**. Nenhum dado é coletado, armazenado ou transmitido. O código é open source para auditoria.

## Licença

MIT
