import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import storyblok from "../Components/storyblok";

function ChapterPage() {
  const { countrySlug, chapterSlug } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    storyblok
      .get(`cdn/stories/${countrySlug}`, { version: "draft" })
      .then((res) => setStory(res.data.story))
      .catch(console.error);
  }, [countrySlug]);

  if (!story) return <p>Loading...</p>;

  const countryName = story.name;

  // Get the content for the selected chapter
  const selectedChapter = story.content.chapters?.find(
    (c) => c.slug === chapterSlug
  );

  const entries = selectedChapter?.entries || [];

  return (
    <div className="country-page chapter-page">
      <h1>{countryName}</h1>

      <div className="book">
        {/* Left page: blank or spine-only */}
        <div className="page">
          {/* Optionally: you can show chapter title or a small note */}
        </div>

        {/* Spine */}
        <div className="spine"></div>

        {/* Right page: chapter content */}
        <div className="page">
          <h2>{chapterSlug.charAt(0).toUpperCase() + chapterSlug.slice(1)}</h2>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry._uid} className="item-card">
                {entry.image && <img src={entry.image} alt={entry.title} />}
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
