import { OverlayWidgetType } from "@crowbartools/firebot-types";
import bundleSource from "./component?string-bundle";

type Settings = {
  message: string;
};

type State = {
  bumps: number;
};

const exampleOverlayWidget: OverlayWidgetType<Settings, State> = {
  id: "starter-plugin:example-overlay-widget",
  name: "Example Overlay Widget",
  description:
    "A simple example overlay widget rendered from a bundled ESM component",
  icon: "fad fa-flask",
  initialAspectRatio: { width: 16, height: 9 },
  settingsSchema: [
    {
      name: "message",
      type: "string",
      default: "Hello from the overlay!",
      title: "Message",
      description: "Text shown in the widget on the overlay",
    },
  ],
  initialState: { bumps: 0 },
  supportsLivePreview: true,
  livePreviewState: { bumps: 0 },
  stateDisplay: (config) => `Bumped ${config.state?.bumps ?? 0} times`,
  uiActions: [
    {
      id: "bump",
      label: "Bump",
      icon: "fad fa-plus",
      click: (config) => ({
        newState: { bumps: (config.state?.bumps ?? 0) + 1 },
      }),
    },
  ],
  componentExtension: {
    bundleSource,
  },
};

export default exampleOverlayWidget;
