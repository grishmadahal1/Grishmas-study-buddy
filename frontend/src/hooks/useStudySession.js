import { useState, useCallback } from "react";

export function useStudySession(totalCards) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const next = useCallback(() => {
    setFlipped(false);
    if (currentIndex >= totalCards - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, totalCards]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const markCorrect = useCallback(() => {
    setScore((s) => s + 1);
    next();
  }, [next]);

  const markWrong = useCallback(() => {
    next();
  }, [next]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setFlipped(false);
    setCompleted(false);
  }, []);

  const toggleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  return {
    currentIndex,
    score,
    flipped,
    completed,
    next,
    prev,
    markCorrect,
    markWrong,
    restart,
    toggleFlip,
  };
}
