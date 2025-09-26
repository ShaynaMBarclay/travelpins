import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import storyblok from "../Components/storyblok";

function ChapterPage() {
  const { countrySlug, chapterSlug } = useParams();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Track which images are loaded for the current page
  const [imagesLoaded, setImagesLoaded] = useState({}); // key = entry._uid

  useEffect(() => {
    storyblok
      .get(`cdn/stories/${countrySlug}`, { version: "published" })
      .then((res) => setStory(res.data.story))
      .catch(console.error);
  }, [countrySlug]);

  // Reset loaded images when switching pages
  useEffect(() => {
    setImagesLoaded({});
  }, [currentPage]);

  if (!story) return <p>Loading...</p>;

  const countryName = story.name;

  const chapterBlocks =
    story.content?.body?.filter(
      (block) => block.component.toLowerCase() === chapterSlug.toLowerCase()
    ) || [];

  const entries = chapterBlocks.flatMap((block) => block.items || []);
  const totalPages = Math.ceil(entries.length / 2);

  const leftEntry = entries[currentPage * 2];
  const rightEntry = entries[currentPage * 2 + 1];

  const getImageUrl = (entry) => {
    if (!entry || !entry.image) return null;
    if (Array.isArray(entry.image) && entry.image.length > 0)
      return entry.image[0].filename || entry.image[0].url;
    if (entry.image.filename) return entry.image.filename || entry.image.url;
    return entry.image;
  };

  const handleImageLoad = (uid) => {
    setImagesLoaded((prev) => ({ ...prev, [uid]: true }));
  };

  const renderEntry = (entry, index) => {
    if (!entry) return null;
    const imageUrl = getImageUrl(entry);
    const imageAlt = entry.title || "";
    const isLoaded = imagesLoaded[entry._uid];

    return (
      <div
        key={`${entry._uid}-${currentPage}`} // force re-animation on page change
        className="item-card fade-in"
        style={{ animationDelay: `${index * 0.2}s` }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt}
            className={isLoaded ? "fade-in-image" : "hidden-image"}
            onLoad={() => handleImageLoad(entry._uid)}
          />
        )}
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
      </div>
    );
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="country-page chapter-page">
      <h1>{countryName}</h1>

      <div className="book">
        {/* Left page */}
        <div className="page">
          <h2>{chapterSlug.charAt(0).toUpperCase() + chapterSlug.slice(1)}</h2>
          {renderEntry(leftEntry, 0)}
        </div>

        {/* Spine */}
        <div className="spine"></div>

        {/* Right page */}
        <div className="page">{renderEntry(rightEntry, 1)}</div>
      </div>

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

      <div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  }}
>
  {/* Back to country page */}
  <Link to={`/country/${countrySlug}`} className="navigation-link">
    ← Back to {countryName}
  </Link>
</div>
    </div>
  );
}

export default ChapterPage;
