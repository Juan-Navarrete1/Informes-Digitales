// Function to initialize the signature canvas
function iniciarCanvasFirma(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    let dibujando = false;

    const obtenerPosicion = (e) => {
        const tipoEvento = e.type.includes('touch') ? 'touch' : 'mouse';
        if (tipoEvento === 'mouse') {
            return { x: e.offsetX, y: e.offsetY };
        } else {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
    };

    const iniciarDibujo = (e) => {
        e.preventDefault();
        dibujando = true;
        const pos = obtenerPosicion(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const dibujar = (e) => {
        if (!dibujando) return;
        e.preventDefault();
        const pos = obtenerPosicion(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const finalizarDibujo = (e) => {
        if (!dibujando) return;
        e.preventDefault();
        dibujando = false;
        ctx.closePath();
    };

    canvas.addEventListener('mousedown', iniciarDibujo);
    canvas.addEventListener('mousemove', dibujar);
    canvas.addEventListener('mouseup', finalizarDibujo);
    canvas.addEventListener('mouseout', finalizarDibujo);

    canvas.addEventListener('touchstart', iniciarDibujo);
    canvas.addEventListener('touchmove', dibujar);
    canvas.addEventListener('touchend', finalizarDibujo);
}

window.onload = function() {
    iniciarCanvasFirma('firmaTecnico');
    iniciarCanvasFirma('firmaCliente');
}

// Function to read files as Data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
        } else {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        }
    });
}

// Function to capture form data
function captureFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked ? '✓' : '✗';
        } else if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
    return formData;
}



// Variables for PDF generation
let yOffset = 37;
const marginLeft = 15;
const marginRight = 15;
let pageNumber = 1;
let pdf;

document.getElementById('btnGenerarPDF').addEventListener('click', async function() {
    const { jsPDF } = window.jspdf;
    pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    yOffset = addHeader(pdf);
    pageNumber = 1;
    addFooter(pdf, pageNumber);

    const data = captureFormData();

    data.imagen1 = document.getElementById('imagen1').files[0];
    data.imagen2 = document.getElementById('imagen2').files[0];

    function checkPageBreak(spaceNeeded) {
        if (yOffset + spaceNeeded > pageHeight - 20) {
            addNewPage();
        }
    }

    function addHeader(pdf) {
        const base64Img = 'logosma.jpeg'; // Ruta o base64 de la imagen
        const marginLeftHeader = 5; // Margen desde el borde izquierdo
        const marginTopHeader = 5;  // Margen desde el borde superior
        const imgWidth = 40;        // Ancho fijo para la imagen
        const imgHeight = 30;       // Altura proporcional a tu diseño
    
        pdf.addImage(base64Img, 'JPEG', marginLeftHeader, marginTopHeader, imgWidth, imgHeight);
    
        return marginTopHeader + imgHeight - 12; // Devuelve el espacio ocupado por el encabezado
    }
    

    function addFooter(pdf, pageNumber) {
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Página ${pageNumber}`, pdf.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
    }

    function addNewPage() {
        pdf.addPage();
        pageNumber++;
        yOffset = addHeader(pdf);
        addFooter(pdf, pageNumber);
    }

    await agregarPagina1();

    async function agregarPagina1() {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("ORDEN DE SERVICIO ELECTRÓNICA (OS-e)", pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 10;

        // Información General
        checkPageBreak(30);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Información General", pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 7;

        pdf.autoTable({
            startY: yOffset,
            head: [['FOLIO N°', 'FECHA', 'CLIENTE', 'SOLICITADO POR']],
            body: [[data.folio || '', data.fecha || '', data.cliente || '', data.solicitado_por || '']],
            margin: { left: marginLeft, right: marginRight },
            styles: { fontSize: 10, halign: 'center' },
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            theme: 'striped',
        });
        yOffset = pdf.lastAutoTable.finalY + 10;

        pdf.autoTable({
            startY: yOffset,
            head: [['TIPO DE SERVICIO', 'OT CLIENTE', 'MARCA', 'HORÓMETRO/CICLOS']],
            body: [[data.tipo_servicio || '', data.ot_cliente || '', data.marca || '', data.horometro || '']],
            margin: { left: marginLeft, right: marginRight },
            styles: { fontSize: 10, halign: 'center' },
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            theme: 'striped',
        });
        yOffset = pdf.lastAutoTable.finalY + 10;

        // Falla Reportada por Cliente
       

        const fallaText = data.falla_reportada || '';
        pdf.autoTable({
            startY: yOffset,
            head: [['Falla Reportada']],
            body: [[fallaText]],
            theme: 'striped',
            styles: {
                cellPadding: 5,
                fontSize: 10,
                valign: 'top',
                halign: 'left',
                textColor: [0, 0, 0],
                lineColor: [0, 205, 0],
                lineWidth: 0.5,
                fillColor: [255, 255, 255],
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                cellPadding: 1.5,
                fontStyle: 'bold',
                halign: 'center',
                lineColor: [255, 255, 255],
                lineWidth: 0.5,
                fontSize: 12,
            },
            margin: { left: marginLeft, right: marginRight },
        });
        yOffset = pdf.lastAutoTable.finalY + 10;

        // Check List
        checkPageBreak(10);
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);  // Negro
        pdf.text("Check List - Inspección Visual Primaria", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
        yOffset += 10;
        
        // Encabezado de la tabla
        const checklistHead = [['Inspeccion visual primaria', 'OK', 'Detalles']];
        
        // Cuerpo de la tabla basado en los valores del HTML
        const checklistBody = [
            ['Revisión estructura', document.querySelector('#estructura_ok').checked ? 'OK' : 'No', document.querySelector('#estructura_detalles').value || ''],
            ['Revisión cintas', document.querySelector('#cintas_ok').checked ? 'OK' : 'No', document.querySelector('#cintas_detalles').value || ''],
            ['Revisión pantalla', document.querySelector('#pantalla_ok').checked ? 'OK' : 'No', document.querySelector('#pantalla_detalles').value || ''],
            ['Revisión sist. Seguridad', document.querySelector('#seguridad_ok').checked ? 'OK' : 'No', document.querySelector('#seguridad_detalles').value || ''],
            ['Piezas en posición', document.querySelector('#piezas_ok').checked ? 'OK' : 'No', document.querySelector('#piezas_detalles').value || ''],
            ['Limpieza', document.querySelector('#limpieza_ok').checked ? 'OK' : 'No', document.querySelector('#limpieza_detalles').value || ''],
            ['Insumo original', document.querySelector('#insumo_ok').checked ? 'OK' : 'No', document.querySelector('#insumo_detalles').value || '']
        ];
        
        // Configuración de la tabla en el PDF
        pdf.autoTable({
            head: checklistHead,
            body: checklistBody,
            startY: yOffset, // Posición inicial de la tabla
            margin: { 
                left: 15,  // Margen izquierdo de 10
                right: 15  // Margen derecho de 10
            },
            styles: { fontSize: 9, halign: 'center' },            // Ancho del borde
            
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',      // Negrita para el encabezado
            },
           
            
            theme: 'striped', // Tema con bordes visibles
            columnStyles: { 
                0: { cellWidth: 60 },  // Ancho para la columna "INSPECCIÓN VISUAL PRIMARIA"
                1: { cellWidth: 20 },  // Ancho para la columna "OK"
                2: { cellWidth: 100 }   // Ancho para la columna "Detalles"
            }
        });
        

        
        
       
        yOffset = pdf.lastAutoTable.finalY + 10;

        // Código y Descripción
        checkPageBreak(10);
        pdf.setFontSize(12);
        pdf.text("Repuestos", pageWidth / 2, yOffset,  { align: 'center' });
        yOffset += 7;

        pdf.autoTable({
            startY: yOffset,
            head: [['Código', 'Descripción', 'Cantidad', 'Documento']],
            body: [
                [data.codigo1 || '', data.descripcion1 || '', data.cantidad1 || '', data.despacho1 || ''],
                [data.codigo2 || '', data.descripcion2 || '', data.cantidad2 || '', data.despacho2 || '']
            ],
            margin: { left: marginLeft, right: marginRight },
            styles: { fontSize: 9, halign: 'center' },
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            theme: '',
        });
        yOffset = pdf.lastAutoTable.finalY + 10;

        await agregarPagina2();
    }

    async function agregarPagina2() {
        addNewPage();
        
        const pageWidth = pdf.internal.pageSize.getWidth();

        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("ORDEN DE SERVICIO ELECTRÓNICA (OS-e)", pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 10;

        // Diagnóstico y Observaciones
        checkPageBreak(40);
    
        const diagnosticoText = data.diagnostico_observaciones || '';
        pdf.autoTable({
            startY: yOffset,
            head: [['Diagnóstico y Observaciones']],
            body: [[diagnosticoText]],
            theme: 'striped',
            styles: {
                cellPadding: 5,
                fontSize: 10,
                valign: 'top',
                halign: 'left',
                textColor: [0, 0, 0],
                lineColor: [0, 205, 0],
                lineWidth: 0.5,
                fillColor: [255, 255, 255],
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                cellPadding: 1.5,
                fontStyle: 'bold',
                halign: 'center',
                lineColor: [255, 255, 255],
                lineWidth: 0.5,
                fontSize: '12',
                
            },
            columnStyles: {
                0: { cellWidth: pageWidth - marginLeft - marginRight },
            },
            margin: { left: marginLeft, right: marginRight },
        });
        yOffset = pdf.lastAutoTable.finalY + 10;

        // Trabajo Desarrollado
        checkPageBreak(40);
      
        const trabajoText = data.trabajo_desarrollado || '';
        pdf.autoTable({
            startY: yOffset,
            head: [['Trabajo Desarrollado']],
            body: [[trabajoText]],
            fontStyle: 'bold',
            
            theme: 'striped',
            styles: {
                cellPadding: 5,
                fontSize: 10,
                valign: 'top',
                halign: 'left',
                textColor: [0, 0, 0],
                lineColor: [0, 205, 0],
                lineWidth: 0.5,
                fillColor: [255, 255, 255],
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                cellPadding: 1.5,
                fontStyle: 'bold',
                halign: 'center',
                lineColor: [255, 255, 255],
                lineWidth: 0.5,
                fontSize: '12',
            },
            columnStyles: {
                0: { cellWidth: pageWidth - marginLeft - marginRight },
            },
            margin: { left: marginLeft, right: marginRight },
        });
        yOffset = pdf.lastAutoTable.finalY + 10;

      // Imágenes Usuario
if (data.imagen1 || data.imagen2) {
    checkPageBreak(90);
    pdf.setFontSize(14);
    pdf.text("Registro Fotográfico", pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;

    const imageWidth = (pageWidth - marginLeft - marginRight - 20) / 2; // Ajustar ancho con márgenes
    const imageHeight = 70; // Mantener proporción para un diseño limpio
    const spacing = 20; // Espacio entre imágenes

    pdf.setDrawColor(0, 155, 0); // Cambiar color del borde a verde
    pdf.setLineWidth(1); // Ajustar grosor del borde

    if (data.imagen1) {
        const dataURL1 = await readFileAsDataURL(data.imagen1);
        if (dataURL1) {
            // Dibujar borde y agregar imagen
            const xPosition1 = marginLeft;
            const yPosition1 = yOffset;
            pdf.rect(xPosition1, yPosition1, imageWidth, imageHeight);
            pdf.addImage(dataURL1, 'JPEG', xPosition1 + 5, yPosition1 + 5, imageWidth - 10, imageHeight - 10); // Espaciado interno

            // Agregar texto debajo de la imagen
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0); // Color negro para el texto
            const textYPosition1 = yPosition1 + imageHeight + 5; // Posición del texto
            pdf.text(data.imagen1_text || "Sin descripción", xPosition1 + imageWidth / 2, textYPosition1, { align: 'center' });
        }
    }

    if (data.imagen2) {
        const dataURL2 = await readFileAsDataURL(data.imagen2);
        if (dataURL2) {
            // Dibujar borde y agregar imagen
            const xPosition2 = marginLeft + imageWidth + spacing;
            const yPosition2 = yOffset;
            pdf.rect(xPosition2, yPosition2, imageWidth, imageHeight);
            pdf.addImage(dataURL2, 'JPEG', xPosition2 + 5, yPosition2 + 5, imageWidth - 10, imageHeight - 10); // Espaciado interno

            // Agregar texto debajo de la imagen
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0); // Color negro para el texto
            const textYPosition2 = yPosition2 + imageHeight + 5; // Posición del texto
            pdf.text(data.imagen2_text || "Sin descripción", xPosition2 + imageWidth / 2, textYPosition2, { align: 'center' });
        }
    }

    yOffset += imageHeight + 30; // Incrementar posición vertical después de las imágenes y texto
}



        await agregarPagina3();
    }

    async function agregarPagina3() {
        addNewPage();
        const pageWidth = pdf.internal.pageSize.getWidth();

        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("ORDEN DE SERVICIO ELECTRÓNICA (OS-e)", pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 10;

        // Registro de Tiempos
        checkPageBreak(30);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Registro de Tiempos", pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 7;

        pdf.autoTable({
            startY: yOffset,
            head: [['Salida ST', 'Llegada a Planta', 'Salida de Planta', 'Llegada a ST']],
            body: [[data.salida_st || '', data.llegada_planta || '', data.salida_planta || '', data.llegada_st || '']],
            margin: { left: marginLeft, right: marginRight },
            styles: { fontSize: 10, halign: 'center' },
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: '12',
            },
            theme: 'striped',
        });
        yOffset = pdf.lastAutoTable.finalY + 20;

        // Información de Ingenieros
        checkPageBreak(40);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Información de Ingenieros", pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 7;

        pdf.autoTable({
            startY: yOffset,
            head: [['Ingeniero 1','Ingeniero 2', 'Nombre cliente', 'Contacto Email']],
            body: [[data.ingeniero1 || '',data.ingeniero2 || '' ,data.nombre2 || '', data.email2 || '']],
            margin: { left: marginLeft, right: marginRight },
            styles: { fontSize: 10, halign: 'center' },
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: '12',
            },
            theme: 'striped'
        });

        yOffset = pdf.lastAutoTable.finalY + 20;

        // Firmas
checkPageBreak(60);

const signatureWidth = 60;
const signatureHeight = 30;
const spaceBetweenSignatures = 40; // Espacio entre las firmas (ajustado para mayor separación)
const totalSignatureWidth = signatureWidth * 2 + spaceBetweenSignatures;
const startX = (pageWidth - totalSignatureWidth) / 2;

pdf.setDrawColor(0, 0, 0);
pdf.setLineWidth(0.5);

// Firma Técnico
const canvasTecnico = document.getElementById('firmaTecnico');
const dataURLTecnico = canvasTecnico.toDataURL('image/png');
pdf.rect(startX, yOffset, signatureWidth, signatureHeight);
pdf.addImage(dataURLTecnico, 'PNG', startX, yOffset, signatureWidth, signatureHeight);
pdf.text("Firma Técnico", startX + signatureWidth / 2, yOffset + signatureHeight + 10, { align: 'center' });

// Firma Cliente
const canvasCliente = document.getElementById('firmaCliente');
const dataURLCliente = canvasCliente.toDataURL('image/png');
pdf.rect(startX + signatureWidth + spaceBetweenSignatures, yOffset, signatureWidth, signatureHeight);
pdf.addImage(dataURLCliente, 'PNG', startX + signatureWidth + spaceBetweenSignatures, yOffset, signatureWidth, signatureHeight);
pdf.text("Firma Cliente", startX + signatureWidth + spaceBetweenSignatures + signatureWidth / 2, yOffset + signatureHeight + 10, { align: 'center' });

// Ajustar espacio vertical para las firmas
yOffset += signatureHeight + 40; // Ajustar espacio vertical después de las firmas

pdf.setFontSize(9);
const infoText = "SERVICIO TÉCNICO SMARTPACK \nCAUPOLICAN 9241 BODEGA D\nQUILICURA";
const textLines = pdf.splitTextToSize(infoText, pageWidth - marginLeft - marginRight);
pdf.text(textLines, pageWidth / 2, yOffset, { align: 'center' });
yOffset += textLines.length * 10;


const logos = [
    { src: 'proseal.jpg', stretch: true },
    { src: 'ravenwood.jpg', stretch: false },
    { src: 'carsoe.jpg', stretch: false },
    { src: 'crm.jpg', stretch: false },
    { src: 'cabinplan.jpg', stretch: false },
    { src: 'vc999.jpg', stretch: true },
    { src: 'solutek.jpg', stretch: false },
    { src: 'stalam.jpg', stretch: true },
    { src: 'kolbe.jpg', stretch: true }
];

const logoWidth = 25; // Ancho estándar
const logoHeight = 25; // Alto estándar
const stretchedWidth = 50; // Ancho para imágenes estiradas
const logosPerRow = 5;

// Reducir el espacio horizontal entre imágenes
const spacingX = 5; // Espaciado fijo entre imágenes (reducido a 5px)
let logoX = marginLeft;
let logoY = yOffset;

for (let i = 0; i < logos.length; i++) {
    const logo = logos[i];
    const imgData = await getImageData(logo.src);
    if (imgData) {
        // Ajustar ancho y alto según si la imagen debe estirarse
        const currentWidth = logo.stretch ? stretchedWidth : logoWidth;
        const currentHeight = logoHeight;

        // Añadir la imagen al PDF
        pdf.addImage(imgData, 'PNG', logoX, logoY, currentWidth, currentHeight);
    }
    // Ajustar posición horizontal
    logoX += (logo.stretch ? stretchedWidth : logoWidth) + spacingX;

    // Pasar a la siguiente fila si es necesario
    if ((i + 1) % logosPerRow === 0) {
        logoX = marginLeft;
        logoY += logoHeight + 5; // Reducir el espaciado vertical a 5px
    }
}



        yOffset = logoY + logoHeight + 8;
        guardarPDF();
    }

    function getImageData(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = function () {
                resolve(null);
            };
            img.src = url;
        });
    }

    function guardarPDF() {
        const fileName = `${data.folio || 'Folio'}_${data.cliente || 'Cliente'}.pdf`;
        pdf.save(fileName);
    }
});
