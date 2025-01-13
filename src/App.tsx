import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ListView from './components/ListView';
import Subscriptions from './components/Subscriptions';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/:listName" element={<ListView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
