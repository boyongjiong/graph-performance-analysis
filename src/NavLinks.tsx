import './App.css';
import { Link } from 'react-router-dom';

function App({ children }: any) {
  return (
    <div className="App">
      <header className="header">
        <Link to="/">X6</Link>
        <Link to="/g6">G6</Link>
        <Link to="/logicflow">LogicFlow</Link>
        <Link to="/reactflow">ReactFlow</Link>
      </header>

      {children}
    </div>
  );
}

export default App;
