import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="card" aria-labelledby="not-found-title">
      <span className="eyebrow">404</span>
      <h1 id="not-found-title">Page not found</h1>
      <p className="intro">We couldn’t find the page you’re looking for.</p>
      <Link className="primary-link" to="/">Back to home</Link>
    </section>
  );
}
