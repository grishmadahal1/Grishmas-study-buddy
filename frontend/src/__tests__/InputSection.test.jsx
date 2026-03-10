import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import InputSection from "../components/InputSection";

describe("InputSection", () => {
  it("should render the heading and textarea", () => {
    render(
      <InputSection onGenerateText={vi.fn()} onGeneratePDF={vi.fn()} loading={false} />
    );

    expect(screen.getByText("Study Buddy")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste your notes/i)).toBeInTheDocument();
  });

  it("should disable button when textarea is empty", () => {
    render(
      <InputSection onGenerateText={vi.fn()} onGeneratePDF={vi.fn()} loading={false} />
    );

    const button = screen.getByRole("button", { name: /generate flashcards/i });
    expect(button).toBeDisabled();
  });

  it("should enable button when text is entered", async () => {
    const user = userEvent.setup();
    render(
      <InputSection onGenerateText={vi.fn()} onGeneratePDF={vi.fn()} loading={false} />
    );

    const textarea = screen.getByPlaceholderText(/paste your notes/i);
    await user.type(textarea, "Some study notes");

    const button = screen.getByRole("button", { name: /generate flashcards/i });
    expect(button).toBeEnabled();
  });

  it("should call onGenerateText with trimmed text on submit", async () => {
    const user = userEvent.setup();
    const mockGenerate = vi.fn();
    render(
      <InputSection onGenerateText={mockGenerate} onGeneratePDF={vi.fn()} loading={false} />
    );

    const textarea = screen.getByPlaceholderText(/paste your notes/i);
    await user.type(textarea, "  JavaScript closures  ");

    const button = screen.getByRole("button", { name: /generate flashcards/i });
    await user.click(button);

    expect(mockGenerate).toHaveBeenCalledWith("JavaScript closures");
  });

  it("should show loading state", () => {
    render(
      <InputSection onGenerateText={vi.fn()} onGeneratePDF={vi.fn()} loading={true} />
    );

    expect(screen.getByText(/generating/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste your notes/i)).toBeDisabled();
  });

  it("should render PDF drop zone", () => {
    render(
      <InputSection onGenerateText={vi.fn()} onGeneratePDF={vi.fn()} loading={false} />
    );

    expect(screen.getByText(/drag & drop a pdf/i)).toBeInTheDocument();
  });
});
