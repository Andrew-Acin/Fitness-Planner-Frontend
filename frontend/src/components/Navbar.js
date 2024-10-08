import React from 'react';
import { Link} from 'react-router-dom';
import { Stack } from '@mui/material';
import Logo from '../assets/images/Logo.png';

const Navbar = () => {
  return (
    <Stack>
      <Link to="/">
        <img 
          src={Logo} 
          alt="logo" 
          style={{ width: '48px', height: '48px' }} 
        />
      </Link>

      <Stack>
        <Link to="/calendar">
          Calendar
        </Link>


      </Stack>
    </Stack>
  );
};

export default Navbar;
