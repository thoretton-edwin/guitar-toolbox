import { Box, Container, Typography } from "@mui/material";

export function HomeRoute() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography component="h1" variant="h3" gutterBottom>
          guitar-toolbox
        </Typography>
        <Typography color="text.secondary" variant="h6">
          Hello, world!
        </Typography>
      </Box>
    </Container>
  );
}
