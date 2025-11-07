import './App.css';
import MainPage from './components/MainPage';
import OUNavbar from './components/OUNavbar';
import { Analytics } from '@vercel/analytics/react';

const App = () => (
  <div className="App">
    <OUNavbar />
    <div style={{ marginTop: '12px' }}>
      <MainPage />
      <Analytics />
    </div>
  </div>
)

export default App;
