// Navigation mobile
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('nav ul');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
      var expanded = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Formulaire IMPACT Alerte â€” connectÃ© Ã  Google Sheets via Apps Script
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKkA12dkSb4Ct56yvxN8xSNatqNvPds5EYz_E-jHOxQERt-1As0dO_b-yLpuhvf_OM/exec';

  var form = document.getElementById('alert-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.submit-btn');
      var originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      var formData = new FormData(form);
      var photoFile = formData.get('photo');

      var payload = {
        nom: formData.get('nom') || '',
        telephone: formData.get('telephone') || '',
        quartier: formData.get('quartier') || '',
        type: formData.get('type') || '',
        urgence: formData.get('urgence') || '',
        description: formData.get('description') || '',
        photoNom: (photoFile && photoFile.name) ? photoFile.name : '(aucune photo)'
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        // 'text/plain' Ã©vite un problÃ¨me de prÃ©-vÃ©rification (CORS) avec Apps Script
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then(function () {
          form.style.display = 'none';
          document.getElementById('confirm-box').style.display = 'block';
        })
        .catch(function (err) {
          console.error('Erreur lors de l\'envoi du signalement :', err);
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          alert('Une erreur est survenue lors de l\'envoi. VÃ©rifiez votre connexion et rÃ©essayez.');
        });
    });
  }
});
