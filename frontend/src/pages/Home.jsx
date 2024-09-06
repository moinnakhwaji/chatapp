import React from 'react';
import Applayout from '../layout/Applayout';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const Home = () => {
  return (
    <Box bgcolor={grey[900]} height={"100%"}>
      <Typography p={"2rem"} variant='h5' textAlign={"center"} color={grey[50]}>
        Select a friend
      </Typography>
    </Box>
  );
};

// Export the unwrapped Home component for fast refresh
export { Home };

// Wrap Home with Applayout and export as default
const WrappedHome = Applayout(Home);
export default WrappedHome;
