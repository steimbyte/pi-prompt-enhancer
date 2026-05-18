# pi-prompt-enhancer

**Pi Agent Extension** – Verbessert Prompts per KI im Hintergrund.

## Problem

Man schreibt schnell einen Prompt, der ist aber unklar/unkonzise. Umformulieren kostet Zeit.

## Lösung

`/enhance <prompt>` → KI verbessert den Prompt automatisch.

## Workflow

```
Du: /enhance schreib mir eine funktion die daten parsed
     ↓
Plugin: Ruft KI auf (mit deinem aktuellen Model)
     ↓
Widget zeigt: Spinner + Model-Name über dem Editor
     ↓
KI gibt optimierten Prompt zurück
     ↓
Plugin: Sendet als User-Message → LLM wird getriggert
```

## Features

- `/enhance <prompt>` – Prompt wird mit dem aktuell ausgewählten Model optimiert
- Spinner-Animation während der Verarbeitung
- Widget über dem Editor zeigt Status + Model
- Ergebnis wird automatisch als User-Message gesendet

## Installation

1. Extension in `~/.pi/agent/extensions/` kopieren oder verlinken:
```bash
ln -s ~/pi-prompt-enhancer/prompt-enhancer.ts ~/.pi/agent/extensions/prompt-enhancer.ts
```

2. In `~/.pi/agent/extensions/package.json` hinzufügen:
```json
{
  "pi": {
    "extensions": ["./prompt-enhancer.ts"]
  }
}
```

3. Pi neu laden:
```
/reload
```

## Vorteile

- Schneller als selber umformulieren
- Nutzt dein bereits ausgewähltes Model
- Widget zeigt transparent was passiert
- Ergebnis direkt im Chat zum Übernehmen/Verwerfen

## Requirements

- Pi Agent mit aktivem Model (OpenAI, Groq, Mistral, etc.)
- API-Key muss als Environment Variable gesetzt sein
