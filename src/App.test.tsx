import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { api } from "./api/client";
import type { ParkingLot } from "./api/types";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("取得した駐車場一覧をタイル表示することを確認する", async () => {
    const lots: ParkingLot[] = [
      { id: 1, name: "イチョウ通り", capacity: 10, current_count: 3, created_at: "2026-08-15T00:00:00" },
    ];
    vi.spyOn(api, "listParkingLots").mockResolvedValue(lots);

    render(<App />);

    expect(await screen.findByText("イチョウ通り")).toBeInTheDocument();
  });

  it("取得に失敗した場合、エラーメッセージをアラート表示することを確認する", async () => {
    vi.spyOn(api, "listParkingLots").mockRejectedValue(new Error("サーバーに接続できません"));

    render(<App />);

    expect(await screen.findByText("サーバーに接続できません")).toBeInTheDocument();
  });

  it("駐車場が1件も登録されていない場合、その旨のメッセージを表示することを確認する", async () => {
    vi.spyOn(api, "listParkingLots").mockResolvedValue([]);

    render(<App />);

    expect(await screen.findByText("登録済みの駐車場がありません")).toBeInTheDocument();
  });
});
