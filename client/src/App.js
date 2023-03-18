import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [characters, setCharacters] = useState([]);

  async function getCharacters() {
    try {
      const response = await axios.get("https://localhost:5001/Character");
      setCharacters(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundImage: "url('https://wallpaper.dog/large/902567.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto">
        <h1
          style={{
            color: "white",
            textShadow: "2px 2px black",
            fontSize: "3rem",
            marginBottom: "2rem",
          }}
          className="text-center"
        >
          Attack on Titan Characters
        </h1>
        <div className="row">
          {characters.map((character, index) => (
            <div
              key={index}
              className="col-sm-12 col-md-6 col-lg-4 cardWrapper"
            >
              <div
                className="card mb-5 text-center"
                style={{
                  width: "18rem",
                }}
              >
                <img
                  src={character.imageUrl}
                  className="card-img-top"
                  alt="AOT Character"
                />
                <div className="card-body">
                  <h5 className="card-title">{character.name}</h5>

                  <button className="btn btn-primary">
                    <a
                      style={{
                        color: "white",
                        textDecoration: "none",
                      }}
                      href={character.descriptionUrl}
                    >
                      Learn More
                    </a>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
