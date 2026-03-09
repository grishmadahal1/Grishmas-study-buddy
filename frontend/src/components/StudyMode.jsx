import { useState } from "react";
import { useStudySession } from "../hooks/useStudySession";
import ExplainModal from "./ExplainModal";
import "./StudyMode.css";

export default function StudyMode({ cards }) {
  const {
    currentIndex,
    score,
    flipped,
    completed,
    prev,
    markCorrect,
    markWrong,
    restart,
    toggleFlip,
  } = useStudySession(cards.length);
  const [explainCard, setExplainCard] = useState(null);

  const progress = ((currentIndex + (completed ? 1 : 0)) / cards.length) * 100;
  const card = cards[currentIndex];

  if (completed) {
    return (
      <div className="study-completed">
        <h2>Session Complete</h2>
        <div className="final-score">
          <span className="score-number">{score}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{cards.length}</span>
        </div>
        <p className="score-label">cards correct</p>
        <button className="btn-primary" onClick={restart}>
          Study Again
        </button>
      </div>
    );
  }

  function handleExplainClick(e) {
    e.stopPropagation();
    setExplainCard({ question: card.question, answer: card.answer });
  }

  return (
    <div className="study-mode">
      <div className="study-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-info">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="score-tracker">
            {score} correct
          </span>
        </div>
      </div>

      <div className="study-card-wrapper" onClick={toggleFlip}>
        <div className={`study-card ${flipped ? "flipped" : ""}`}>
          <div className="study-card-face study-card-front">
            <span className="card-label">Question</span>
            <p>{card.question}</p>
            <span className="flip-hint">Click to reveal answer</span>
          </div>
          <div className="study-card-face study-card-back">
            <span className="card-label card-label--answer">Answer</span>
            <p>{card.answer}</p>
            <button className="btn-explain" onClick={handleExplainClick}>
              Explain this
            </button>
          </div>
        </div>
      </div>

      <div className="study-controls">
        <button className="btn-nav" onClick={prev} disabled={currentIndex === 0}>
          &larr; Back
        </button>
        <div className="study-actions">
          <button className="btn-wrong" onClick={markWrong}>
            Try again &#8634;
          </button>
          <button className="btn-correct" onClick={markCorrect}>
            Got it &#10003;
          </button>
        </div>
      </div>

      {explainCard && (
        <ExplainModal
          question={explainCard.question}
          answer={explainCard.answer}
          onClose={() => setExplainCard(null)}
        />
      )}
    </div>
  );
}
