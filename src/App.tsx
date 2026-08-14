import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SortingPage } from './pages/SortingPage';
import { GraphPage } from './pages/GraphPage';
import { KnapsackPage } from './pages/KnapsackPage';
import { NQueensPage } from './pages/NQueensPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/knapsack" element={<KnapsackPage />} />
        <Route path="/nqueens" element={<NQueensPage />} />
      </Route>
    </Routes>
  );
}

export default App;
