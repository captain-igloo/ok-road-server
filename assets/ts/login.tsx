import * as React from 'react';
import { createRoot } from 'react-dom/client';

import Login from './components/Login';

const app = document.getElementById('app');

if (app) {
    createRoot(app).render(<Login />);
}
