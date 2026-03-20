const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 600;
const photoRadius = 280;

// CARREGAMENTO DE IMAGENS (Nomes conforme seu GitHub)
const kikkerIconCircle = new Image();
kikkerIconCircle.src = "kikker-icon-circle.png"; 

const backgroundCircuit = new Image();
backgroundCircuit.src = "background-circuit.png"; 

let userPhoto = new Image();
let photoLoaded = false;

// Evento de Upload da Foto do Colaborador
document.getElementById("uploadFoto").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        userPhoto = new Image();
        userPhoto.onload = () => { 
            photoLoaded = true;
            console.log("Foto do colaborador carregada!");
        };
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

    // 1. Limpar e desenhar Fundo
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Desenha o fundo de circuito se ele existir, senão usa branco
    if (backgroundCircuit.complete && backgroundCircuit.naturalWidth !== 0) {
        ctx.drawImage(backgroundCircuit, 0, 0, canvasSize, canvasSize);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    // 2. Desenhar a FOTO em MÁSCARA CIRCULAR
    ctx.save();
    ctx.beginPath();
    ctx.arc(300, 300, photoRadius, 0, Math.PI * 2); 
    ctx.closePath();
    ctx.clip(); 

    // Ajuste da foto (Cover)
    const ratio = Math.max(canvasSize / userPhoto.width, canvasSize / userPhoto.height);
    const w = userPhoto.width * ratio;
    const h = userPhoto.height * ratio;
    ctx.drawImage(userPhoto, (canvasSize - w) / 2, (canvasSize - h) / 2, w, h);
    ctx.restore(); 

    // 3. BARRA DE IDENTIFICAÇÃO (Cinza Escuro)
    const barX = 120; 
    const barY = 470; 
    const barW = 400; 
    const barH = 110; 

    ctx.fillStyle = "rgba(45, 45, 45, 0.95)"; 
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, barH / 2); 
    ctx.fill();

    // 4. ÍCONE DA KIKKER (Esquerda da Barra)
    if (kikkerIconCircle.complete && kikkerIconCircle.naturalWidth !== 0) {
        ctx.drawImage(kikkerIconCircle, barX + 5, barY + 5, 100, 100);
    }

    // 5. TEXTOS (Direita da Barra)
    const textStartX = barX + 115;
    ctx.textAlign = "left";

    // Nome (Branco)
    ctx.font = "bold 28px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(nome, textStartX, barY + 48); 

    // Cargo (Cinza Claro)
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#cccccc";
    ctx.fillText(cargo, textStartX, barY + 82); 

    // 6. Ativar Link de Download
    const link = document.getElementById("download");
    link.href = canvas.toDataURL("image/png");
    link.style.display = "inline-block";
    link.innerText = "Baixar Perfil";
}
