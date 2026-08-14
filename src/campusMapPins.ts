export type CampusMapPin = {
  /** Must match a ParkingLot.name exactly to show live data — see CampusMap.tsx. */
  name: string;
  /** Position as a percentage of the map image's width/height (0-100), so it
   * stays correctly placed regardless of how large the image is rendered. */
  xPercent: number;
  yPercent: number;
};

// Hand-placed against public/campus-map.png — eyeballed from the image, not
// pixel-perfect. Nudge xPercent/yPercent here if a pin looks off. This exact
// set of names is also the seed dataset (services/api/scripts/seed_demo_data.py).
export const CAMPUS_MAP_PINS: CampusMapPin[] = [
  { name: "イチョウ通り", xPercent: 4.8, yPercent: 35.5 },
  { name: "RIセンター北", xPercent: 63.8, yPercent: 21.4 },
  { name: "講義棟西2", xPercent: 72.5, yPercent: 23.9 },
  { name: "講義棟西1", xPercent: 70.0, yPercent: 34.6 },
  { name: "講義棟北2", xPercent: 90.8, yPercent: 41.6 },
  { name: "体育館下", xPercent: 29.5, yPercent: 81.2 },
  { name: "地域防災実践研究センター下", xPercent: 11.3, yPercent: 85.3 },
];
