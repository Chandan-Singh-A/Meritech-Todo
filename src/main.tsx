import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { StoreProvider } from './context/storeProvider.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

import Todo from './modules/todo/todo.tsx'
import SignUpComponent from './modules/auth/forms/sign-up-component.tsx'
import LoginComponent from './modules/auth/forms/login-component.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Todo />,
  },
  {
    path: '/login',
    element: <LoginComponent />,
  },
  {
    path: '/signup',
    element: <SignUpComponent />,
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