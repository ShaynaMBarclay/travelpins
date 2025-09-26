import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import storyblok from "../Components/storyblok";

function CountryPage() {
  const { countrySlug } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    storyblok
      .get(`cdn/stories/${countrySlug}`, { version: "draft" })
      .then((res) => setStory(res.data.story))
      .catch(console.error);
  }, [countrySlug]);

  if (!story) return <p>Loading...</p>;

  const countryName = story.name;

  // Hardcode the buttons so they always show
  const chapters = [
    { name: "Views", slug: "views" },
    { name: "Food", slug: "food" },
    { name: "Activities", slug: "activities" },
  ];

  return (
    <div className="country-page">
      <h1>{countryName}</h1>

      <div className="book">
        {/* Left page with chapter buttons */}
        <div className="page">
          <h2>Chapters</h2>
          <div className="chapter-list">
            {chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                to={`/country/${countrySlug}/${chapter.slug}`}
              >
                <button>{chapter.name}</button>
              </Link>
            ))}
          </div>
        </div>

        {/* Spine */}
        <div className="spine"></div>

        {/* Right page preview */}
        <div className="page">
          <p>Click a chapter on the left to read more.</p>
        </div>
      </div>
    </div>
  );
}

export default CountryPage;
