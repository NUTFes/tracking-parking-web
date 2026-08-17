import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getOccupancyColor, useParkingLotAvailability } from "./useParkingLotAvailability";
import type { ParkingLot } from "../api/types";

function lot(overrides: Partial<ParkingLot> = {}): ParkingLot {
  return { id: 1, name: "テスト駐車場", capacity: 10, current_count: 0, created_at: "2026-08-15T00:00:00", ...overrides };
}

describe("getOccupancyColor", () => {
  it("収容台数が0以下の場合はprimary（未設定扱い）を返すことを確認する", () => {
    expect(getOccupancyColor(lot({ capacity: 0, current_count: 5 }))).toBe("primary");
  });

  it("占有率が80%未満の場合はsuccessを返すことを確認する", () => {
    expect(getOccupancyColor(lot({ capacity: 10, current_count: 7 }))).toBe("success");
  });

  it("占有率が80%以上95%未満の場合はwarningを返すことを確認する", () => {
    expect(getOccupancyColor(lot({ capacity: 10, current_count: 8 }))).toBe("warning");
  });

  it("占有率が95%以上の場合はerrorを返すことを確認する", () => {
    expect(getOccupancyColor(lot({ capacity: 10, current_count: 10 }))).toBe("error");
  });
});

describe("useParkingLotAvailability", () => {
  it("収容台数が設定されている場合、占有率・満車判定・超過台数を正しく計算することを確認する", () => {
    const { result } = renderHook(() => useParkingLotAvailability(lot({ capacity: 10, current_count: 12 })));

    expect(result.current.hasCapacity).toBe(true);
    expect(result.current.ratio).toBeCloseTo(1.2);
    expect(result.current.isFull).toBe(true);
    expect(result.current.overCount).toBe(2);
    expect(result.current.color).toBe("error");
  });

  it("収容台数が0の場合、hasCapacityがfalseになり満車判定もfalseになることを確認する", () => {
    const { result } = renderHook(() => useParkingLotAvailability(lot({ capacity: 0, current_count: 5 })));

    expect(result.current.hasCapacity).toBe(false);
    expect(result.current.ratio).toBe(0);
    expect(result.current.isFull).toBe(false);
    expect(result.current.overCount).toBe(0);
  });

  it("current_countがcapacityちょうどの場合、満車（isFull）だが超過台数は0であることを確認する", () => {
    const { result } = renderHook(() => useParkingLotAvailability(lot({ capacity: 10, current_count: 10 })));

    expect(result.current.isFull).toBe(true);
    expect(result.current.overCount).toBe(0);
  });
});
