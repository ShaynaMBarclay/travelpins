import { useLoading } from "../Components/LoadingContext";

export default function GlobalSpinner() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Fetching your tale...</p>
      </div>
    </div>
  );
}
