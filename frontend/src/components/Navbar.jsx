import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { People, Insights } from '@mui/icons-material';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Employees', path: '/', icon: <People fontSize="small" /> },
    { label: 'Salary Insights', path: '/insights', icon: <Insights fontSize="small" /> },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.5px' }}>
          Salary Manager
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                px: 2,
                borderRadius: 2,
                bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
