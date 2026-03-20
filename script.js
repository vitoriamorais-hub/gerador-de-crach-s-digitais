const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 600;
const photoRadius = 280;

// Imagens Base (certifique-se que os nomes no GitHub estão idênticos)
const kikkerIcon = new Image();
kikkerIcon.src = "kikker-icon-circle.png"; 

const backgroundCircuit = new Image();
backgroundCircuit.src = "background-circuit.png"; 

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
        alert("Por favor, selecione a foto do colaborador primeiro!");
        return;
    }

    const nome = document.getElementById("nomeColaborador").value || "Nome do Colaborador";
    const cargo = document.getElementById("cargoColaborador").value || "Marketing";

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // 1. Fundo (Circuitos ou Branco)
    if (backgroundCircuit.complete && backgroundCircuit.naturalWidth !== 0) {
        ctx.drawImage(backgroundCircuit, 0, 0, canvasSize, canvasSize);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    // 2. Foto com Máscara Circular
    ctx.save();
    ctx.beginPath();
    ctx.arc(300, 300, photoRadius, 0, Math.PI * 2);
    ctx.clip();
    const ratio = Math.max(canvasSize / userPhoto.width, canvasSize / userPhoto.height);
    const w = userPhoto.width * ratio;
    const h = userPhoto.height * ratio;
    ctx.drawImage(userPhoto, (canvasSize - w) / 2, (canvasSize - h) / 2, w, h);
    ctx.restore();

    // 3. Barra de Identificação (Estilo Pílula)
    const barX = 130;
    const barY = 480;
    const barW = 340;
    const barH = 90;

    ctx.fillStyle = "rgba(60, 60, 60, 0.9)";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 45); // Totalmente arredondada
    ctx.fill();

    // 4. Ícone da Kikker (Posicionado à esquerda na barra)
    if (kikkerIcon.complete && kikkerIcon.naturalWidth !== 0) {
        ctx.drawImage(kikkerIcon, barX + 5, barY + 5, 80, 80);
    }

    // 5. Textos (Alinhados ao lado do ícone)
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    
    // Nome
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(nome, barX + 95, barY + 40);

    // Cargo
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#cccccc";
    ctx.fillText(cargo, barX + 95, barY + 65);

    // 6. Ativar Link de Download
    const link = document.getElementById("download");
    link.href = canvas.toDataURL("image/png");
    link.style.display = "inline-block";
    link.innerText = "Baixar Crachá Digital";
}
