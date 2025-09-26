import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import storyblok from "../Components/storyblok";
import { db, storage } from "../Helpers/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import BookAnimationOverlay from "../Components/BookAnimationOverlay";

function CountryPage() {
  const { countrySlug } = useParams();
  const [story, setStory] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const [chapter, setChapter] = useState("views");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    storyblok
      .get(`cdn/stories/${countrySlug}`, { version: "draft" })
      .then((res) => setStory(res.data.story))
      .catch(console.error);
  }, [countrySlug]);

  if (!story) return <p>Loading...</p>;

  const countryName = story.name;

  const chapters = [
    { name: "Views", slug: "views" },
    { name: "Food", slug: "food" },
    { name: "Activities", slug: "activities" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";
    if (file) {
      const storageRef = ref(
        storage,
        `submissions/${countrySlug}/${chapter}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "submissions"), {
      country: countrySlug,
      chapter,
      title,
      description,
      image: imageUrl,
      timestamp: serverTimestamp(),
    });

    setSubmitted(true);
    setChapter("views");
    setTitle("");
    setDescription("");
    setFile(null);

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="country-page">
      <div className="book-wrapper">
        {overlayVisible && (
          <BookAnimationOverlay
            title={countryName}
            onFinish={() => setOverlayVisible(false)}
          />
        )}

        {!overlayVisible && (
          <div data-tour="country-book" className="book book-opening">
            <div className="page left-page">
              <h2>Chapters</h2>
              <div className="chapter-list">
                {chapters.map((chapterBtn) => (
                  <Link
                    key={chapterBtn.slug}
                    to={`/country/${countrySlug}/${chapterBtn.slug}`}
                    data-tour={chapterBtn.slug === "food" ? "chapter-food" : undefined}
                  >
                    <button>{chapterBtn.name}</button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="spine"></div>

            <div className="page right-page">
              <h2>Submit Your Entry</h2>
              <form onSubmit={handleSubmit} className="submission-form book-style">
                <label>
                  Chapter:
                  <select
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                  >
                    <option value="views">Views</option>
                    <option value="food">Food</option>
                    <option value="activities">Activities</option>
                  </select>
                </label>

                <label>
                  Title:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Description:
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </label>

                {/* Custom file input button */}
                <label className="custom-file-button">
                  {file ? "Change File" : "Add Image"}
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="image/*"
                  />
                </label>
                {file && <span className="file-name">{file.name}</span>}

                <button type="submit">Submit</button>
                {submitted && <p className="success-message">Submission sent!</p>}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Back to Globe button at the bottom */}
      <div style={{ marginTop: "30px", marginBottom: "50px" }}>
        <Link to="/" className="navigation-link">
          🌐 Back to Globe
        </Link>
      </div>
    </div>
  );
}

export default CountryPage;
