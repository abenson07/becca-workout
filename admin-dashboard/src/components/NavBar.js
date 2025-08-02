import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <button className="logo-btn" onClick={() => navigate('/clients')}>Logo</button>
      </div>
      <div className="navbar-center">
        <NavLink to="/clients" className={({ isActive }) => isActive ? 'nav-pill active' : 'nav-pill'}>Clients</NavLink>
        <NavLink to="/trainer" className={({ isActive }) => isActive ? 'nav-pill active' : 'nav-pill'}>Trainers</NavLink>
        <NavLink to="/movement" className={({ isActive }) => isActive ? 'nav-pill active' : 'nav-pill'}>Movements</NavLink>
      </div>
      <div className="navbar-right">
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-pill' : 'nav-pill'}>Admin</NavLink>
        <button className="nav-pill">Logout</button>
      </div>
    </div>
  );
}

export default NavBar;
