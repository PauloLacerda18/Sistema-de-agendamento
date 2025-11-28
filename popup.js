   const botaoCadastro = document.getElementById("btnCadastro");
    const popup = document.getElementById("popupCadastro");
    const fecharPopup = document.getElementById("fecharPopup");

    botaoCadastro.onclick = function() {
        popup.style.display = "flex";
    }

    fecharPopup.onclick = function() {
        popup.style.display = "none";
    }

    // Fecha clicando fora da caixa
    window.onclick = function(e) {
        if (e.target === popup) {
            popup.style.display = "none";
        }
    }
