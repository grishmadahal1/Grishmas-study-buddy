import { useState, useRef } from "react";
import "./InputSection.css";

export default function InputSection({ onGenerateText, onGeneratePDF, loading }) {
  const [text, setText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim()) {
      onGenerateText(text.trim());
    }
  }

  function handleFile(file) {
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      onGeneratePDF(file);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave() {
    setDragActive(false);
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    handleFile(file);
  }

  return (
    <section className="input-section">
      <div className="input-header">
        <h1>FlashGen</h1>
        <p>Paste your notes or upload a PDF to generate study flashcards with AI.</p>
      </div>

      <form onSubmit={handleSubmit} className="text-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your notes, article, or study material here..."
          rows={8}
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
          {loading ? (
            <span className="spinner-wrapper">
              <span className="spinner" />
              Generating...
            </span>
          ) : (
            "Generate Flashcards"
          )}
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <div
        className={`drop-zone ${dragActive ? "drag-active" : ""} ${loading ? "disabled" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          hidden
        />
        {fileName ? (
          <p className="file-name">{fileName}</p>
        ) : (
          <>
            <div className="drop-icon">PDF</div>
            <p>Drag & drop a PDF here, or click to browse</p>
          </>
        )}
      </div>
    </section>
  );
}
