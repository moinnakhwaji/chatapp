import React, { useState } from 'react';
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material';
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { Link as LinkComponent, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import { matBlack } from '../constant/Color';
import { adminLogout } from '../redux/reducers/thunks/admin';
import { useDispatch } from 'react-redux';

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

const adminTabs = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: <ManageAccountsIcon />,
  },
  {
    name: 'Chats',
    path: '/admin/chats',
    icon: <GroupsIcon />,
  },
  {
    name: 'Messages',
    path: '/admin/messages',
    icon: <MessageIcon />,
  },
];

const SideBar = ({ w = '100%' }) => {
  const location = useLocation();
  const dispatch = useDispatch()


  const logoutHandler = ()=>{
    // console.log("logout")
    dispatch(adminLogout());

  }

  
  
  return (
    <Stack className=' h-screen' bgcolor={"white"} color={"black"} width={w} direction={'column'} p={'3rem'} spacing={'3rem'} height={"160vh"}>
      <Typography variant='h5' textTransform={'uppercase'}>
        Admin
      </Typography>
      <Stack spacing={'1rem'}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: matBlack,
                color: 'white',
                ':hover': { color: 'white' },
              }
            }
          >
            <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

<Link onClick={logoutHandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />

            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleClose = () => {
    setIsMobile(false);
  };

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  return (
    <Grid container minHeight={'100vh'}>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          right: { xs: '1rem', sm: '2rem' },
          top: '1rem',
          zIndex: 1200, // Ensure the icon is on top of other components
          // bgcolor:"white",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
        <SideBar />
      </Grid>
      <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: '#f5f5f5' }}>
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <SideBar w='80vw'  />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
