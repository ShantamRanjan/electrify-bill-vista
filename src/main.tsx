
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// This rendering approach is used to ensure the HTML/CSS/JS solution works properly
createRoot(document.getElementById("root")!).render(<App />);
