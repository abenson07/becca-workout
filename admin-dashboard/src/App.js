import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Clients from './components/Clients';
import ClientDetail from './components/ClientDetail';
import Trainers from './components/Trainers';
import TrainerDetail from './components/TrainerDetail';
import Movements from './components/Movements';
import MovementDetail from './components/MovementDetail';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client/:id" element={<ClientDetail />} />
        <Route path="/trainer" element={<Trainers />} />
        <Route path="/trainer/:id" element={<TrainerDetail />} />
        <Route path="/movement" element={<Movements />} />
        <Route path="/movement/:id" element={<MovementDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
