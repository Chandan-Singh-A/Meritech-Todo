import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { StoreProvider } from './context/storeProvider.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

import App from './App.tsx'
import LoginComponent  from './Login/LoginComponent.tsx'
import SignupComponent from './SignUp/SignUpComponent.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginComponent />,
  },
  {
    path: '/signup',
    element: <SignupComponent />,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <StoreProvider>
        <RouterProvider router={router}></RouterProvider>
      </StoreProvider>
    </DndProvider>
  </StrictMode>,
)