import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import storyblok from "../Components/storyblok";
import { db, storage } from "../Helpers/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import BookAnimationOverlay from "../Components/BookAnimationOverlay";
import { useLoading } from "../Components/LoadingContext.jsx";

function CountryPage() {
  const { countrySlug } = useParams();
  const [story, setStory] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const [chapter, setChapter] = useState("views");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [funFacts, setFunFacts] = useState([]);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [factsError, setFactsError] = useState("");

  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const res = await storyblok.get(`cdn/stories/${countrySlug}`, { version: "draft" });
        setStory(res.data.story);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStory();
  }, [countrySlug, setLoading]);

  if (!story) return null;

  const countryName = story.name;

  const chapters = [
    { name: "❗ Wonders", slug: "Wonders" },
    { name: "❗ Feasts", slug: "feasts" },
    { name: "❗ Quests", slug: "Quests" },
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
    setChapter("wonders");
    setTitle("");
    setDescription("");
    setFile(null);

    setTimeout(() => setSubmitted(false), 3000);
  };

  const fetchFunFacts = async () => {
    setLoadingFacts(true);
    setFactsError("");
    setFunFacts([]);

    try {
      const res = await fetch(
        `https://travelpinsserver.onrender.com/api/fun-facts?country=${countryName}`
      );
      const data = await res.json();

      if (res.ok) {
        const factsArray = data.facts.split(/\n/).filter(Boolean);
        setFunFacts(factsArray);
      } else {
        setFactsError(data.error || "Failed to fetch fun facts");
      }
    } catch (err) {
      console.error(err);
      setFactsError("Failed to fetch fun facts");
    }

    setLoadingFacts(false);
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

              <div style={{ marginTop: "20px" }}>
                <button
                  className="ai-button"
                  onClick={fetchFunFacts}
                  disabled={loadingFacts}
                >
                  {loadingFacts ? "Rolling the dice..." : `Roll for Facts about ${countryName}`}
                </button>

                {factsError && <p style={{ color: "red" }}>{factsError}</p>}

                {funFacts.length > 0 && (
                  <div className="ai-response">
                    <ul>
                      {funFacts.map((fact, index) => (
                        <li key={index}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="spine"></div>

            <div className="page right-page">
              <h2>Mark Your Journey</h2>
              <form onSubmit={handleSubmit} className="submission-form book-style">
                <label>
                  Chapter:
                  <select
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                  >
                    <option value="Wonders">Wonders</option>
                    <option value="Feasts">Feasts</option>
                    <option value="Quests">Quests</option>
                  </select>
                </label>

                <label>
                  Tale Entry:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Share thy quest with the realm:
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </label>

                <label className="custom-file-button">
                  {file ? "Change File" : "Attach Illustration"}
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="image/*"
                  />
                </label>
                {file && <span className="file-name">{file.name}</span>}

                <button type="Send Forth">Deliver</button>
                {submitted && <p className="success-message">Thy Deed Hath Been Recorded!</p>}
              </form>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: "30px", marginBottom: "50px" }}>
        <Link to="/" className="navigation-link">
          🌐 Back to the Map
        </Link>
      </div>
    </div>
  );
}

export default CountryPage;
