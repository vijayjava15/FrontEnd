import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">§</span> Chatbot Law
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/upload">Upload PDF</NavLink>
        </nav>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer>Chatbot Law · Your legal document workspace</footer>
    </div>
  );
}
