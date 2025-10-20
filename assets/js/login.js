document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const overlay = document.getElementById('mockupOverlay');

  // Enkripsi hash SHA-256 untuk admin / admin123
  const STORED = {
    userHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // "admin"
    passHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // "admin123"
  };

  async function hashHex(input) {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    const [uh, ph] = await Promise.all([hashHex(u), hashHex(p)]);
    if (uh === STORED.userHash && ph === STORED.passHash) {
      window.location.href = 'input-data.html';
    } else {
      overlay.classList.remove('d-none');
      setTimeout(() => {
        overlay.classList.add('d-none');
        form.reset();
      }, 3000);
    }
  });
});
