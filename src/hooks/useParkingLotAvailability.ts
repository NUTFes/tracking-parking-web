import type { ParkingLot } from "../api/types";

type OccupancyColor = "error" | "warning" | "success" | "primary";

function colorForOccupancy(ratio: number): OccupancyColor {
  if (ratio >= 0.95) return "error";
  if (ratio >= 0.8) return "warning";
  return "success";
}

export function useParkingLotAvailability(lot: ParkingLot) {
  const hasCapacity = lot.capacity > 0;
  // Occupancy ratio, not availability — current_count is shown as-is (not
  // clamped to capacity), so a lot pushed over capacity via manual
  // adjustments stays visible instead of silently reading "0 available".
  const ratio = hasCapacity ? lot.current_count / lot.capacity : 0;
  const color: OccupancyColor = hasCapacity ? colorForOccupancy(ratio) : "primary";
  const isFull = hasCapacity && lot.current_count >= lot.capacity;
  // How far over the nominal capacity, if at all (e.g. squeezed-in cars) —
  // shown as "満車＋N" instead of being hidden behind a plain "満車".
  const overCount = hasCapacity ? Math.max(0, lot.current_count - lot.capacity) : 0;

  return { hasCapacity, ratio, color, isFull, overCount };
}
