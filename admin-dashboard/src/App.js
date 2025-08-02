import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Home from './components/Home';
import Clients from './components/Clients';
import ClientDetail from './components/ClientDetail';
import Trainers from './components/Trainers';
import TrainerDetail from './components/TrainerDetail';
import Movements from './components/Movements';
import MovementDetail from './components/MovementDetail';
import Admin from './components/Admin';
import './App.css';

function NotFound() {
  return <div>Page Not Found</div>;
}

function ClientDetailWithParams() {
  const { id } = useParams();
  return <div>Client Detail for ID: {id}</div>;
}

function TrainerDetailWithParams() {
  const { id } = useParams();
  return <div>Trainer Detail for ID: {id}</div>;
}

function MovementDetailWithParams() {
  const { id } = useParams();
  return <div>Movement Detail for ID: {id}</div>;
}

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/clients">Clients</Link> |{' '}
        <Link to="/client/123">Client 123</Link> |{' '}
        <Link to="/trainer">Trainers</Link> |{' '}
        <Link to="/trainer/456">Trainer 456</Link> |{' '}
        <Link to="/movement">Movements</Link> |{' '}
        <Link to="/movement/789">Movement 789</Link> |{' '}
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client/:id" element={<ClientDetailWithParams />} />
        <Route path="/trainer" element={<Trainers />} />
        <Route path="/trainer/:id" element={<TrainerDetailWithParams />} />
        <Route path="/movement" element={<Movements />} />
        <Route path="/movement/:id" element={<MovementDetailWithParams />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
