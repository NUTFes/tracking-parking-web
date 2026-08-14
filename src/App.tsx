import { Alert, Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { api } from "./api/client";
import { CampusMap } from "./components/CampusMap";
import { ParkingLotTile } from "./components/ParkingLotTile";
import { usePolling } from "./hooks/usePolling";

const POLL_INTERVAL_MS = 5000;

function App() {
  const parkingLots = usePolling(api.listParkingLots, POLL_INTERVAL_MS);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          Tracking-Parking 駐車場空き状況
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          5秒ごとに自動更新されます
        </Typography>
      </Box>

      <CampusMap parkingLots={parkingLots.data ?? []} />

      {parkingLots.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {parkingLots.error}
        </Alert>
      )}

      {parkingLots.loading && !parkingLots.data ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
          {parkingLots.data?.map((lot) => (
            <ParkingLotTile key={lot.id} lot={lot} />
          ))}
          {parkingLots.data?.length === 0 && (
            <Typography color="text.secondary">登録済みの駐車場がありません</Typography>
          )}
        </Stack>
      )}
    </Container>
  );
}

export default App;
