import { Box, Card, CardContent, Chip, LinearProgress, Typography } from "@mui/material";
import type { ParkingLot } from "../api/types";
import { useParkingLotAvailability } from "../hooks/useParkingLotAvailability";

type Props = {
  lot: ParkingLot;
};

export function ParkingLotTile({ lot }: Props) {
  const { hasCapacity, ratio, color, isFull, overCount } = useParkingLotAvailability(lot);

  return (
    <Card variant="outlined" sx={{ width: { xs: "100%", sm: 260 }, borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
          {lot.name}
        </Typography>

        {hasCapacity ? (
          <>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, mt: 1.5, flexWrap: "wrap" }}>
              <Typography variant="h3" color={`${color}.main`} sx={{ fontWeight: 700 }}>
                {lot.current_count}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                / {lot.capacity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                台
              </Typography>
              {isFull && (
                <Chip
                  label={overCount > 0 ? `満車＋${overCount}` : "満車"}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, ratio * 100)}
              color={color}
              aria-label={`${lot.name}の駐車状況`}
              sx={{ mt: 1.5, height: 8, borderRadius: 4 }}
            />
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1.5 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {lot.current_count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              台 駐車中
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
