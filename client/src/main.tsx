import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { Providers } from './Providers';
import { router } from './Router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>
);
