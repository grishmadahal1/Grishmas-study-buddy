import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FlashcardDeck from "../components/FlashcardDeck";

// Mock ExplainModal to avoid its side effects
vi.mock("../components/ExplainModal", () => ({
  default: ({ question, onClose }) => (
    <div data-testid="explain-modal">
      <span>{question}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("FlashcardDeck", () => {
  const cards = [
    { question: "What is React?", answer: "A UI library" },
    { question: "What is JSX?", answer: "Syntax extension for JS" },
  ];

  it("should render all cards", () => {
    render(<FlashcardDeck cards={cards} />);

    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText("What is JSX?")).toBeInTheDocument();
  });

  it("should flip card on click", async () => {
    const user = userEvent.setup();
    render(<FlashcardDeck cards={cards} />);

    const containers = document.querySelectorAll(".flashcard-container");
    await user.click(containers[0]);

    expect(containers[0].querySelector(".flashcard")).toHaveClass("flipped");
  });

  it("should show Explain this button on back face", () => {
    render(<FlashcardDeck cards={cards} />);

    const explainButtons = screen.getAllByText("Explain this");
    expect(explainButtons).toHaveLength(2);
  });

  it("should open ExplainModal when Explain this is clicked", async () => {
    const user = userEvent.setup();
    render(<FlashcardDeck cards={cards} />);

    const explainButtons = screen.getAllByText("Explain this");
    await user.click(explainButtons[0]);

    expect(screen.getByTestId("explain-modal")).toBeInTheDocument();
  });

  it("should close ExplainModal", async () => {
    const user = userEvent.setup();
    render(<FlashcardDeck cards={cards} />);

    const explainButtons = screen.getAllByText("Explain this");
    await user.click(explainButtons[0]);
    expect(screen.getByTestId("explain-modal")).toBeInTheDocument();

    await user.click(screen.getByText("Close"));
    expect(screen.queryByTestId("explain-modal")).not.toBeInTheDocument();
  });
});
