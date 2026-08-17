import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CampusMap } from "./CampusMap";
import type { ParkingLot } from "../api/types";

function lot(overrides: Partial<ParkingLot> = {}): ParkingLot {
  return { id: 1, name: "イチョウ通り", capacity: 10, current_count: 0, created_at: "2026-08-15T00:00:00", ...overrides };
}

describe("CampusMap", () => {
  it("キャンパスマップ上の全ピンをボタンとして表示することを確認する", () => {
    render(<CampusMap parkingLots={[]} />);

    expect(screen.getByRole("button", { name: "イチョウ通り" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "講義棟北2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "地域防災実践研究センター下" })).toBeInTheDocument();
  });

  it("対応する駐車場データがないピンには「-」ラベルが表示されることを確認する", () => {
    render(<CampusMap parkingLots={[]} />);

    expect(screen.getByRole("button", { name: "イチョウ通り" })).toHaveTextContent("-");
  });

  it("空いている駐車場のピンには「空」ラベルが表示されることを確認する", () => {
    render(<CampusMap parkingLots={[lot({ name: "イチョウ通り", capacity: 10, current_count: 2 })]} />);

    expect(screen.getByRole("button", { name: "イチョウ通り" })).toHaveTextContent("空");
  });

  it("混雑している駐車場のピンには「混」ラベルが表示されることを確認する", () => {
    render(<CampusMap parkingLots={[lot({ name: "イチョウ通り", capacity: 10, current_count: 8 })]} />);

    expect(screen.getByRole("button", { name: "イチョウ通り" })).toHaveTextContent("混");
  });

  it("ピンをクリックすると、対応する駐車場の現在台数と収容台数がポップオーバーに表示されることを確認する", async () => {
    const user = userEvent.setup();
    render(<CampusMap parkingLots={[lot({ name: "イチョウ通り", capacity: 10, current_count: 4 })]} />);

    await user.click(screen.getByRole("button", { name: "イチョウ通り" }));

    expect(await screen.findByText("4")).toBeInTheDocument();
    expect(screen.getByText("/ 10 台")).toBeInTheDocument();
  });

  it("対応する駐車場データがないピンをクリックすると「未登録」と表示されることを確認する", async () => {
    const user = userEvent.setup();
    render(<CampusMap parkingLots={[]} />);

    await user.click(screen.getByRole("button", { name: "講義棟北2" }));

    expect(await screen.findByText("未登録")).toBeInTheDocument();
  });

  it("背景（バックドロップ）をクリックするとポップオーバーを閉じられることを確認する", async () => {
    const user = userEvent.setup();
    render(<CampusMap parkingLots={[lot({ name: "イチョウ通り" })]} />);

    await user.click(screen.getByRole("button", { name: "イチョウ通り" }));
    const title = await screen.findByText("イチョウ通り", { selector: ".MuiTypography-subtitle2" });

    // Popover's invisible backdrop closes it on click — more reliable in
    // jsdom than the Escape key, which depends on MUI's focus-trap having
    // actually moved focus inside the popover first.
    const backdrop = document.querySelector(".MuiBackdrop-root");
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);

    await waitForElementToBeRemoved(title);
  });
});
