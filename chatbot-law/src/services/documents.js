export async function uploadDocument(file) {
    const body = new FormData();
    body.append(import.meta.env.VITE_UPLOAD_FIELD_NAME || 'file', file);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(import.meta.env.VITE_UPLOAD_API_URL || '/api/documents', {
        method: 'POST', body, signal: controller.signal,
      });
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = null; }
      // An HTTP error or an explicit failure in a JSON response is a failed upload.
      const failed = !response.ok || data?.success === false || data?.ok === false ||
        ['error', 'failed', 'failure'].includes(String(data?.status).toLowerCase());
      const message = typeof data?.detail === 'string' ? data.detail
        : typeof data?.message === 'string' ? data.message
        : typeof data?.error === 'string' ? data.error : null;
      if (failed) throw new Error(message || `Upload failed (HTTP ${response.status}). Please try again.`);
      // A SPA fallback or login HTML page must never appear as a successful upload.
      if (response.headers.get('content-type')?.includes('text/html')) {
        throw new Error('The upload API returned a web page. Please check the configured API URL.');
      }
      if (!data || typeof data.id !== 'string' || typeof data.fileName !== 'string') {
        throw new Error('The upload API returned an unexpected response. Please check the API URL.');
      }
      return data;
    } finally {
      clearTimeout(timeout);
    }
}
