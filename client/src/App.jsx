import { BrowserRouter } from "react-router-dom";
import Allroutes from './routes/Allroutes';
import AuthContextProvider from './context/Auth.context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Allroutes />
        <ToastContainer /> 
      </BrowserRouter>
    </AuthContextProvider>
  );
}