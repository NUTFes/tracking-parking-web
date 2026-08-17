import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./client";
import type { ParkingLot } from "./types";

function mockFetchOnce(init: { ok: boolean; status: number; json?: () => Promise<unknown>; text?: () => Promise<string> }) {
  const fetchMock = vi.fn().mockResolvedValue(init as unknown as Response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("api.listParkingLots", () => {
  it("正常時、駐車場一覧をそのまま返すことを確認する", async () => {
    const lots: ParkingLot[] = [
      { id: 1, name: "テスト駐車場", capacity: 10, current_count: 3, created_at: "2026-08-15T00:00:00+09:00" },
    ];
    const fetchMock = mockFetchOnce({ ok: true, status: 200, json: async () => lots });

    const result = await api.listParkingLots();

    expect(result).toEqual(lots);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/api/v1/parking-lots");
  });

  it("サーバーが{detail: string}形式のエラーを返した場合、そのメッセージで例外を投げることを確認する", async () => {
    mockFetchOnce({ ok: false, status: 404, text: async () => JSON.stringify({ detail: "not found" }) });

    await expect(api.listParkingLots()).rejects.toThrow("not found");
  });

  it("サーバーがバリデーションエラー配列（detailが配列）を返した場合、msgを' / 'で連結したメッセージにすることを確認する", async () => {
    mockFetchOnce({
      ok: false,
      status: 422,
      text: async () => JSON.stringify({ detail: [{ msg: "capacity is required" }, { msg: "name is required" }] }),
    });

    await expect(api.listParkingLots()).rejects.toThrow("capacity is required / name is required");
  });

  it("レスポンスボディがJSONでない場合、ステータスコードを含む汎用メッセージにフォールバックすることを確認する", async () => {
    mockFetchOnce({ ok: false, status: 500, text: async () => "" });

    await expect(api.listParkingLots()).rejects.toThrow("エラーが発生しました（500）");
  });

  it("detailが配列だが有効なmsgが1件もない場合、生のレスポンスボディにフォールバックすることを確認する", async () => {
    const body = JSON.stringify({ detail: [{}, { msg: "" }] });
    mockFetchOnce({ ok: false, status: 422, text: async () => body });

    await expect(api.listParkingLots()).rejects.toThrow(body);
  });

  it("detailが文字列でも配列でもない場合、生のレスポンスボディにフォールバックすることを確認する", async () => {
    const body = JSON.stringify({ detail: { code: "internal_error" } });
    mockFetchOnce({ ok: false, status: 500, text: async () => body });

    await expect(api.listParkingLots()).rejects.toThrow(body);
  });
});
