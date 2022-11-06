function showAlert(msg) {
  const alert = document.querySelector('[uk-alert]');

  alert.removeAttribute('hidden');
  alert.innerText = msg;
}

document.querySelector('form').onsubmit = (e) => {
  e.preventDefault();

  const email = document.querySelector('[type=email]').value;
  const password = document.querySelector('[type=password]').value;

  fetch('../auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.message === 'USER_AUTHENTICATED') {
        if (!res.result.is_admin) return showAlert('Akun ini bukan admin!');

        location.href = location.href.replace('login.html', '');
        return;
      }

      const msg = res.message === 'EMAIL_NOT_FOUND'
        ? 'Email tidak ditemukan'
        : res.message === 'INVALID_PASSWORD'
        ? 'Password salah'
        : 'Terjadi error';

      showAlert(msg);
    })
    .catch(console.error);
}
