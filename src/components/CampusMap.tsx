import { useState } from "react";
import type { MouseEvent } from "react";
import { Box, IconButton, Paper, Popover, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import type { ParkingLot } from "../api/types";
import { CAMPUS_MAP_PINS } from "../campusMapPins";
import { getOccupancyColor } from "../hooks/useParkingLotAvailability";

type Props = {
  parkingLots: ParkingLot[];
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
        const color = lot ? `${getOccupancyColor(lot)}.main` : "grey.500";
        return (
          <IconButton
            key={`${pin.name}-${index}`}
            onClick={(e) => handlePinClick(e, pin.name)}
            aria-label={pin.name}
            size="small"
            sx={{
              position: "absolute",
              left: `${pin.xPercent}%`,
              top: `${pin.yPercent}%`,
              transform: "translate(-50%, -100%)",
              color,
              p: 0.25,
              "&:hover": { filter: "brightness(0.85)" },
            }}
          >
            <PlaceIcon sx={{ fontSize: { xs: 26, sm: 30 }, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }} />
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
