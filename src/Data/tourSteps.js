// tourSteps.js
export const steps = [
  {
    selector: "html",
    position: "center",
    content: "👋 Welcome! Let’s take a quick tour of how this works. \nUse the arrow on the tooltip or the keyboard to navigate through the onboarding.",
  },
  {
    selector: "html",
    position: "center",
    content: "Great job navigating through this! Let's move to the next step :)",
  },
  {
    selector: ".globe-canvas",
    position: "center",
    content: "This is the globe. Try moving your mouse to rotate and zoom to explore countries.\n It also works with pinching and moving your finger on mobile and tablet!",
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
