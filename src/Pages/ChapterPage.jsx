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

   console.log("Story content body:", story.content?.body);

  // Find the nested block that matches the chapterSlug
  const chapterBlock = story.content?.body?.find(
    (block) => block.component.toLowerCase() === chapterSlug.toLowerCase()
  );

  console.log("Chapter block:", chapterBlock);

  // Get the entries inside that block
  const entries = chapterBlock?.items || []; // Make sure "items" is the field name in Storyblok
  return (
    <div className="country-page chapter-page">
      <h1>{countryName}</h1>

      <div className="book">
        <div className="page"></div>

        {/* Spine */}
        <div className="spine"></div>

        {/* Right page: chapter content */}
        <div className="page">
          <h2>{chapterSlug.charAt(0).toUpperCase() + chapterSlug.slice(1)}</h2>

          {entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry._uid} className="item-card">
                {entry.image && <img src={entry.image.filename} alt={entry.title} />}
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </div>
            ))
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
