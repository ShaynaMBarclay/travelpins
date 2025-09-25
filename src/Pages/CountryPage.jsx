import { useState } from "react";
import { Link } from "react-router-dom";

function CountryPage() {
  const countryName = "France";

  const chapters = [
    { name: "Food", slug: "food" },
    { name: "Activities", slug: "activities" },
    { name: "Views", slug: "views" },
  ];

  return (
    <div className="country-page">
      <h1>{countryName}</h1>

      <div className="book">
        {/* Left page with chapters */}
        <div className="page">
          <h2>Chapters</h2>
          <div className="chapter-list">
            {chapters.map((chapter, index) => (
              <Link key={index} to={`/country/${countryName.toLowerCase()}/${chapter.slug}`}>
                <button>{chapter.name}</button>
              </Link>
            ))}
          </div>
        </div>

        <div className="spine"></div>

        {/* Right page as preview / blank */}
        <div className="page">
          <p>Click a chapter on the left to read more.</p>
        </div>
      </div>
    </div>
  );
}

export default CountryPage;
