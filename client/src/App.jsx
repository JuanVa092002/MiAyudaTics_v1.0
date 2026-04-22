import { BrowserRouter } from 'react-router-dom'
import Allroutes from './routes/Allroutes'
import AuthContextProvider from './context/Auth.context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '2rem', color: 'red'}}>
          <h2>Error en la aplicación</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Allroutes />
        </ErrorBoundary>
        <ToastContainer />
      </BrowserRouter>
    </AuthContextProvider>
  )
}
