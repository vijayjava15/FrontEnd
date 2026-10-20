import React, { useState } from 'react';
import { uploadDocument } from '../services/documents';
import '../styles/upload.css';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);

  function selectFile(files) {
    setResult(null);
    const selected = files?.[0];
    if (!selected) return;
    if (files.length !== 1 || !/\.pdf$/i.test(selected.name) ||
        (selected.type && selected.type !== 'application/pdf')) {
      setFile(null);
      setResult({ ok: false, message: 'Please select one PDF file.' });
      return;
    }
    if (selected.size === 0) {
      setFile(null);
      setResult({ ok: false, message: 'This PDF is empty. Please choose another file.' });
      return;
    }
    setFile(selected);
  }

  async function upload(event) {
    event.preventDefault();
    if (!file || busy) return;
    setBusy(true);
    setResult(null);
    try {
      const data = await uploadDocument(file);
      setResult({ ok: true, message: `${data.fileName} was uploaded successfully.` });
    } catch (error) {
      setResult({ ok: false, message: error.name === 'AbortError'
        ? 'The upload timed out. Please try again.'
        : error instanceof TypeError ? 'Could not reach the upload API. Check your connection and API URL.'
        : error.message || 'Upload failed. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="card" aria-labelledby="title">
        <span className="eyebrow">DOCUMENT UPLOAD</span>
        <h1 id="title">A home for your PDF.</h1>
        <p className="intro">Choose your document and upload it in one simple step.</p>
        <form onSubmit={upload}>
          <input id="pdf" type="file" accept=".pdf,application/pdf"
            disabled={busy} onChange={(event) => selectFile(event.target.files)}
            className="file-input" aria-label="Choose a PDF file" />
          <label htmlFor="pdf" className={`dropzone ${dragging ? 'dragging' : ''} ${busy ? 'disabled' : ''}`}
            onDragOver={(event) => { event.preventDefault(); if (!busy) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault(); setDragging(false);
              if (!busy) selectFile(event.dataTransfer.files);
            }}>
            <span className="document-icon" aria-hidden="true">PDF</span>
            <strong>{file ? file.name : 'Drop your PDF here'}</strong>
            <span>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Click to change file` : 'or click to browse files'}</span>
            <span className="file-type">PDF documents only</span>
          </label>
          <button type="submit" disabled={!file || busy}>
            {busy ? <><span className="spinner" /> Uploading…</> : <>Upload PDF <span aria-hidden="true">↑</span></>}
          </button>
          {result && <div className={`result ${result.ok ? 'success' : 'error'}`}
            role={result.ok ? 'status' : 'alert'}>
            <strong>{result.ok ? 'Upload complete' : 'Upload unsuccessful'}</strong>
            <span>{result.message}</span>
          </div>}
          <span className="hint" aria-live="polite">{busy ? 'Please keep this page open while your file uploads.' : 'Your upload status will appear here after submission.'}</span>
        </form>
      </section>
    </>
  );
}
