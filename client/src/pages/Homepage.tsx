import { useCookies } from "react-cookie";
import "../styles/pages/Homepage.scss";
function Homepage() {
  return (
    <div className="homepage">
      <h2 className="hero-title">Joke App</h2>
      <p className="hero-text">
        Get a joke delivered straight to your inbox! Sign up now and receive a
        fresh, hilarious joke every time you click the button. It's the perfect
        way to brighten up your day and share a laugh with friends. Join our
        community of joke lovers and get ready to LOL!
      </p>
    </div>
  );
}

export default Homepage;
