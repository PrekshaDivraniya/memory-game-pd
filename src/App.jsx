import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);

  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);

  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [maxMoves, setMaxMoves] = useState(0);

  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleGridSize = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 2 && parseInt(value) <= 10)) {
      setGridSize(value === "" ? "" : parseInt(value));
    }
  };

  const handleMoves = (e) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setMaxMoves(value === "" ? "" : parseInt(value));
    }
  };

  const initializeGame = () => {
    setMoves(0);
    setGameOver(false);
    const totalSize = gridSize * gridSize; //16

    const pairCount = Math.floor(totalSize / 2); //8

    const numbers = [
      ...Array(pairCount)
        .keys()
        .map((n) => n + 1),
    ];
    const shuffleCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalSize)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffleCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };
  const handleClick = (id) => {
    if (isSolved(id) || flipped.includes(id)) return; // Prevent clicking solved cards
    if (disabled || won) return;

    if (moves >= maxMoves) {
      setGameOver(true);
      return;
    }
    setMoves((p) => p + 1);
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);

        //logic for match
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);

  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf3dd]">
      {/* input */}

      <h1 className="text-3xl font-bold mb-10 text-purple-500">Memory Game</h1>

      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid Size:(max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize || ""}
          onChange={handleGridSize}
          onBlur={() => {
            if (gridSize === "" || isNaN(gridSize)) setGridSize(4); // Default
          }}
          className="border-2 border-gray-300 rounded px-2 py-1"
        />

        <label htmlFor="maxMoves" className="mr-2 ml-2">
          Max Moves:(0 to unlimited)
        </label>
        <input
          type="number"
          id="maxMoves"
          min="0"
          max="1000"
          value={maxMoves || ""}
          onChange={handleMoves}
          onBlur={() => {
            if (maxMoves === "" || isNaN(maxMoves)) setMaxMoves(0); // Default to unlimited
          }}
          className="border-2 border-gray-300 rounded px-2 py-1"
        />
      </div>

      <p className="mb-3 text-xl font-medium text-pink-500">
        Moves : {moves}/{maxMoves}
      </p>
      {/* Game board */}
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: `min(100% , ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!!
        </div>
      )}
      {gameOver && (
        <div className="mt-4 text-4xl font-bold text-red-600 animate-bounce">
          Game Over!!
        </div>
      )}

      {/* Restart */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}

export default App;
