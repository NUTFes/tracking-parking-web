import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParkingLotTile } from "./ParkingLotTile";
import type { ParkingLot } from "../api/types";

function lot(overrides: Partial<ParkingLot> = {}): ParkingLot {
  return { id: 1, name: "イチョウ通り", capacity: 10, current_count: 0, created_at: "2026-08-15T00:00:00", ...overrides };
}

describe("ParkingLotTile", () => {
  it("駐車場名と現在の台数/収容台数を表示することを確認する", () => {
    render(<ParkingLotTile lot={lot({ current_count: 3, capacity: 10 })} />);

    expect(screen.getByText("イチョウ通り")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("/ 10")).toBeInTheDocument();
  });

  it("満車ちょうどの場合、超過台数なしの「満車」チップを表示することを確認する", () => {
    render(<ParkingLotTile lot={lot({ current_count: 10, capacity: 10 })} />);

    expect(screen.getByText("満車")).toBeInTheDocument();
    expect(screen.queryByText(/満車＋/)).not.toBeInTheDocument();
  });

  it("収容台数を超えている場合、「満車＋N」チップを表示することを確認する", () => {
    render(<ParkingLotTile lot={lot({ current_count: 12, capacity: 10 })} />);

    expect(screen.getByText("満車＋2")).toBeInTheDocument();
  });

  it("満車未満の場合、満車チップを表示しないことを確認する", () => {
    render(<ParkingLotTile lot={lot({ current_count: 5, capacity: 10 })} />);

    expect(screen.queryByText(/満車/)).not.toBeInTheDocument();
  });

  it("収容台数が0の場合、割合表示ではなく「台 駐車中」の簡易表示になることを確認する", () => {
    render(<ParkingLotTile lot={lot({ current_count: 7, capacity: 0 })} />);

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("台 駐車中")).toBeInTheDocument();
    expect(screen.queryByText("/ 0")).not.toBeInTheDocument();
  });
});
