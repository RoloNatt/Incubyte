import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Salary Management Tool
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Employees
          </Button>
          <Button color="inherit" component={Link} to="/insights">
            Salary Insights
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
