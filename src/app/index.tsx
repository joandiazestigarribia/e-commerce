import { RouterProvider } from 'react-router-dom';
import { router } from './router';


function App() {

  // TODO: Aplicar provider

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
