import { Link } from "react-router-dom";

function Placeholder() {
  return (
    <div>
      <h1>Globe coming soon!</h1>
      <ul>
        <li><Link to="/country/france">France</Link></li>
        <li><Link to="/country/japan">Japan</Link></li>
      </ul>
    </div>
  );
}

export default Placeholder;
