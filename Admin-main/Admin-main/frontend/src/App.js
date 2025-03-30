import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Admin from './components/admin/admin'; 


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/admin/*" element={<Admin />} />
            </Routes>
        </Router>
    );
};

export default App;
