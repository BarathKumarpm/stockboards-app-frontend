import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({ baseURL: API });

export async function getLogs() {
  const res = await api.get("/logs/");
  return res.data;
}

export async function getLog(id: string) {
  const res = await api.get(`/logs/${id}/`);
  return res.data;
}

export async function addItem(item: any) {
  const res = await api.post("/items/", item);
  return res.data;
}
