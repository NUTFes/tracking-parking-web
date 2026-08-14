export type CampusMapPin = {
  /** Must match a ParkingLot.name exactly to show live data — see CampusMap.tsx. */
  name: string;
  /** Position as a percentage of the map image's width/height (0-100), so it
   * stays correctly placed regardless of how large the image is rendered. */
  xPercent: number;
  yPercent: number;
};

// Hand-placed against public/campus-map.png — eyeballed from the image, not
// pixel-perfect. Nudge xPercent/yPercent here if a pin looks off.
export const CAMPUS_MAP_PINS: CampusMapPin[] = [
  { name: "ケヤキ通り", xPercent: 12.3, yPercent: 25.1 },
  { name: "ケヤキ通り", xPercent: 25.3, yPercent: 25.1 },
  { name: "ケヤキ通り", xPercent: 40.0, yPercent: 25.1 },
  { name: "ケヤキ通り", xPercent: 54.3, yPercent: 25.1 },
  { name: "ケヤキ通り", xPercent: 27.3, yPercent: 28.4 },
  { name: "イチョウ通り", xPercent: 4.8, yPercent: 35.5 },
  { name: "環境", xPercent: 7.8, yPercent: 49.0 },
  { name: "生物", xPercent: 27.8, yPercent: 38.7 },
  { name: "機械", xPercent: 31.3, yPercent: 38.7 },
  { name: "電気", xPercent: 54.5, yPercent: 36.3 },
  { name: "RIセンター北", xPercent: 63.8, yPercent: 21.4 },
  { name: "講義棟西2", xPercent: 72.5, yPercent: 23.9 },
  { name: "講義棟西1", xPercent: 70.0, yPercent: 34.6 },
  { name: "講義棟北1", xPercent: 79.3, yPercent: 45.8 },
  { name: "講義棟北2", xPercent: 90.8, yPercent: 41.6 },
  { name: "講義棟北3", xPercent: 94.0, yPercent: 47.4 },
  { name: "講義棟北4", xPercent: 94.5, yPercent: 44.5 },
  { name: "中央", xPercent: 23.0, yPercent: 66.0 },
  { name: "来客", xPercent: 80.8, yPercent: 75.0 },
  { name: "体育館下", xPercent: 29.5, yPercent: 81.2 },
  { name: "地域防災実践研究センター下", xPercent: 11.3, yPercent: 85.3 },
];
