import React from 'react';
import ReactDOM from 'react-dom/client';
import 'leaflet/dist/leaflet.css'
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';// renaming BrowserRouter import as Router
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
        <Router>
            <App />
        </Router>
    </ChakraProvider>
)
