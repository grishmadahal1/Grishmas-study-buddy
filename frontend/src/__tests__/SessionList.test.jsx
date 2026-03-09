import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SessionList from "../components/SessionList";

// Mock the API module
vi.mock("../services/api", () => ({
  fetchSessions: vi.fn(),
  deleteSession: vi.fn(),
}));

import { fetchSessions, deleteSession } from "../services/api";

describe("SessionList", () => {
  const mockSessions = [
    { id: 1, title: "React Hooks", cardCount: 5, createdAt: "2026-01-15T00:00:00Z" },
    { id: 2, title: "JavaScript Basics", cardCount: 3, createdAt: "2026-01-10T00:00:00Z" },
  ];

  it("should show loading state initially", () => {
    fetchSessions.mockReturnValue(new Promise(() => {})); // never resolves
    render(<SessionList onLoadSession={vi.fn()} onNewSession={vi.fn()} />);

    expect(screen.getByText(/loading sessions/i)).toBeInTheDocument();
  });

  it("should render sessions after loading", async () => {
    fetchSessions.mockResolvedValue(mockSessions);
    render(<SessionList onLoadSession={vi.fn()} onNewSession={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("React Hooks")).toBeInTheDocument();
      expect(screen.getByText("JavaScript Basics")).toBeInTheDocument();
    });

    expect(screen.getByText("5 cards")).toBeInTheDocument();
    expect(screen.getByText("3 cards")).toBeInTheDocument();
  });

  it("should show empty state when no sessions", async () => {
    fetchSessions.mockResolvedValue([]);
    render(<SessionList onLoadSession={vi.fn()} onNewSession={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/no saved sessions yet/i)).toBeInTheDocument();
    });
  });

  it("should call onNewSession when New Session button clicked", async () => {
    fetchSessions.mockResolvedValue([]);
    const mockNewSession = vi.fn();
    render(<SessionList onLoadSession={vi.fn()} onNewSession={mockNewSession} />);

    await waitFor(() => {
      expect(screen.getByText(/no saved sessions/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /new session/i }));
    expect(mockNewSession).toHaveBeenCalled();
  });

  it("should call onLoadSession when session card clicked", async () => {
    fetchSessions.mockResolvedValue(mockSessions);
    const mockLoadSession = vi.fn();
    render(<SessionList onLoadSession={mockLoadSession} onNewSession={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("React Hooks")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("React Hooks"));
    expect(mockLoadSession).toHaveBeenCalledWith(1);
  });

  it("should delete session and remove from list", async () => {
    fetchSessions.mockResolvedValue(mockSessions);
    deleteSession.mockResolvedValue();
    render(<SessionList onLoadSession={vi.fn()} onNewSession={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("React Hooks")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle("Delete session");
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("React Hooks")).not.toBeInTheDocument();
    });
    expect(screen.getByText("JavaScript Basics")).toBeInTheDocument();
  });
});
