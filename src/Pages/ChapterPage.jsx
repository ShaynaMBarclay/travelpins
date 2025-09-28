import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import storyblok from "../Components/storyblok";
import { useLoading } from "../Components/LoadingContext.jsx";
import GlobalSpinner from "../Components/GlobalSpinner";

function ChapterPage() {
  const { countrySlug, chapterSlug } = useParams();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayClass, setOverlayClass] = useState("book-closed-overlay");

  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const res = await storyblok.get(`cdn/stories/${countrySlug}`, { version: "published" });
        setStory(res.data.story);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStory();

    setShowOverlay(true);
    setOverlayClass("book-closed-overlay");

    const timer = setTimeout(() => {
      setOverlayClass("book-closed-overlay opening");
    }, 800);

    const revealBook = setTimeout(() => {
      setShowOverlay(false);
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(revealBook);
    };
  }, [countrySlug, chapterSlug, setLoading]);

  useEffect(() => {
    setImagesLoaded({});
  }, [currentPage]);

  if (!story) return null;

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
        key={`${entry._uid}-${currentPage}`}
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
      <GlobalSpinner />
      {showOverlay && (
        <div className={overlayClass}>
          <div className="book-closed-spine"></div>
          <div className="book-closed-front">{chapterSlug.toUpperCase()}</div>
        </div>
      )}

      {!showOverlay && (
        <>
          <div className="book-wrapper">
            <div data-tour="chapter-book" className="book book-opening">
              <div className="page left-page">
                {renderEntry(leftEntry, 0)}
              </div>

              <div className="spine"></div>

              <div className="page right-page">{renderEntry(rightEntry, 1)}</div>
            </div>
          </div>

          <div className="book-navigation">
            <button onClick={prevPage} disabled={currentPage === 0}>
              ← Prior Tale
            </button>
            <span>
              Page {currentPage + 1} / {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages - 1}>
              Turn the Page →
            </button>
          </div>

          <div
            style={{
              marginTop: "20px",
              marginBottom: "5rem",
              display: "flex",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <Link to={`/country/${countrySlug}`} className="navigation-link">
              ← return to {countryName}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default ChapterPage;
