// tourSteps.js
export const steps = [
  {
    selector: "html",
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
      "Click the France pin to open its country page. (Spoiler, it's the pink one)"
      + "\n(Zoom in to click a pin and hover over it to see its country name. )",
    stepInteraction: true,
  },
  {
    selector: "body",
    position: "center",
    content: "That's it for the tour! Click on the X to close this and enjoy the rest of the app!",
  },
];
