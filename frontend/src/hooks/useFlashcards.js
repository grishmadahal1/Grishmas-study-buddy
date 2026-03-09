import { useState, useCallback } from "react";
import { generateFlashcards, uploadPDF } from "../services/api";

export function useFlashcards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateFromText = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateFlashcards(text);
      setCards(result);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFromPDF = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadPDF(file);
      setCards(result);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCards([]);
    setError(null);
  }, []);

  return { cards, setCards, loading, error, generateFromText, generateFromPDF, reset };
}
