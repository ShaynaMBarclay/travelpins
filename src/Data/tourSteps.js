// tourSteps.js
export const steps = [
  {
    selector: "body",
    position: "center",
    content: "👋 Welcome! Let’s take a quick tour of how this works.",
  },
  {
    selector: ".globe-canvas",
    position: "center",
    content: "This is the globe. You can rotate and zoom to explore countries.",
  },
  {
    selector: ".globe-canvas",
    position: "center",
    content:
      "Click the France pin to open its country page.\n(Hover a pin to see its country name.)",
    stepInteraction: true,
  },
];
