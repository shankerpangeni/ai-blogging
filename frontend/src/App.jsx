import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  const approuter = createBrowserRouter([
    

    {
      path: '/register',
      element: <Register />
    },

    {path: '/',
      element: <Login />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    }
  ])
  return (
   <>
    <RouterProvider router={approuter} />
   </>
  )
}

export default App
