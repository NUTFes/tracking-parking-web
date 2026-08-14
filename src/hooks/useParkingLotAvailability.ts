import type { ParkingLot } from "../api/types";

export type OccupancyColor = "error" | "warning" | "success" | "primary";

function occupancyColorForRatio(ratio: number): OccupancyColor {
  if (ratio >= 0.95) return "error";
  if (ratio >= 0.8) return "warning";
  return "success";
}

// Pure, no-hook version shared with CampusMap (which needs a color per pin
// inside a .map(), where calling a "useX" hook would break the rules of hooks).
export function getOccupancyColor(lot: Pick<ParkingLot, "capacity" | "current_count">): OccupancyColor {
  if (lot.capacity <= 0) return "primary";
  return occupancyColorForRatio(lot.current_count / lot.capacity);
}

export function useParkingLotAvailability(lot: ParkingLot) {
  const hasCapacity = lot.capacity > 0;
  // Occupancy ratio, not availability — current_count is shown as-is (not
  // clamped to capacity), so a lot pushed over capacity via manual
  // adjustments stays visible instead of silently reading "0 available".
  const ratio = hasCapacity ? lot.current_count / lot.capacity : 0;
  const color = getOccupancyColor(lot);
  const isFull = hasCapacity && lot.current_count >= lot.capacity;
  // How far over the nominal capacity, if at all (e.g. squeezed-in cars) —
  // shown as "満車＋N" instead of being hidden behind a plain "満車".
  const overCount = hasCapacity ? Math.max(0, lot.current_count - lot.capacity) : 0;

  return { hasCapacity, ratio, color, isFull, overCount };
}
