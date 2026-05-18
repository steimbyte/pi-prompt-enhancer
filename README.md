# pi-prompt-enhancer

**Pi Agent Extension** – Verbessert Prompts per KI im Hintergrund.

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

## Verwendung

```
/enhance schreib mir eine funktion die daten parsed
```

Der optimierte Prompt erscheint automatisch im Chat und das LLM wird getriggert.

## Requirements

- Pi Agent mit aktivem Model (OpenAI, Groq, Mistral, etc.)
- API-Key muss als Environment Variable gesetzt sein
