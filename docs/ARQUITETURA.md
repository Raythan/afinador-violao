# Arquitetura do Afinador de Violão

## Visão geral

O afinador é uma **PWA (Progressive Web App)** que roda inteiramente no navegador, sem backend. Usa a **Web Audio API** para capturar áudio do microfone e detectar a frequência fundamental em tempo real.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│  Microfone  │────▶│ AudioContext │────▶│ AnalyserNode│────▶│   Pitchy    │
│ getUserMedia│     │              │     │ (FFT 4096)  │     │  (YIN-like) │
└─────────────┘     └──────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                                    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│     UI      │◀────│  React State │◀────│ Hz → Nota   │◀────│  Frequência │
│ (Medidor)   │     │              │     │ (cents)     │     │  + Clareza  │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
```

## Decisões de design

### Por que Vite + React + TypeScript?

- **Vite**: build rápido, HMR instantâneo, excelente suporte a PWA via plugin
- **React**: componentização clara, ampla adoção (bom para portfólio), hooks para estado
- **TypeScript**: tipagem forte ajuda a evitar bugs na conversão Hz/nota

### Por que pitchy para detecção de pitch?

A biblioteca `pitchy` implementa um algoritmo baseado em autocorrelação (similar ao YIN) otimizado para JavaScript. Vantagens:

- Leve (~4KB gzipped)
- Precisa para frequências de violão (80–400Hz)
- Retorna um valor de "clareza" que permite filtrar ruídos

Alternativa seria implementar YIN manualmente, mas pitchy já resolve o problema de forma confiável.

### Por que fftSize = 4096?

Com sample rate de 44100Hz:
- Resolução de frequência: ~10.7Hz por bin
- Latência: ~93ms por frame

Esse balanço é suficiente para detectar notas de violão (E2 = 82Hz até E4 = 330Hz) com boa responsividade.

### Mobile-first

A interface foi desenhada primeiro para celular:

- **Safe areas**: `env(safe-area-inset-*)` para notch e barra home
- **Touch targets**: botões com mínimo 48×48px
- **Fluid typography**: `clamp()` para escalar texto sem breakpoints rígidos
- **Landscape support**: layout flexível que reorganiza em paisagem

### Ícones (Lucide React)

Escolhemos Lucide por:
- Consistência visual (mesmo peso de traço)
- Biblioteca leve (tree-shakeable)
- Boa semântica (microfone, guitarra, etc.)

## Estrutura de pastas

```
src/
├── audio/
│   └── pitch.ts         # Captura de áudio e detecção de frequência
├── components/
│   ├── Controls.tsx     # Botões de ligar/modo
│   ├── Meter.tsx        # Agulha visual de cents
│   ├── NoteDisplay.tsx  # Nota e frequência detectadas
│   └── StringSelector.tsx # Indicador de cordas do violão
├── lib/
│   └── notes.ts         # Conversão Hz ↔ nota, afinação padrão
├── App.tsx              # Orquestração principal
├── App.css              # Estilos (variáveis, mobile-first)
├── main.tsx             # Entry point React
└── index.css            # Reset mínimo
```

## Fluxo de dados

1. **Usuário clica em "Iniciar"** → `startAudio()` pede permissão e cria `AudioContext`
2. **Loop de animação** (`requestAnimationFrame`) lê amostras do `AnalyserNode`
3. **Pitchy** processa o buffer e retorna frequência + clareza
4. **Se clareza > 0.9**: converte Hz para nota/cents e atualiza estado React
5. **React** re-renderiza o medidor e a nota exibida

## PWA

Configurado via `vite-plugin-pwa`:

- **Service Worker**: cache de todos os assets estáticos
- **Manifest**: nome, ícones, cores, display standalone
- **Offline**: funciona sem internet após primeira visita (o microfone não precisa de rede)

## Testes

Testes unitários em `src/lib/notes.test.ts` cobrem:

- Conversão Hz → MIDI
- Conversão MIDI → Hz
- Detecção de nota e oitava
- Cálculo de cents
- Busca da corda mais próxima
