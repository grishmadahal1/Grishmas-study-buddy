import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { explainCard } from "../services/api";
import "./ExplainModal.css";

export default function ExplainModal({ question, answer, onClose }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await explainCard(question, answer);
        if (!cancelled) setExplanation(result);
      } catch {
        if (!cancelled) setExplanation("Sorry, couldn't generate an explanation right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [question, answer]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="explain-overlay" onClick={onClose}>
      <div className="explain-modal" onClick={(e) => e.stopPropagation()}>
        <div className="explain-modal-header">
          <div>
            <span className="explain-modal-label">Explanation</span>
            <p className="explain-modal-question">{question}</p>
          </div>
          <button className="explain-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="explain-modal-answer">
          <span className="explain-modal-label explain-modal-label--answer">Answer</span>
          <p>{answer}</p>
        </div>

        <div className="explain-modal-divider" />

        <div className="explain-modal-body">
          {loading ? (
            <div className="explain-loading">
              <span className="explain-dot" />
              <span className="explain-dot" />
              <span className="explain-dot" />
            </div>
          ) : (
            <div className="explain-markdown">
              <Markdown>{explanation}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
