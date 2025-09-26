import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import storyblok from "../Components/storyblok";

function ChapterPage() {
  const { countrySlug, chapterSlug } = useParams();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // will increment by 2 for left/right pages

  useEffect(() => {
    storyblok
      .get(`cdn/stories/${countrySlug}`, { version: "published" })
      .then((res) => setStory(res.data.story))
      .catch(console.error);
  }, [countrySlug]);

  if (!story) return <p>Loading...</p>;

  const countryName = story.name;

  // Filter blocks that match the chapterSlug
  const chapterBlocks =
    story.content?.body?.filter(
      (block) => block.component.toLowerCase() === chapterSlug.toLowerCase()
    ) || [];

  // Flatten all items
  const entries = chapterBlocks.flatMap((block) => block.items || []);

  const totalPages = Math.ceil(entries.length / 2); // 2 entries per spread

  const leftEntry = entries[currentPage * 2];
  const rightEntry = entries[currentPage * 2 + 1];

  const getImageUrl = (entry) => {
    if (!entry || !entry.image) return null;
    if (Array.isArray(entry.image) && entry.image.length > 0) return entry.image[0].filename || entry.image[0].url;
    if (entry.image.filename) return entry.image.filename || entry.image.url;
    return entry.image;
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const renderEntry = (entry) => {
    if (!entry) return null;
    const imageUrl = getImageUrl(entry);
    const imageAlt = entry.title || "";
    return (
      <div className="item-card">
        {imageUrl && <img src={imageUrl} alt={imageAlt} />}
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
      </div>
    );
  };

  return (
    <div className="country-page chapter-page">
      <h1>{countryName}</h1>

      <div className="book">
        {/* Left page */}
        <div className="page">
          <h2>{chapterSlug.charAt(0).toUpperCase() + chapterSlug.slice(1)}</h2>
          {renderEntry(leftEntry)}
        </div>

        {/* Spine */}
        <div className="spine"></div>

        {/* Right page */}
        <div className="page">
          {renderEntry(rightEntry)}
        </div>
      </div>

      {/* Navigation arrows below the book */}
      <div className="book-navigation">
        <button onClick={prevPage} disabled={currentPage === 0}>
          ← Previous
        </button>
        <span>
          Page {currentPage + 1} / {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages - 1}>
          Next →
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to={`/country/${countrySlug}`}>← Back to {countryName}</Link>
      </div>
    </div>
  );
}

export default ChapterPage;
