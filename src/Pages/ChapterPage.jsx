import { useParams, Link } from "react-router-dom";

function ChapterPage() {
  const { countrySlug, chapterSlug } = useParams();

  // Placeholder content
  const contentData = {
    food: [
      { title: "Croissant", description: "Flaky pastry", image: "/images/croissant.jpg" },
      { title: "Baguette", description: "Classic French bread", image: "/images/baguette.jpg" },
    ],
    activities: [
      { title: "Eiffel Tower", description: "Visit the iconic tower", image: "/images/eiffel.jpg" },
    ],
    views: [
      { title: "Mont Saint-Michel", description: "Beautiful island view", image: "/images/mont.jpg" },
    ],
  };

  const items = contentData[chapterSlug] || [];

  return (
    <div className="country-page">
      <h1>{countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1)} - {chapterSlug.charAt(0).toUpperCase() + chapterSlug.slice(1)}</h1>
      <Link to={`/country/${countrySlug}`}>← Back to Book</Link>
      <div className="book">
        <div className="page">
          {items.map((item, index) => (
            <div className="item-card" key={index}>
              <h2>{item.title}</h2>
              <img src={item.image} alt={item.title} />
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChapterPage;
