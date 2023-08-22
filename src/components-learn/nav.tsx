import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Light from './light';

export const Nav = () => {
  return (
    <Router>
      <Link to="/light">light</Link>
      <hr />
      <Routes>
        <Route path="/light" element={<Light />} />
      </Routes>
    </Router>
  );
};
