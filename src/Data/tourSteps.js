// tourSteps.js
export const steps = [
  {
    selector: "html",
    position: "center",
    content: "👋 Welcome traveler! Let us embark on a brief tour of these lands. \nUse the arrow on the tooltip or the keyboard to navigate through the tutorial.",
  },
  {
    selector: "html",
    position: "center",
    content: "Well done, brave traveler! Prepare now to venture onward to the next step!",
  },
  {
    selector: ".globe-canvas",
    position: "center",
    content: "This is the Earth, your home world. Try moving your mouse to rotate and zoom to explore countries.\n It also works with pinching and moving your finger on mobile and tablet!",
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
    content: "Quest complete, adventurer! Click ✖ and continue thy quest.",
  },
];
