import { useState } from "react";
import ExplainModal from "./ExplainModal";
import "./FlashcardDeck.css";

function Flashcard({ question, answer, index, onExplain }) {
  const [flipped, setFlipped] = useState(false);

  function handleExplainClick(e) {
    e.stopPropagation();
    onExplain({ question, answer });
  }

  return (
    <div
      className="flashcard-container"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>
        <div className="flashcard-face flashcard-front">
          <span className="card-label">Question</span>
          <p>{question}</p>
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="card-label card-label--answer">Answer</span>
          <p>{answer}</p>
          <button className="btn-explain" onClick={handleExplainClick}>
            Explain this
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardDeck({ cards }) {
  const [explainCard, setExplainCard] = useState(null);

  return (
    <>
      <div className="deck-grid">
        {cards.map((card, i) => (
          <Flashcard
            key={i}
            question={card.question}
            answer={card.answer}
            index={i}
            onExplain={setExplainCard}
          />
        ))}
      </div>
      {explainCard && (
        <ExplainModal
          question={explainCard.question}
          answer={explainCard.answer}
          onClose={() => setExplainCard(null)}
        />
      )}
    </>
  );
}
