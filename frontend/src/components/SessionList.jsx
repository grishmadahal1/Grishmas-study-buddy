import { useState, useEffect } from "react";
import { fetchSessions, deleteSession } from "../services/api";
import "./SessionList.css";

export default function SessionList({ onLoadSession, onNewSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      setLoading(true);
      const data = await fetchSessions();
      setSessions(data);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="session-list">
      <div className="session-list-header">
        <div>
          <h2>Your Sessions</h2>
          <p>Pick up where you left off, or start fresh.</p>
        </div>
        <button className="btn-primary" onClick={onNewSession}>
          New Session
        </button>
      </div>

      {loading && (
        <div className="session-loading">Loading sessions...</div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="session-empty">
          <p className="empty-title">No saved sessions yet</p>
          <p className="empty-sub">
            Generate some flashcards and save them to see them here.
          </p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="session-cards">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="session-card"
              onClick={() => onLoadSession(session.id)}
            >
              <div className="session-card-body">
                <h3>{session.title}</h3>
                <div className="session-meta">
                  <span className="session-count">
                    {session.cardCount} cards
                  </span>
                  <span className="session-date">
                    {formatDate(session.createdAt)}
                  </span>
                </div>
              </div>
              <button
                className="session-delete"
                onClick={(e) => handleDelete(e, session.id)}
                title="Delete session"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
