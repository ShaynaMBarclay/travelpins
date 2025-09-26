import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import storyblok from "../Components/storyblok";

function ChapterPage() {
  const { countrySlug, chapterSlug } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    storyblok
      .get(`cdn/stories/${countrySlug}`, { version: "published" })
      .then((res) => {
        console.log("Full Storyblok response:", res);
        setStory(res.data.story);
      })
      .catch(console.error);
  }, [countrySlug]);

  if (!story) return <p>Loading...</p>;

  const countryName = story.name;

  // Find the nested block that matches the chapterSlug
  const chapterBlock = story.content?.body?.find(
    (block) => block.component.toLowerCase() === chapterSlug.toLowerCase()
  );

  console.log("Chapter block:", chapterBlock);

  // Use items if present, otherwise treat the block itself as the entry
  const entries =
    chapterBlock?.items?.length > 0
      ? chapterBlock.items
      : chapterBlock
      ? [chapterBlock]
      : [];

  return (
    <div className="country-page chapter-page">
      <h1>{countryName}</h1>

      <div className="book">
        {/* Left page: blank */}
        <div className="page"></div>

        {/* Spine */}
        <div className="spine"></div>

        {/* Right page: chapter content */}
        <div className="page">
          <h2>{chapterSlug.charAt(0).toUpperCase() + chapterSlug.slice(1)}</h2>

          {entries.length > 0 ? (
            entries.map((entry) => {
              // Handle single image or array of images
              let imageUrl = null;
              let imageAlt = entry.title;

              if (entry.image) {
                if (Array.isArray(entry.image) && entry.image.length > 0) {
                  imageUrl = entry.image[0].filename;
                  imageAlt = entry.image[0].alt || entry.title;
                } else if (entry.image.filename) {
                  imageUrl = entry.image.filename;
                  imageAlt = entry.image.alt || entry.title;
                } else {
                  imageUrl = entry.image;
                }
              }

              return (
                <div key={entry._uid} className="item-card">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={imageAlt}
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  )}
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
              );
            })
          ) : (
            <p>No content in this chapter yet.</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to={`/country/${countrySlug}`}>← Back to {countryName}</Link>
      </div>
    </div>
  );
}

export default ChapterPage;
