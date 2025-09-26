import StoryblokClient from "storyblok-js-client";

const storyblok = new StoryblokClient({
  accessToken: import.meta.env.VITE_STORYBLOK_TOKEN,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

export default storyblok;
