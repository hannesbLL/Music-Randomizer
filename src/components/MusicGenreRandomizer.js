import { useState } from "react";
import { motion } from "framer-motion";
import exampleSongs from "../assets/exampleSongs.json";
import "../styles.css";

export default function MusicGenreRandomizer() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [exampleTracks, setExampleTracks] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [audioPlayers, setAudioPlayers] = useState({});

  const spinWheel = () => {
    stopAllAudio();
    setIsSpinning(true);
    setTimeout(() => {
      const genres = Object.keys(exampleSongs);
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      setSelectedGenre(randomGenre.replace(/_/g, " ").toUpperCase());
      setExampleTracks(exampleSongs[randomGenre].slice(0, 5).map(file => `https://user-uploads.perchance.org/file/${file}`));
      setIsSpinning(false);
    }, 2000);
  };

  const togglePlay = (url) => {
    stopAllAudio();
    if (audioPlayers[url]) {
      audioPlayers[url].pause();
      audioPlayers[url].currentTime = 0;
      setAudioPlayers(prev => ({ ...prev, [url]: null }));
    } else {
      const audio = new Audio(url);
      audio.play();
      setAudioPlayers(prev => ({ ...prev, [url]: audio }));
    }
  };

  const stopAllAudio = () => {
    Object.values(audioPlayers).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setAudioPlayers({});
  };

  return (
    <div className="app-container">
      <motion.img
        src="https://i.imgur.com/0kFGUkF.png"
        alt="Music Wheel"
        className="wheel-small logo-drop-shadow"
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={{ duration: 2, repeat: isSpinning ? Infinity : 0, ease: "easeInOut" }}
      />

      <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? "FETCHING GENRE..." : "SPIN THE WHEEL"}
      </button>

      {selectedGenre && (
        <div className="genre-box">
          <h2 className="genre-text">{selectedGenre}</h2>
          <div className="play-buttons play-buttons-enhanced spaced-buttons">
            {exampleTracks.map((url, index) => (
              <button key={index} className="play-button enhanced-button" onClick={() => togglePlay(url)}>
                {audioPlayers[url] ? "⏸️" : "▶️"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}