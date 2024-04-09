import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import App from './NavLinks';
import reportWebVitals from './reportWebVitals';

import X6Comp from './components/x6';
import G6Comp from './components/g6';
import LFComp from './components/logicflow';
import RectFlowComp from './components/reactflow';

const router = createBrowserRouter([
  {
    path: '/',
    element: <X6Comp />,
  },
  {
    path: '/g6',
    element: <G6Comp />,
  },
  {
    path: '/logicflow',
    element: <LFComp />,
  },
  {
    path: '/reactflow',
    element: <RectFlowComp />,
  },
]);

createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
