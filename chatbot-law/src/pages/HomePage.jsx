import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="card" aria-labelledby="home-title">
      <span className="eyebrow">LEGAL DOCUMENT WORKSPACE</span>
      <h1 id="home-title">Welcome to Chatbot Law.</h1>
      <p className="intro">Keep your legal documents in one place. Get started by uploading a PDF.</p>
      <Link className="primary-link" to="/upload">Upload a document <span aria-hidden="true">→</span></Link>
    </section>
  );
}
