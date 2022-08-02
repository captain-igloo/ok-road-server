import * as React from 'react';
import { createRoot } from 'react-dom/client';

import Register from './components/Register';

const app = document.getElementById('app');

if (app) {
    createRoot(app).render(<Register />);
}
