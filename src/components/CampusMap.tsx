import { useState } from "react";
import type { MouseEvent } from "react";
import { Box, IconButton, Paper, Popover, Typography } from "@mui/material";
import type { ParkingLot } from "../api/types";
import { CAMPUS_MAP_PINS } from "../campusMapPins";
import { getOccupancyColor } from "../hooks/useParkingLotAvailability";
import type { OccupancyColor } from "../hooks/useParkingLotAvailability";

type Props = {
  parkingLots: ParkingLot[];
};

// One-character status shown inside each pin, mirroring the gauge colors.
const PIN_LABELS: Record<OccupancyColor, string> = {
  success: "空",
  warning: "混",
  error: "満",
  primary: "-",
};

export function CampusMap({ parkingLots }: Props) {
  const [anchor, setAnchor] = useState<{ el: HTMLElement; pinName: string } | null>(null);

  const handlePinClick = (event: MouseEvent<HTMLElement>, pinName: string) => {
    setAnchor({ el: event.currentTarget, pinName });
  };

  const selectedLot = anchor ? parkingLots.find((lot) => lot.name === anchor.pinName) : undefined;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mb: { xs: 3, sm: 4 },
        borderRadius: 3,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
        lineHeight: 0,
      }}
    >
      <Box component="img" src="/campus-map.png" alt="キャンパスマップ" sx={{ display: "block", width: "100%", height: "auto" }} />

      {CAMPUS_MAP_PINS.map((pin, index) => {
        const lot = parkingLots.find((l) => l.name === pin.name);
        // Unregistered pins get a neutral grey — everything else matches the
        // same success/warning/error thresholds as the card's gauge.
        const occupancyColor = lot ? getOccupancyColor(lot) : null;
        const color = occupancyColor ? `${occupancyColor}.main` : "grey.500";
        const label = occupancyColor ? PIN_LABELS[occupancyColor] : "-";
        return (
          <IconButton
            key={`${pin.name}-${index}`}
            onClick={(e) => handlePinClick(e, pin.name)}
            aria-label={pin.name}
            sx={{
              position: "absolute",
              left: `${pin.xPercent}%`,
              top: `${pin.yPercent}%`,
              transform: "translate(-50%, -100%)",
              width: { xs: 34, sm: 40 },
              height: { xs: 42, sm: 50 },
              p: 0,
              borderRadius: 0,
              "&:hover": { filter: "brightness(0.9)" },
            }}
          >
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              <Box
                sx={{
                  width: { xs: 34, sm: 40 },
                  height: { xs: 34, sm: 40 },
                  borderRadius: "50%",
                  bgcolor: color,
                  border: "2px solid white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "common.white", fontWeight: 700, fontSize: { xs: 14, sm: 16 }, lineHeight: 1 }}>
                  {label}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: { xs: "6px solid transparent", sm: "7px solid transparent" },
                  borderRight: { xs: "6px solid transparent", sm: "7px solid transparent" },
                  borderTop: { xs: "8px solid", sm: "10px solid" },
                  borderTopColor: color,
                }}
              />
            </Box>
          </IconButton>
        );
      })}

      <Popover
        open={anchor !== null}
        anchorEl={anchor?.el ?? null}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Paper sx={{ p: 2, minWidth: 160 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {anchor?.pinName}
          </Typography>
          {selectedLot ? (
            <Typography sx={{ mt: 0.5 }}>
              <Typography component="span" variant="h5" sx={{ fontWeight: 700 }}>
                {selectedLot.current_count}
              </Typography>
              <Typography component="span" variant="body2" color="text.secondary">
                {" "}
                / {selectedLot.capacity} 台
              </Typography>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              未登録
            </Typography>
          )}
        </Paper>
      </Popover>
    </Box>
  );
}
