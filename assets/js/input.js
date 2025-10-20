document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading-section');
  const progressBar = document.getElementById('progress-bar');
  const inputSection = document.getElementById('input-section');
  const lanjutBtn = document.getElementById('lanjut-btn');
  const nama = document.getElementById('nama');
  const usia = document.getElementById('usia');
  const jk = document.getElementById('jk');
  const kode = document.getElementById('kode');

  const sidikSection = document.getElementById('sidikjari-section');
  const rekamBtns = document.querySelectorAll('.rekam-btn');
  const simpanBtn = document.getElementById('simpan-btn');

  const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
  const confirmYes = document.getElementById('confirmYes');
  const processModal = new bootstrap.Modal(document.getElementById('processModal'));
  const processText = document.getElementById('processText');
  const processProgress = document.getElementById('processProgress');
  const processBar = document.getElementById('processBar');

  const recorded = { 1: false, 2: false, 3: false, 4: false, 5: false };

  // Loading 5 detik
  let elapsed = 0,
    total = 5000;
  const timer = setInterval(() => {
    elapsed += 100;
    const pct = Math.min(100, Math.round((elapsed / total) * 100));
    progressBar.style.width = pct + '%';
    progressBar.textContent = pct + '%';
    if (pct >= 100) {
      clearInterval(timer);
      loading.classList.add('d-none');
      inputSection.classList.remove('d-none');
    }
  }, 100);

  [nama, usia, jk].forEach((e) =>
    e.addEventListener('input', () => {
      lanjutBtn.disabled = !(nama.value && usia.value && jk.value);
    })
  );

  lanjutBtn.addEventListener('click', () => confirmModal.show());
  confirmYes.addEventListener('click', () => {
    [nama, usia, jk, kode].forEach((f) => (f.disabled = true));
    confirmModal.hide();
    sidikSection.classList.remove('d-none');
  });

  rekamBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const fid = btn.closest('.finger').dataset.finger;
      processText.textContent = 'TEMPELKAN JARI';
      processProgress.classList.add('d-none');
      processModal.show();
      await wait(4000);
      processText.textContent = '';
      processProgress.classList.remove('d-none');
      await animateProgress(4000, (p) => {
        processBar.style.width = p + '%';
        processBar.textContent = p + '%';
      });
      const img = document.getElementById(`img${fid}`);
      img.src = `./assets/img/J${fid}A.png`;
      btn.remove();
      recorded[fid] = true;
      sessionStorage.setItem('finger_' + fid, img.src);
      processModal.hide();
      if (Object.values(recorded).every((v) => v)) simpanBtn.classList.remove('d-none');
    });
  });

  simpanBtn.addEventListener('click', async () => {
    simpanBtn.disabled = true;
    processModal.show();
    processText.textContent = 'Menyimpan data...';
    processProgress.classList.remove('d-none');
    await animateProgress(5000, (p) => {
      processBar.style.width = p + '%';
      processBar.textContent = p + '%';
    });
    sessionStorage.setItem(
      'formData',
      JSON.stringify({
        nama: nama.value,
        usia: usia.value,
        jk: jk.value,
        kode: kode.value,
      })
    );
    window.location.href = 'print.html';
  });

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  async function animateProgress(ms, cb) {
    const step = 100,
      total = ms / step;
    let c = 0;
    while (c <= total) {
      cb(Math.round((c / total) * 100));
      await wait(step);
      c++;
    }
  }
});
