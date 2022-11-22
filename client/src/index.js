import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import AuthProvider from './AuthContext';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
