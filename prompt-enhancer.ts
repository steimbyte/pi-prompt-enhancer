/**
 * Prompt Enhancer Extension
 * 
 * Verbessert Prompts per KI im Hintergrund.
 * Nutzt das aktuell ausgewählte Model.
 * 
 * Verwendung:
 *   /enhance schreib mir eine funktion die...
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { complete } from "@earendil-works/pi-ai";

const ENHANCE_PROMPT = `Du bist ein Prompt-Optimierer.

REGELN:
- Mache den Prompt KLARER und PRÄZISER
- Strukturiere logisch: Kontext → Ziel → Einschränkungen
- Entferne Füllwörter
- Behalte originale Intention
- Maximal 500 Zeichen

Antworte NUR mit dem verbesserten Prompt, keine Erklärung, keine Einleitung.`;

const spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧"];
let spinnerIndex = 0;
let spinnerInterval: NodeJS.Timeout | null = null;

function startSpinner(modelName: string): string {
  spinnerIndex = 0;
  const update = () => {
    spinnerIndex = (spinnerIndex + 1) % spinners.length;
  };
  spinnerInterval = setInterval(update, 100);
  return `${spinners[0]} ${modelName}`;
}

function nextSpinner(modelName: string): string {
  spinnerIndex = (spinnerIndex + 1) % spinners.length;
  return `${spinners[spinnerIndex]} ${modelName}`;
}

function stopSpinner() {
  if (spinnerInterval) {
    clearInterval(spinnerInterval);
    spinnerInterval = null;
  }
}

export default function promptEnhancer(pi: ExtensionAPI) {
  pi.registerCommand("enhance", {
    description: "Prompt per KI verbessern",
    handler: async (args, ctx) => {
      const originalPrompt = args.trim();

      if (!originalPrompt) {
        ctx.ui.notify("Bitte Text eingeben: /enhance <dein prompt>", "warning");
        return;
      }

      // Aktuelles Model holen
      const model = ctx.model;
      if (!model) {
        ctx.ui.notify("Kein Model ausgewählt", "error");
        return;
      }

      const modelName = `${model.provider}/${model.id}`;
      const spinnerText = startSpinner(modelName);

      // Widget über dem Editor anzeigen
      ctx.ui.setWidget("enhance-spinner", [
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "  🔄 Prompt wird optimiert...",
        `  Model: ${modelName}`,
        `  ${spinnerText}`,
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      ]);

      // Spinner im Widget updaten
      const spinnerIntervalId = setInterval(() => {
        ctx.ui.setWidget("enhance-spinner", [
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "  🔄 Prompt wird optimiert...",
          `  Model: ${modelName}`,
          `  ${nextSpinner(modelName)}`,
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        ]);
      }, 100);

      try {
        // API Auth holen
        const auth = await ctx.modelRegistry.getApiKeyAndHeaders(model);
        if (!auth.ok || !auth.apiKey) {
          ctx.ui.notify(`API-Key für ${model.provider} nicht gefunden`, "error");
          clearInterval(spinnerIntervalId);
          stopSpinner();
          ctx.ui.setWidget("enhance-spinner", []);
          return;
        }

        // KI-Call
        const response = await complete(
          model,
          {
            messages: [
              { role: "system", content: ENHANCE_PROMPT },
              { role: "user", content: originalPrompt }
            ]
          },
          {
            apiKey: auth.apiKey,
            headers: auth.headers,
            maxTokens: 500,
            temperature: 0.3,
          }
        );

        clearInterval(spinnerIntervalId);
        stopSpinner();

        const enhancedPrompt = response.content
          .filter((c): c is { type: "text"; text: string } => c.type === "text")
          .map(c => c.text)
          .join("\n")
          .trim();

        // Widget ausblenden
        ctx.ui.setWidget("enhance-spinner", []);

        if (!enhancedPrompt) {
          ctx.ui.notify("Keine Antwort vom Model", "error");
          return;
        }

        ctx.ui.notify(`✨ Prompt optimiert mit ${modelName}!`, "success");
        
        // Ergebnis als User-Message → LLM wird getriggert
        await new Promise(r => setTimeout(r, 100));
        pi.sendUserMessage(enhancedPrompt);

      } catch (error) {
        clearInterval(spinnerIntervalId);
        stopSpinner();
        ctx.ui.setWidget("enhance-spinner", []);
        ctx.ui.notify(`Fehler: ${error instanceof Error ? error.message : "Unbekannt"}`, "error");
      }
    },
  });
}
