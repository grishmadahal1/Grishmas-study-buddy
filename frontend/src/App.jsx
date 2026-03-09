import { useState } from "react";
import { useFlashcards } from "./hooks/useFlashcards";
import { fetchSession, saveSession } from "./services/api";
import InputSection from "./components/InputSection";
import FlashcardDeck from "./components/FlashcardDeck";
import StudyMode from "./components/StudyMode";
import SessionList from "./components/SessionList";
import "./App.css";

const VIEWS = {
  SESSIONS: "sessions",
  INPUT: "input",
  DECK: "deck",
  STUDY: "study",
};

export default function App() {
  const { cards, loading, error, generateFromText, generateFromPDF, reset, setCards } =
    useFlashcards();
  const [view, setView] = useState(VIEWS.SESSIONS);
  const [saved, setSaved] = useState(false);

  async function handleGenerate(text) {
    setSaved(false);
    const success = await generateFromText(text);
    if (success) setView(VIEWS.DECK);
  }

  async function handlePDF(file) {
    setSaved(false);
    const success = await generateFromPDF(file);
    if (success) setView(VIEWS.DECK);
  }

  function handleReset() {
    reset();
    setSaved(false);
    setView(VIEWS.INPUT);
  }

  async function handleSave() {
    if (saved || cards.length === 0) return;
    try {
      await saveSession("", cards);
      setSaved(true);
    } catch {
      // ignore
    }
  }

  async function handleLoadSession(id) {
    try {
      const session = await fetchSession(id);
      setCards(session.cards);
      setSaved(true);
      setView(VIEWS.DECK);
    } catch {
      // ignore
    }
  }

  const showDeck = view === VIEWS.DECK && cards.length > 0;
  const showStudy = view === VIEWS.STUDY && cards.length > 0;

  return (
    <div className="app">
      {(view === VIEWS.DECK || view === VIEWS.STUDY) && (
        <header className="app-header">
          <button className="btn-ghost" onClick={handleReset}>
            &larr; New Session
          </button>
          <div className="header-right">
            {cards.length > 0 && !saved && (
              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
            )}
            {saved && <span className="save-badge">Saved</span>}
            {cards.length > 0 && (
              <span className="card-badge">{cards.length} cards</span>
            )}
            {view === VIEWS.DECK && (
              <button
                className="btn-ghost"
                onClick={() => setView(VIEWS.STUDY)}
              >
                Study Mode
              </button>
            )}
            {view === VIEWS.STUDY && (
              <button
                className="btn-ghost"
                onClick={() => setView(VIEWS.DECK)}
              >
                View All
              </button>
            )}
          </div>
        </header>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={handleReset}>Dismiss</button>
        </div>
      )}

      {view === VIEWS.SESSIONS && (
        <SessionList
          onLoadSession={handleLoadSession}
          onNewSession={() => setView(VIEWS.INPUT)}
        />
      )}

      {view === VIEWS.INPUT && (
        <>
          <div className="back-link-wrapper">
            <button className="btn-back-link" onClick={() => setView(VIEWS.SESSIONS)}>
              &larr; Back to sessions
            </button>
          </div>
          <InputSection
            onGenerateText={handleGenerate}
            onGeneratePDF={handlePDF}
            loading={loading}
          />
        </>
      )}

      {loading && view !== VIEWS.INPUT && (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      )}

      {showDeck && <FlashcardDeck cards={cards} />}
      {showStudy && <StudyMode cards={cards} />}
    </div>
  );
}
