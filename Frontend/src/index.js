import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Assurez-vous que ce fichier existe, sinon supprimez cette ligne

const container = document.getElementById('root');
const root = createRoot(container); // Créez un "root" avec React 18
root.render(<App />);
