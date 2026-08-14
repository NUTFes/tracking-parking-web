import type { ParkingLot } from "./types";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/api/v1`;

async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.text();
  try {
    const detail = JSON.parse(body).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const messages = detail.map((e: { msg?: string }) => e.msg).filter(Boolean);
      if (messages.length > 0) return messages.join(" / ");
    }
  } catch {
    // Body wasn't JSON — fall through to a generic message below.
  }
  return body || `エラーが発生しました（${response.status}）`;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return response.json() as Promise<T>;
}

export const api = {
  listParkingLots: () => request<ParkingLot[]>("/parking-lots"),
};
