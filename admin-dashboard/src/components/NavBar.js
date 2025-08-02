import { Link } from 'react-router-dom';

function NavBar() {
  return (
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
  );
}

export default NavBar;
