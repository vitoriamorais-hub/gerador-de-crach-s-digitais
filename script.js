const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Carregar moldura/fundo (se você tiver uma imagem de fundo com os circuitos)
const background = new Image();
background.src = "background-profile.png"; // Se não tiver, o código desenha no branco

let userPhoto = new Image();
let photoLoaded = false;

document.getElementById("uploadFoto").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        userPhoto = new Image();
        userPhoto.onload = () => { photoLoaded = true; };
        userPhoto.src = event.target.result;
    };
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

function generateProfile() {
    if (!photoLoaded) {
        alert("Por favor, selecione a foto do colaborador!");
        return;
    }

    const nome = document.getElementById("nomeColaborador").value || "Nome do Colaborador";
    const cargo = document.getElementById("cargoColaborador").value || "Cargo";

    // 1. Limpar e desenhar fundo
    ctx.clearRect(0, 0, 600, 600);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 600, 600);

    // 2. Desenhar a foto em CÍRCULO
    ctx.save();
    ctx.beginPath();
    ctx.arc(300, 300, 280, 0, Math.PI * 2); // Cria o círculo
    ctx.closePath();
    ctx.clip(); // Tudo o que for desenhado agora só aparece dentro do círculo

    // Ajuste da foto para preencher o círculo (Cover)
    const ratio = Math.max(600 / userPhoto.width, 600 / userPhoto.height);
    const w = userPhoto.width * ratio;
    const h = userPhoto.height * ratio;
    ctx.drawImage(userPhoto, (600 - w) / 2, (600 - h) / 2, w, h);
    ctx.restore(); // Sai da máscara circular

    // 3. Desenhar a Barra de Identificação (Escura)
    const barX = 150;
    const barY = 480;
    const barW = 350;
    const barH = 80;

    ctx.fillStyle = "rgba(50, 50, 50, 0.9)"; // Cor cinza escuro
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 40); // Barra arredondada
    ctx.fill();

    // 4. Desenhar os Textos
    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    // Nome
    ctx.font = "bold 24px Arial";
    ctx.fillText(nome, barX + 100, barY + 35);

    // Cargo
    ctx.font = "16px Arial";
    ctx.fillStyle = "#cccccc";
    ctx.fillText(cargo, barX + 100, barY + 60);

    // 5. Desenhar Logo Kikker pequeno na barra (opcional)
    // Se você tiver o ícone pequeno (só o check), desenhe aqui
    // ctx.drawImage(kikkerIcon, barX + 20, barY + 15, 50, 50);

    // 6. Ativar Download
    const link = document.getElementById("download");
    link.href = canvas.toDataURL("image/png");
    link.style.display = "inline-block";
    link.innerText = "Baixar Perfil";
}
