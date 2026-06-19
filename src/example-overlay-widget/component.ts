import type {
  OverlayWidgetComponent,
  OverlayWidgetInstance,
} from "@crowbartools/firebot-types";

// Note: This file is the source for the widget's *overlay* code. It is bundled
// into a standalone ESM module string (see tsdown.config.mts) and passed to
// Firebot via componentExtension.bundleSource. It runs inside the overlay
// (browser) and NOT in the Firebot/node process, so keep it self contained 
// and only use browser APIs

type Settings = {
  message: string;
};

type State = {
  bumps: number;
};

type WidgetConfig = Parameters<OverlayWidgetInstance<Settings, State>["update"]>[0];

const component: OverlayWidgetComponent<Settings, State> = {
  mount({ container, config }) {
    const root = document.createElement("div");
    
    root.style.cssText = [
      "display: flex",
      "flex-direction: column",
      "align-items: center",
      "justify-content: center",
      "width: 100%",
      "height: 100%",
      "gap: 0.25em",
      "font-family: sans-serif",
      "color: #ffffff",
      "text-align: center",
      "text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6)",
    ].join(";");

    const messageEl = document.createElement("div");
    messageEl.style.cssText = "font-size: 2em; font-weight: 700";

    const bumpsEl = document.createElement("div");
    bumpsEl.style.cssText = "font-size: 1em; opacity: 0.75";

    root.append(messageEl, bumpsEl);
    container.appendChild(root);

    const render = (cfg: WidgetConfig) => {
      messageEl.textContent = cfg.settings.message || "Hello from the overlay!";
      const bumps = cfg.state?.bumps ?? 0;
      bumpsEl.textContent = `Bumped ${bumps} time${bumps === 1 ? "" : "s"}`;
    };

    render(config);

    return {
      update(cfg) {
        render(cfg);
      },
      destroy() {
        root.remove();
      },
    };
  },
};

export default component;
