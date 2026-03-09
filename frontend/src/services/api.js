import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export async function generateFlashcards(text) {
  try {
    const { data } = await api.post("/api/generate", { text });
    return data.cards;
  } catch (err) {
    const message =
      err.response?.data?.error || "Something went wrong. Please try again.";
    throw new Error(message);
  }
}

export async function uploadPDF(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.cards;
  } catch (err) {
    const message =
      err.response?.data?.error || "Failed to upload PDF. Please try again.";
    throw new Error(message);
  }
}

export async function fetchSessions() {
  const { data } = await api.get("/api/sessions");
  return data.sessions;
}

export async function fetchSession(id) {
  const { data } = await api.get(`/api/sessions/${id}`);
  return data.session;
}

export async function saveSession(title, cards) {
  const { data } = await api.post("/api/sessions", { title, cards });
  return data.session;
}

export async function deleteSession(id) {
  await api.delete(`/api/sessions/${id}`);
}

export async function explainCard(question, answer) {
  const { data } = await api.post("/api/explain", { question, answer });
  return data.explanation;
}
