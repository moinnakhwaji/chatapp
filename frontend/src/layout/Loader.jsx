import React from 'react';
import { Grid, Skeleton, Stack } from "@mui/material";
import { BouncingSkeleton } from '../components/Style/Style';

const Loader = () => {
  return (
    <Grid container spacing={"1rem"} style={{ height: "calc(100vh - 4rem)" }}>
      <Grid
        item
        sm={4}
        md={3}
        sx={{ display: { xs: "none", sm: "block" } }}
        style={{ height: "100%", backgroundColor: "#1f1e24" }} // Dark background
      >
        <Skeleton variant='rectangular' height={"100vh"} sx={{ bgcolor: "grey.900" }} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        lg={6}
        style={{ height: "100%", backgroundColor: "#1f1e24" }} // Dark background
      >
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton variant='rectangular' height={"5rem"} key={index} sx={{ bgcolor: "grey.900" }} />
          ))}
        </Stack>
      </Grid>
      <Grid
        item
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
          padding: "2rem",
          backgroundColor: "#1f1e24", // Dark background
        }}
        style={{ height: "100%" }}
      >
        <Skeleton variant='rectangular' height={"100vh"} sx={{ bgcolor: "grey.900" }} />
      </Grid>
    </Grid>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing="0.5rem"
      direction="row"
      padding="0.5rem"
      justifyContent="center"
      sx={{
        backgroundColor: '#1f1e24', // Dark background
        borderRadius: '8px', // Smooth rounded edges
      }}
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
        sx={{ bgcolor: "grey.50" }} // Light color for bouncing dots
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
        sx={{ bgcolor: "grey.50" }} // Light color for bouncing dots
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
        sx={{ bgcolor: "grey.50" }} // Light color for bouncing dots
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.6s",
        }}
        sx={{ bgcolor: "grey.50" }} // Light color for bouncing dots
      />
    </Stack>
  );
};

export { TypingLoader, Loader };
