import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupFetchInterceptor } from './Pages/Auth/setupFetchInterceptor.ts';
import { setupAxiosInterceptor } from './Pages/Auth/axiosGlobalInterceptor.ts';

setupFetchInterceptor();
setupAxiosInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
