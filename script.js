const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// --- CONFIGURAÇÕES VISUAIS ---
const canvasSize = 600;
const photoRadius = 280; // Tamanho do círculo da foto

// Carregar Imagens Base
const backgroundCircuit = new Image();
backgroundCircuit.src = "background-circuit.png"; // Imagem de fundo com as linhas verdes/azuis

const kikkerIconCircle = new Image();
kikkerIconCircle.src = "assets/kikker-icon-circle.png"; // Ícone 3D em cima do círculo cinza (igual modelo de referência)

let userPhoto = new Image();
let photoLoaded = false;

// Monitora Upload
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
        alert("Por favor, selecione a foto do colaborador primeiro!");
        return;
    }

    const nome = document.getElementById("nomeColaborador").value || "Nome do Colaborador";
    const cargo = document.getElementById("cargoColaborador").value || "Marketing";

    // 1. Limpar e desenhar Fundo (Branco)
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 2. Desenhar a Imagem de Fundo (Circuitos)
    if (backgroundCircuit.complete) {
        ctx.drawImage(backgroundCircuit, 0, 0, canvasSize, canvasSize);
    }

    // 3. Desenhar a FOTO em MÁSCARA CIRCULAR
    ctx.save();
    ctx.beginPath();
    // Centro: (300, 300), Raio: 280
    ctx.arc(300, 300, photoRadius, 0, Math.PI * 2); 
    ctx.closePath();
    ctx.clip(); // Ativa a máscara

    // Ajuste da foto para preencher (Cover)
    const ratio = Math.max(canvasSize / userPhoto.width, canvasSize / userPhoto.height);
    const w = userPhoto.width * ratio;
    const h = userPhoto.height * ratio;
    ctx.drawImage(userPhoto, (canvasSize - w) / 2, (canvasSize - h) / 2, w, h);
    ctx.restore(); // Sai da máscara circular

    // 4. Desenhar a BARRA DE IDENTIFICAÇÃO (Cinza Escuro)
    const barX = 140; // Posição X da barra
    const barY = 480; // Posição Y da barra
    const barW = 380; // Largura da barra
    const barH = 100; // Altura da barra

    ctx.fillStyle = "rgba(40, 40, 40, 0.9)"; // Cinza escuro quase opaco
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, barH / 2); // Pontas totalmente arredondadas
    ctx.fill();

    // 5. Desenhar o ÍCONE DA KIKKER NA BARRA (Esquerda)
    if (kikkerIconCircle.complete) {
        // Ícone maior e mais alto, como no modelo
        const iconW = 90;
        const iconH = 90;
        ctx.drawImage(kikkerIconCircle, barX + 5, barY + 5, iconW, iconH);
    }

    // 6. Desenhar os TEXTOS NA BARRA (Direita)
    const textStartX = barX + 110; // Texto começa após o ícone
    ctx.textAlign = "left";

    // Nome (Branco e Negrito)
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(nome, textStartX, barY + 45); // Alinhado verticalmente

    // Cargo (Cinza Claro)
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#b0b0b0";
    ctx.fillText(cargo, textStartX, barY + 75); // Alinhado verticalmente

    // 7. Ativar Download
    const link = document.getElementById("download");
    link.href = canvas.toDataURL("image/png");
    link.style.display = "inline-block";
    link.innerText = "Baixar Imagem Pronta";
}
