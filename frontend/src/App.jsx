import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import EmployeesPage from './pages/EmployeesPage';
import InsightsPage from './pages/InsightsPage';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
