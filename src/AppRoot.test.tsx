import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppRoot } from "./AppRoot";
import { api } from "./api/client";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AppRoot", () => {
  it("テーマとAppを異常なく描画できることを確認する", async () => {
    vi.spyOn(api, "listParkingLots").mockResolvedValue([]);

    render(<AppRoot />);

    expect(await screen.findByText("Tracking-Parking 駐車場空き状況")).toBeInTheDocument();
  });

  it("OSがダークモード設定の場合でも異常なく描画できることを確認する", async () => {
    vi.spyOn(api, "listParkingLots").mockResolvedValue([]);
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList);

    render(<AppRoot />);

    expect(await screen.findByText("Tracking-Parking 駐車場空き状況")).toBeInTheDocument();
  });
});
