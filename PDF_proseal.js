function previewImage(event, previewId) {
        var reader = new FileReader();
        reader.onload = function() {
            var output = document.getElementById(previewId);
            output.src = reader.result;
            output.style.display = 'block';  // Mostrar la imagen al cargarla
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    // Asegúrate de que estas variables estén definidas globalmente
let yOffset = 37;
const marginLeft = 15;
const marginRight = 15;
let pageNumber = 1;
let pdf;


    document.getElementById("generarPDF").addEventListener("click", function() {
const { jsPDF } = window.jspdf;
const pdf = new jsPDF('p', 'mm', 'a4');


        // Inicializar número de página
        let pageNumber = 1;

        // Constantes para márgenes
        const marginLeft = 10;
        const marginRight = 10;
        const contentWidth = pdf.internal.pageSize.getWidth() - marginLeft - marginRight;

        // Función para agregar encabezado con imagen base64
function addHeader(pdf) {
const base64Img = 'encabezado.jpg';  // Reemplaza esto con tu imagen en base64

const pageWidth = pdf.internal.pageSize.getWidth();  // Obtener el ancho total de la página
const marginLeft = 5;  // Mínimo margen izquierdo
const marginRight = 5;  // Mínimo margen derecho

const imgWidth = pageWidth - marginLeft - marginRight;  // Ancho total de la imagen
const imgHeight = imgWidth * (5/ 38);  // Ajusta la proporción de la imagen según sea necesario (3:10 es solo un ejemplo)

const xPosition = marginLeft;  // Comienza desde el borde izquierdo con el margen mínimo
const yPosition = 5;  // Posición Y en la parte superior con un margen pequeño

// Agregar la imagen al PDF 
pdf.addImage(base64Img, 'PNG', xPosition, yPosition, imgWidth, imgHeight);

}

        // Función para agregar pie de página
        function addFooter(pdf, pageNumber) {
            const pageHeight = pdf.internal.pageSize.getHeight();
            pdf.setDrawColor(0);
            pdf.setDrawColor(0, 255, 0); // Bordes naranjas
            pdf.setLineWidth(0.5);
            pdf.line(marginLeft, pageHeight - 20, pdf.internal.pageSize.getWidth() - marginRight, pageHeight - 20);
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text("Página " + pageNumber, pdf.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
        }

        // Función para agregar una nueva página
        function addNewPage(pdf) {
            pdf.addPage();
            pageNumber++;
            addHeader(pdf);
            addFooter(pdf, pageNumber);
            yOffset = 37;
        }


        // Inicializar yOffset para la posición del contenido
        let yOffset = 37;
        addHeader(pdf);
        addFooter(pdf, pageNumber);

        function agregarPagina1() {
            
            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0);  // negro
pdf.text("Informe de Servicio Tecnico", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
yOffset += 10;
pdf.setFontSize(14);

// Datos de la primera línea: Planta, Tipo de Servicio y Fecha
const planta = `Planta: ${document.getElementById("planta").value}`;
const tipoServicio = `Tipo de Servicio: ${document.getElementById("tipo_servicio").value}`;
const fecha = `Fecha: ${document.getElementById("fecha").value}`;

// Encabezado y datos para la tabla
const encabezado = [['Planta', 'Tipo de Servicio', 'Fecha']];
const cuerpo = [[
document.getElementById("planta").value,
document.getElementById("tipo_servicio").value,
document.getElementById("fecha").value
]];

// Configuración de la tabla con encabezado verde
pdf.autoTable({
startY: yOffset, // Posición vertical de inicio
head: encabezado, // Encabezado de la tabla
body: cuerpo, // Cuerpo de la tabla con los datos
margin: { left: 10, right: 10},
styles: {
    fontSize: 10, // Tamaño de fuente general
    halign: 'center', // Alineación del texto en el centro
    valign: 'middle', // Alineación vertical al centro
    cellPadding: 1.5, // Espacio dentro de cada celda
},
headStyles: {
    fillColor: [0, 205, 0], // Fondo verde para el encabezado
    textColor: [255, 255, 255], // Texto blanco en el encabezado
    cellPadding: 1,
    halign: 'center', // Alineación horizontal centrada para los encabezados
    fontSize: 12, // Tamaño de fuente para el encabezado
    fontStyle: 'bold' // Negrita para el encabezado
},
theme: 'striped' // Tema de la tabla con filas alternadas
});

yOffset += 22; // Espacio después de la tabla


// Segunda línea como tabla con fondo verde
const modelo = document.getElementById("modelo").value;
const maquina = document.getElementById("Maquina").value;
const marca = document.getElementById("Marca").value;
const numeroSerie = document.getElementById("numero_serie").value;
const año = document.getElementById("Año").value;

// Configuración de la tabla con fondo verde
pdf.autoTable({
    startY: yOffset, // Posición vertical de inicio
    head: [['Modelo', 'Maquina', 'Marca', 'N.º de Serie', 'Año']], // Encabezado
    body: [[modelo, maquina, marca, numeroSerie, año]], // Datos
    margin: { 
    top: 10,      // Margen superior
    bottom: 10,   // Margen inferior
    left: 10,     // Margen izquierdo
    right: 10     // Margen derecho
},
    styles: {
        fontSize: 10, // Tamaño de fuente general
        halign: 'center', // Alineación del texto en el centro
        valign: 'middle', // Alineación vertical en el medio de la celda
        cellPadding: 1.5, // Reducción del espacio dentro de cada celda para ajustar la separación
    },
    headStyles: {
        fillColor: [0, 205, 0], // Fondo verde para el encabezado
        textColor: [255, 255, 255], // Texto blanco en el encabezado
        halign: 'center', // Alineación horizontal centrada para los encabezados
        fontSize: 12, // Tamaño de fuente para el encabezado
        
        cellPadding: 1, // Reducción del espacio dentro del encabezado
    },
    theme: 'striped', // Tema de la tabla con filas alternadas
    columnStyles: {
        0: { cellWidth: 38 }, // Ancho fijo para la columna 'Modelo'
        1: { cellWidth: 38 }, // Ancho fijo para la columna 'N.º de Serie'
        2: { cellWidth: 38 }, // Ancho fijo para la columna 'Máquina'
        3: { cellWidth: 38 }, // Ancho fijo para la columna 'Marca'
        4: { cellWidth: 38 }, // Ancho fijo para la columna 'Año'
    }
});

yOffset = pdf.lastAutoTable.finalY + 10; // Ajustar el yOffset después de la tabla

// Obtener el texto de la descripción
let descripcionText = document.getElementById("descripcion").value;

// Usar autoTable para agregar la descripción
pdf.autoTable({
    startY: yOffset,
    head: [['Descripción']],
    body: [[descripcionText]],
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
    },
    columnStyles: {
        0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 }, // Ajustar al ancho de la página
    },
    margin: { left: 10, right: 10 }, // Márgenes laterales
});

// Actualizar yOffset en función de la altura de la tabla
yOffset = pdf.lastAutoTable.finalY + 8; // Espacio adicional después de la tabla



pdf.setFontSize(14);
pdf.text(
"Maquina a inspeccionar",
pdf.internal.pageSize.getWidth() / 2,yOffset,{ align: "center" });
yOffset += 2;


// Función para agregar la imagen en la página 1
function agregarImagenPagina1(callback) {
const imagenElement = document.getElementById("imagen5"); // Imagen del campo 'imagen5'

if (imagenElement.files.length > 0) {
    const file = imagenElement.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            // Ajustar tamaño de la imagen y calcular la posición para centrarla
            const imgWidth = img.width;
            const imgHeight = img.height;
            const ratio = Math.min(150 / imgWidth, 105 / imgHeight); // Ajustar proporciones
            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;

            // Calcular la posición X para centrar la imagen en la página
            const pageWidth = pdf.internal.pageSize.getWidth();
            const xPosition = (pageWidth - newWidth) / 2; // Centrando la imagen horizontalmente
            const yPosition = 150; // Posición Y fija debajo del texto

            // Insertar la imagen en la posición centrada
            pdf.addImage(img, 'JPEG', xPosition, yPosition, newWidth, newHeight);
            callback();
        };
    };
    reader.readAsDataURL(file);
} else {
    callback(); // Continuar si no hay imagen seleccionada
}
}

// Llamar a la función para agregar la imagen debajo de "Maquina a inspeccionar"
agregarImagenPagina1(function() {
        // Después de la imagen, continuar con la página 2

       
        agregarPagina2();
    });
}

function agregarPagina2() {
    // Crear nueva página intermedia
    addNewPage(pdf);

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);  // Texto negro
    pdf.text("Resumen ejecutivo", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
    yOffset += 25;

    // Agregar "Estado de entrega de máquina"
    let estadoEntregaText = document.getElementById("estadoEntrega").value;

    pdf.autoTable({
        startY: yOffset,
        head: [['Estado de entrega de máquina']],
        body: [[estadoEntregaText]],
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
        },
        columnStyles: {
            0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 },
        },
        margin: { left: 10, right: 10 },
    });

    yOffset = pdf.lastAutoTable.finalY + 10; // Actualizar yOffset

    // Agregar "Tareas realizadas"
    let tareasRealizadasText = document.getElementById("tareasRealizadas").value;

    pdf.autoTable({
        startY: yOffset,
        head: [['Tareas realizadas']],
        body: [[tareasRealizadasText]],
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
        },
        columnStyles: {
            0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 },
        },
        margin: { left: 10, right: 10 },
    });

    yOffset = pdf.lastAutoTable.finalY + 10; // Actualizar yOffset

    // Agregar "Observación de operadores o mantenimiento"
    let masText = document.getElementById("masTexto").value;

    pdf.autoTable({
        startY: yOffset,
        head: [['Observación de operadores o mantenimiento']],
        body: [[masText]],
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
        },
        columnStyles: {
            0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 },
        },
        margin: { left: 10, right: 10 },
    });

    yOffset = pdf.lastAutoTable.finalY + 10; // Actualizar yOffset

    
    // Continuar con la siguiente página
    agregarPagina3(); // Llamar a la función que agrega la página 2
}



        function agregarPagina3() {
addNewPage(pdf);
pdf.setFontSize(14);
pdf.setTextColor(0, 0, 0);  // negro
            pdf.text("Revisión Estructural", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
            yOffset += 8;

            const revisionHead = [['Limpieza', 'Estado de cintas', 'Tableros de control', 'Motores', 'Sistema neumático', 'Estado matriz']];
            const revisionBody = [
                [
                    
                    document.querySelector('input[name="limpieza"]').checked ? 'OK' : 'X',
                    document.querySelector('input[name="estado_cintas"]').checked ? 'OK' : 'X',
                    document.querySelector('input[name="tableros_control"]').checked ? 'OK' : 'X',
                    document.querySelector('input[name="motores"]').checked ? 'OK' : 'X',
                    document.querySelector('input[name="sistema_neumatico"]').checked ? 'OK' : 'X',
                    document.querySelector('input[name="estado_matriz"]').checked ? 'OK' : 'X',
                   
                ]
            ];

            pdf.autoTable({
head: revisionHead,
body: revisionBody,
startY: yOffset, // Posición vertical de inicio
margin: { 
    top: 10,      // Margen superior
    bottom: 10,   // Margen inferior
    left: 10,     // Margen izquierdo
    right: 10     // Margen derecho
},
styles: { 
    fontSize: 10,               // Tamaño de fuente general
    halign: 'center',           // Alineación del texto en el centro
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [205, 205,205],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
headStyles: { 
    fillColor: [0, 205, 0],     // Fondo del encabezado (verde)
    textColor: [255, 255, 255], // Texto del encabezado (blanco)
    cellPadding: 1,
    fontSize: 12,               // Tamaño de fuente del encabezado
    fontStyle: 'bold'           // Negrita para el encabezado
    
},
bodyStyles: { 
    fillColor: [245, 245, 245], // Fondo del cuerpo (gris claro)
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [0, 0, 0],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
alternateRowStyles: { 
    fillColor: [220, 220, 220]  // Fondo alternado (gris oscuro)
},
theme: 'grid', // Tema de la tabla con bordes visibles
});


yOffset = pdf.lastAutoTable.finalY + 10;

            yOffset = pdf.lastAutoTable.finalY + 10;

            pdf.setFontSize(14);
pdf.text("Revisión de Puertas", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
yOffset += 8;

const puertasHead = [['Zona de puerta', 'Estado', 'Estatus', 'Observación', 'Recomendación']];
const puertasBody = [];
const totalPuertas = 11;
const nombresPuertas = [
'Puerta frontal',
'Puerta trasera',
'Puerta salida superior',
'Puerta entrada superior',
'Puerta entrada inferior',
'Puerta frontal inferior',
'Puerta trasera inferior',
'Puerta salida delantera inferior',
'Puerta salida trasera inferior',
'Puerta entrada superior 2',
'Puerta entrada trasera inferior'
];

for (let i = 1; i <= totalPuertas; i++) {
const estadoPuertaEl = document.querySelector(`input[name="estado_puerta_${i}"]`);
const estatusPuertaEl = document.querySelector(`select[name="estatus_puerta_${i}"]`);
const observacionPuertaEl = document.querySelector(`input[name="observacion_puerta_${i}"]`);
const recomendacionPuertaEl = document.querySelector(`input[name="recomendacion_puerta_${i}"]`);

puertasBody.push([
    nombresPuertas[i - 1],
    estadoPuertaEl && estadoPuertaEl.checked ? 'OK' : 'Malo',
    estatusPuertaEl ? estatusPuertaEl.value : '',
    observacionPuertaEl ? observacionPuertaEl.value : '',
    recomendacionPuertaEl ? recomendacionPuertaEl.value : ''
]);
}


// Cambiar los colores de la tabla
pdf.autoTable({
head: puertasHead,
body: puertasBody,
startY: yOffset, // Posición vertical de inicio
margin: { 
    top: 10,       // Margen superior
    bottom: 10,    // Margen inferior
    left: 10,      // Margen izquierdo
    right: 10      // Margen derecho
},
styles: { 
    fontSize: 10,               // Tamaño de fuente general
    halign: 'center',           // Alineación del texto en el centro
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [205, 205,205],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
headStyles: { 
    fillColor: [0, 205, 0],     // Fondo del encabezado (verde)
    textColor: [255, 255, 255], // Texto del encabezado (blanco)
    cellPadding: 1,
    fontSize: 12,               // Tamaño de fuente del encabezado
    fontStyle: 'bold'           // Negrita para el encabezado
    
},
bodyStyles: { 
    fillColor: [245, 245, 245], // Fondo del cuerpo (gris claro)
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [0, 0, 0],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
alternateRowStyles: { 
    fillColor: [220, 220, 220]  // Fondo alternado (gris oscuro)
},
theme: 'grid', // Tema de la tabla con bordes visibles
});


yOffset = pdf.lastAutoTable.finalY + 10;


pdf.setFontSize(14);
pdf.text("Safety Relay y Parada de Emergencia", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
yOffset += 8;

const safetyHead = [['Elemento', 'Estado', 'Observación', 'Recomendación']];
const safetyBody = [
[
    'Safety Relay',
    document.querySelector('select[name="estado_safety_relay"]').value,
    document.querySelector('input[name="observacion_safety_relay"]').value,
    document.querySelector('input[name="recomendacion_safety_relay"]').value
],
[
    'Parada de Emergencia',
    document.querySelector('select[name="estado_parada_emergencia"]').value,
    document.querySelector('input[name="observacion_parada_emergencia"]').value,
    document.querySelector('input[name="recomendacion_parada_emergencia"]').value
],
[
    'Interruptor Principal',
    document.querySelector('select[name="estado_interruptor_principal"]').value,
    document.querySelector('input[name="observacion_interruptor_principal"]').value,
    document.querySelector('input[name="recomendacion_interruptor_principal"]').value
]
];

// Cambiar los colores de la tabla

pdf.autoTable({
head: safetyHead,
body: safetyBody,
startY: yOffset, // Posición vertical de inicio
margin: { 
    top: 10,       // Margen superior
    bottom: 10,    // Margen inferior
    left: 10,      // Margen izquierdo
    right: 10      // Margen derecho
},
styles: { 
    fontSize: 10,               // Tamaño de fuente general
    halign: 'center',           // Alineación del texto en el centro
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [205, 205,205],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
headStyles: { 
    fillColor: [0, 205, 0],     // Fondo del encabezado (verde)
    textColor: [255, 255, 255], // Texto del encabezado (blanco)
    cellPadding: 1,
    fontSize: 12,               // Tamaño de fuente del encabezado
    fontStyle: 'bold'           // Negrita para el encabezado
    
},
bodyStyles: { 
    fillColor: [245, 245, 245], // Fondo del cuerpo (gris claro)
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [0, 0, 0],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
alternateRowStyles: { 
    fillColor: [220, 220, 220]  // Fondo alternado (gris oscuro)
},
theme: 'grid', // Tema de la tabla con bordes visibles
});


yOffset = pdf.lastAutoTable.finalY + 10;


            yOffset = pdf.lastAutoTable.finalY + 10;

agregarPagina4();
}

        function agregarPagina4() {
// Página 3: Registro Fotográfico y Observación
addNewPage(pdf); // Iniciar nueva página
pdf.setFontSize(14);
pdf.setTextColor(0, 0, 0);  // negro
pdf.text("Registro Fotográfico", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
yOffset += 10;

const imagenes = [
    document.getElementById("imagen1"),
    document.getElementById("imagen2"),
    document.getElementById("imagen3"),
    document.getElementById("imagen4")
];

const textosImagenes = [
    "Señal PLC puertas abiertas",
    "Señal PLC puertas cerradas",
    "Alarma de puertas abiertas",
    "Maquina con puertas abiertas"
];

let imagenIndex = 0;

function agregarImagenesRegistroFotografico() {
const columnas = 2; // 2 imágenes por fila
const espacio = 10; // Espacio entre las imágenes
const bordeWidth = (pdf.internal.pageSize.getWidth() - 2 * marginLeft - (columnas - 1) * espacio) / columnas; // Ancho del borde
const bordeHeight = bordeWidth * 0.75; // Mantener proporción 4:3

function agregarImagen(imagen, texto, xPosition, yPosition, width, height, callback) {
// Dibujar borde temporal de prueba (borde rojo)
pdf.setDrawColor(0, 155, 0); // Color rojo para el borde
pdf.setLineWidth(1); 
pdf.rect(xPosition, yPosition, width, height); // Dibujar el borde de la imagen

const file = imagen.files[0]; // Obtener el archivo de imagen
if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const imgWidth = img.width;
            const imgHeight = img.height;
            const ratio = Math.min((width * 0.9) / imgWidth, (height * 0.9) / imgHeight); // Reducir tamaño al 90%
            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;
            const offsetX = (width - newWidth) / 2;
            const offsetY = (height - newHeight) / 2;

            // Insertar imagen
            pdf.addImage(img, 'JPEG', xPosition + offsetX, yPosition + offsetY, newWidth, newHeight);

            // Agregar texto debajo de la imagen
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0); // Color del texto
            const textYPosition = yPosition + height + 5; // Posición Y del texto
            pdf.text(texto, xPosition + width / 2, textYPosition, { align: 'center' });

            callback();
        };
    };
    reader.readAsDataURL(file);
} else {
    // Si no se pudo cargar la imagen, mostrar un mensaje en el centro del borde rojo
    pdf.setFontSize(10);
    pdf.setTextColor(255, 0, 0); // Texto rojo para indicar error
    pdf.text("Imagen no cargada", xPosition + width / 2, yPosition + height / 2, { align: 'center' });

    // Agregar texto debajo del recuadro de imagen
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // Texto normal
    const textYPosition = yPosition + height + 5;
    pdf.text(texto, xPosition + width / 2, textYPosition, { align: 'center' });

    callback();
}
}

function agregarImagenes() {
    if (imagenIndex < imagenes.length) {
        let fila = Math.floor(imagenIndex / columnas); // Determinar la fila
        let columna = imagenIndex % columnas; // Determinar la columna

        let xPosition = marginLeft + columna * (bordeWidth + espacio); // Posición horizontal del borde
        let yPosition = yOffset + fila * (bordeHeight + 30); // Posición vertical del borde (incluyendo espacio para el texto)

        let imagen = imagenes[imagenIndex];
        let texto = textosImagenes[imagenIndex]; // Obtener el texto correspondiente

        // Insertar la imagen y el texto
        agregarImagen(imagen, texto, xPosition, yPosition, bordeWidth, bordeHeight, function () {
            imagenIndex++;
            if (imagenIndex % columnas === -15 && columna === columnas - 1) {
                yOffset += bordeHeight + 1; // Ajustar la posición vertical después de cada fila
            }
            agregarImagenes(); // Llamada recursiva para agregar la siguiente imagen
        });
    } else {
        // Continuar con el resto del PDF cuando se han insertado todas las imágenes
        yOffset += bordeHeight + 100 + 15; // Ajustar después de agregar la última fila de imágenes
        agregarObservacionFotografico(); // Pasar a la siguiente sección
    }
}

agregarImagenes(); // Iniciar la inserción de imágenes
}


function agregarObservacionFotografico() {
    pdf.setFontSize(12);
    yOffset += 5; // Reducir el espacio entre imágenes y la tabla de observación

    // Obtener el texto de observación del campo correspondiente
    let observacionFotografico = document.getElementById("observacion_fotografico").value;

    // Usar autoTable para agregar la observación
    pdf.autoTable({
        startY: yOffset,
        head: [['Observación Fotográfica']], // Encabezado de la tabla
        body: [[observacionFotografico]], // Contenido de la observación
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
        },
        columnStyles: {
            0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 }, // Ajustar al ancho de la página
        },
        margin: { left: 10, right: 10 }, // Márgenes laterales
    });

    // Ajustar yOffset después de la tabla
    yOffset = pdf.lastAutoTable.finalY + 10; // Espacio adicional después de la tabla

    // Continuar con la siguiente sección del PDF
    agregarPagina5(); // Llama a la siguiente función que necesites
}

agregarImagenesRegistroFotografico();
}

function agregarPagina5() {
// Página 4: Fotografía Termográfica y Registro Fotográfico de Componentes
addNewPage(pdf); 
pdf.setFontSize(14);
pdf.setTextColor(0, 0, 0); // Texto color naranja
pdf.text("FOTOGRAFÍAS TERMOGRÁFICAS", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
yOffset += 10;

// Encabezado de la tabla


// Obtener los valores del formulario para la tabla termográfica
const termograficaBody = [
['Contactor', document.querySelector('input[name="temperatura_contactor"]').value || 'N/A', '75°C'],
['Relé de estado sólido', document.querySelector('input[name="temperatura_rele_estado_solido"]').value || 'N/A', '50°C'],
['Servo amplificador', document.querySelector('input[name="temperatura_servo_amplificador"]').value || 'N/A', '70°C'],
['Safety Relay', document.querySelector('input[name="temperatura_safety_relay_comp"]').value || 'N/A', '55°C'],
['VDF', document.querySelector('input[name="temperatura_vdf"]').value || 'N/A', '70°C'],
['PLC', document.querySelector('input[name="temperatura_plc"]').value || 'N/A', '55°C'],
['Relé 24 VDC', document.querySelector('input[name="temperatura_rele_24vdc"]').value || 'N/A', '70°C'],
['Power Supply', document.querySelector('input[name="temperatura_power_supply"]').value || 'N/A', '70°C']
];

// Generar la tabla en el PDF utilizando autoTable
pdf.autoTable({
head: [['Componente', 'Temperatura (°C)', 'Rango de maximo (°C)']],
body: termograficaBody,
startY: yOffset, // Posición vertical de inicio
margin: { 
    top: 10,      // Margen superior
    bottom: 10,   // Margen inferior
    left: 15,     // Margen izquierdo
    right: 15     // Margen derecho
},
styles: { 
    fontSize: 10,               // Tamaño de fuente general
    halign: 'center',           // Alineación del texto en el centro
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [205, 205,205],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
headStyles: { 
    fillColor: [0, 205, 0],     // Fondo del encabezado (verde)
    textColor: [255, 255, 255], // Texto del encabezado (blanco)
    cellPadding: 1,
    fontSize: 12,               // Tamaño de fuente del encabezado
    fontStyle: 'bold'           // Negrita para el encabezado
    
},
bodyStyles: { 
    fillColor: [245, 245, 245], // Fondo del cuerpo (gris claro)
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [0, 0, 0],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
alternateRowStyles: { 
    fillColor: [220, 220, 220]  // Fondo alternado (gris oscuro)
},
theme: 'grid', // Tema de la tabla con bordes visibles
columnStyles: {
    0: { cellWidth: 60 }, // Ancho para la columna de componentes
    1: { cellWidth: 60 }, // Ancho para la temperatura ingresada
    2: { cellWidth: 60 }  // Ancho para el rango de trabajo máximo
}
});

// Ajustar yOffset después de la tabla
yOffset = pdf.lastAutoTable.finalY + 10;



// Si yOffset está cerca del final, agregar una nueva página
if (yOffset > pdf.internal.pageSize.getHeight() - 100) {
    addNewPage(pdf);
    
}

// Sección de imágenes
yOffset += 10;
pdf.setFontSize(14);
pdf.setTextColor(0, 0, 0); // Texto naranja
pdf.text("REGISTRO FOTOGRÁFICO DE COMPONENTES", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
yOffset += 10;

const componentesImagenes = [
{ id: "imagen_contactor", label: "Contactor" },
{ id: "imagen_rele_estado_solido", label: "Relé de Estado Sólido" },
{ id: "imagen_servo_amplificador", label: "Servo Amplificador" },
{ id: "imagen_safety_relay_comp", label: "Safety Relay" },
{ id: "imagen_vdf", label: "VDF" },
{ id: "imagen_plc", label: "PLC" },
{ id: "imagen_rele_24vdc", label: "Relé 24 VDC" },
{ id: "imagen_power_supply", label: "Power Supply" }
];

let componenteIndex = 0;

function agregarImagenesDeComponentes() {
const columnas = 4; // 4 imágenes por fila
const filas = 2; // 2 filas de imágenes
const espacio = 5; // Espacio entre las imágenes
const bordeWidth = (pdf.internal.pageSize.getWidth() - 2 * marginLeft - (columnas - 1) * espacio) / columnas; // Ancho del borde
const bordeHeight = bordeWidth * 0.75; // Mantener proporción 4:3

function agregarImagen(componente, xPosition, yPosition, width, height, callback) {
    const imagenElement = document.getElementById(componente.id);
    const file = imagenElement.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                // Ajustar tamaño de la imagen y centrarla
                const imgWidth = img.width;
                const imgHeight = img.height;
                const ratio = Math.min((width * 0.9) / imgWidth, (height * 0.9) / imgHeight); // Reducir tamaño al 90%
                const newWidth = imgWidth * ratio;
                const newHeight = imgHeight * ratio;
                const offsetX = (width - newWidth) / 2;
                const offsetY = (height - newHeight) / 2;

                // Insertar imagen
                pdf.addImage(img, 'JPEG', xPosition + offsetX, yPosition + offsetY, newWidth, newHeight);

                // Añadir etiqueta debajo de la imagen
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                pdf.text(componente.label, xPosition + width / 2, yPosition + height + 5, { align: 'center' });

                callback();
            };
        };
        reader.readAsDataURL(file);
    } else {
        callback();
    }
}

function agregarImagenes() {
    if (componenteIndex < componentesImagenes.length) {
        let fila = Math.floor(componenteIndex / columnas); // Determinar la fila
        let columna = componenteIndex % columnas; // Determinar la columna

        let xPosition = marginLeft + columna * (bordeWidth + espacio); // Posición horizontal del borde
        let yPosition = yOffset + fila * (bordeHeight + 15 + espacio); // Posición vertical del borde

        // Dibujar borde alrededor de la imagen
        pdf.setDrawColor(0, 155, 0); // Color negro
        pdf.setLineWidth(0.5); // Ancho de línea para el borde
        pdf.rect(xPosition, yPosition, bordeWidth, bordeHeight); // Dibujar el borde

        let componente = componentesImagenes[componenteIndex];

        // Insertar la imagen dentro del cuadro y centrarla
        agregarImagen(componente, xPosition, yPosition, bordeWidth, bordeHeight, function() {
            componenteIndex++;
            if (componenteIndex % columnas === 0 && fila === filas - 1) {
                yOffset += bordeHeight + 15 + espacio; // Ajustar la posición vertical después de cada fila
            }
            agregarImagenes(); // Llamada recursiva para agregar la siguiente imagen
        });
    } else {
        // Continuar con el resto del PDF cuando se han insertado todas las imágenes
        yOffset += bordeHeight + 5 + espacio; // Ajustar después de agregar la última fila de imágenes
        agregarObservacionComponentes(); // Pasar a la siguiente sección
    }
}

agregarImagenes(); // Iniciar la inserción de imágenes
}

function agregarObservacionComponentes() {
    // Obtener el texto de la observación de componentes
    let observacionComponentesText = document.getElementById("observacion_componentes").value;

    // Usar autoTable para agregar la observación
    pdf.autoTable({
        startY: yOffset,
        head: [['Observación de Componentes']], // Encabezado de la tabla
        body: [[observacionComponentesText]], // Contenido de la observación
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
        },
        columnStyles: {
            0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 }, // Ancho de la columna
        },
        margin: { left: 10, right: 10 }, // Márgenes
    });

    // Actualizar yOffset después de la tabla
    yOffset = pdf.lastAutoTable.finalY + 10; // Espacio adicional después de la tabla

    // Continuar con la siguiente sección
    agregarPagina6(); // Llama a la siguiente función que necesites
}

agregarImagenesDeComponentes();
}


 function agregarPagina6() {
          addNewPage(pdf);
         pdf.setFontSize(16);
         pdf.setTextColor(0, 0, 0);  // negro
pdf.text("Reporte Diagnóstico", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
yOffset += 10;

const diagnosticoHead = [['Componente', 'Detalle' ,  'Diagnóstico', 'Acción Correctiva', 'Observación']];
const diagnosticoBody = [
    [
        'Actuador de sello',
        document.querySelector('select[name="detalle_actuador"]').value,
        document.querySelector('select[name="Diagnostico_actuador"]').value,
        document.querySelector('select[name="accion_correctiva_actuador"]').value,
        document.querySelector('input[name="observacion_actuador"]').value
    ],
    [
        'Cintas de entrada',
        document.querySelector('select[name="detalle_cintas_entrada"]').value,
        document.querySelector('select[name="Diagnostico_cintas_entrada"]').value,
        document.querySelector('select[name="accion_correctiva_cintas_entrada"]').value,
        document.querySelector('input[name="observacion_cintas_entrada"]').value
    ],
    [
        'Cintas de salida',
        document.querySelector('select[name="detalle_cintas_salida"]').value,
        document.querySelector('select[name="Diagnostico_cintas_salida"]').value,
        document.querySelector('select[name="accion_correctiva_cintas_salida"]').value,
        document.querySelector('input[name="observacion_cintas_salida"]').value
    ],
    [
        'Tablero',
        document.querySelector('select[name="detalle_tablero"]').value,
        document.querySelector('select[name="Diagnostico_tablero"]').value,
        document.querySelector('select[name="accion_correctiva_tablero"]').value,
        document.querySelector('input[name="observacion_tablero"]').value
    ],
    [
        'Matriz',
        document.querySelector('select[name="detalle_matriz"]').value,
        document.querySelector('select[name="Diagnostico_matriz"]').value,
        document.querySelector('select[name="accion_correctiva_matriz"]').value,
        document.querySelector('input[name="observacion_matriz"]').value
    ],
    [
        'Pantalla HMI',
        document.querySelector('select[name="detalle_pantalla_hmi"]').value,
        document.querySelector('select[name="Diagnostico_pantalla_hmi"]').value,
        document.querySelector('select[name="accion_correctiva_pantalla_hmi"]').value,
        document.querySelector('input[name="observacion_pantalla_hmi"]').value
    ],
    [
        'Rebobinador de film',
        document.querySelector('select[name="detalle_rebobinador_de_film"]').value,
        document.querySelector('select[name="Diagnostico_rebobinador_de_film"]').value,
        document.querySelector('select[name="accion_correctiva_rebobinador_de_film"]').value,
        document.querySelector('input[name="observacion_rebobinador_de_film"]').value
    ],
    [
        'Alimentacion de film',
        document.querySelector('select[name="detalle_alimentacion_de_film"]').value,
        document.querySelector('select[name="Diagnostico_alimentacion_de_film"]').value,
        document.querySelector('select[name="accion_correctiva_alimentacion_de_film"]').value,
        document.querySelector('input[name="observacion_alimentacion_de_film"]').value
    ],
    [
        'Estacion de sello',
        document.querySelector('select[name="detalle_estacion_de_sello"]').value,
        document.querySelector('select[name="Diagnostico_estacion_de_sello"]').value,
        document.querySelector('select[name="accion_correctiva_estacion_de_sello"]').value,
        document.querySelector('input[name="observacion_estacion_de_sello"]').value

    ],

];

// Cambiar los colores de la tabla
pdf.autoTable({
head: diagnosticoHead,
body: diagnosticoBody,
startY: yOffset, // Posición vertical de inicio
margin: { 
    top: 10,      // Margen superior
    bottom: 10,   // Margen inferior
    left: 10,     // Margen izquierdo
    right: 10     // Margen derecho
},
styles: { 
    fontSize: 10,               // Tamaño de fuente general
    halign: 'center',           // Alineación del texto en el centro
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [205, 205,205],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
headStyles: { 
    fillColor: [0, 205, 0],     // Fondo del encabezado (verde)
    textColor: [255, 255, 255], // Texto del encabezado (blanco)
    cellPadding: 1,
    fontSize: 12,               // Tamaño de fuente del encabezado
    fontStyle: 'bold'           // Negrita para el encabezado
    
},
bodyStyles: { 
    fillColor: [245, 245, 245], // Fondo del cuerpo (gris claro)
    textColor: [0, 0, 0],       // Texto negro
    lineColor: [0, 0, 0],       // Borde negro
    lineWidth: 0.1              // Ancho del borde
},
alternateRowStyles: { 
    fillColor: [220, 220, 220]  // Fondo alternado (gris oscuro)
},
theme: 'grid', // Tema de la tabla con bordes visibles
});


            yOffset = pdf.lastAutoTable.finalY + 10;

            if (yOffset > pdf.internal.pageSize.getHeight() - 60) {
                addNewPage(pdf);
            }

            pdf.setFontSize(12);
yOffset += 8; // Reducir el espacio entre imágenes y observación

let observacionText = document.getElementById("observacion_final").value;

pdf.autoTable({
    startY: yOffset,
    head: [['Observación']],
    body: [[observacionText]],
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
    },
    columnStyles: {
        0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 },
    },
    margin: { left: 10, right: 10 },
});

yOffset = pdf.lastAutoTable.finalY + 10;



agregarPagina7();  // Continuar con la siguiente página
}


function agregarPagina7() {
    // Definir las imágenes de la máquina (imagen6 - imagen11)
    const imagenesMaquina = [
        document.getElementById("imagen6"),
        document.getElementById("imagen7"),
        document.getElementById("imagen8"),
        document.getElementById("imagen9"),
        document.getElementById("imagen10"),
        document.getElementById("imagen11"),
    ];

    // Obtener los textos introducidos por el usuario para cada imagen
    const textosImagenesMaquina = [
        document.getElementById("texto_imagen6") ? document.getElementById("texto_imagen6").value : "",
        document.getElementById("texto_imagen7") ? document.getElementById("texto_imagen7").value : "",
        document.getElementById("texto_imagen8") ? document.getElementById("texto_imagen8").value : "",
        document.getElementById("texto_imagen9") ? document.getElementById("texto_imagen9").value : "",
        document.getElementById("texto_imagen10") ? document.getElementById("texto_imagen10").value : "",
        document.getElementById("texto_imagen11") ? document.getElementById("texto_imagen11").value : "",
    ];

    // Comprobar si al menos una imagen de la máquina ha sido seleccionada
    const hayImagenesMaquina = imagenesMaquina.some(function (input) {
        return input && input.files && input.files.length > 0;
    });

    // Imágenes adicionales agregadas dinámicamente (a partir de imagen12)
    const imagenesAdicionales = [...document.querySelectorAll('.image-upload input[type="file"]')].filter(function (input) {
        const id = input.id;
        if (id && id.startsWith('imagen')) {
            const num = parseInt(id.replace('imagen', ''), 10);
            return num >= 12;
        }
        return false;
    });

    // Obtener los textos para las imágenes adicionales
    const textosImagenesAdicionales = imagenesAdicionales.map((img) => {
        const num = parseInt(img.id.replace('imagen', ''), 10);
        const textoElement = document.getElementById(`texto_imagen${num}`);
        return textoElement ? textoElement.value : `Texto para Imagen ${num}`;
    });

    // Comprobar si hay imágenes adicionales seleccionadas
    const hayImagenesAdicionales = imagenesAdicionales.some(function (input) {
        return input && input.files && input.files.length > 0;
    });

    // Si hay imágenes de la máquina o imágenes adicionales, procedemos a agregar la página y las imágenes
    if (hayImagenesMaquina || hayImagenesAdicionales) {
        // Agregar nueva página
        addNewPage(pdf);
        yOffset = 37; // Reiniciar yOffset después de agregar una nueva página

        pdf.setFontSize(14);
        pdf.text("Registro Fotográfico de Máquina", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
        yOffset += 8;

        // Función para agregar imágenes de la máquina
        function agregarImagenesMaquina(callback) {
            if (hayImagenesMaquina) {
                let imagenMaquinaIndex = 0;
                const columnas = 2; // 2 imágenes por fila
                const espacio = 10; // Espacio entre las imágenes
                const pageWidth = pdf.internal.pageSize.getWidth();
                const borderWidth = (pageWidth - 2 * marginLeft - (columnas -1) * espacio) / columnas;
                const borderHeight = borderWidth * 0.75; // Mantener proporción 4:3

                function agregarImagen(imagenInput, texto, xPosition, yPosition, width, height, callback) {
                    // Dibujar borde
                    pdf.setDrawColor(0, 155, 0); // Color verde para el borde
                    pdf.setLineWidth(1);
                    pdf.rect(xPosition, yPosition, width, height); // Dibujar el borde de la imagen

                    const file = imagenInput.files[0]; // Obtener el archivo de imagen
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const img = new Image();
                            img.src = event.target.result;
                            img.onload = function () {
                                const imgWidth = img.width;
                                const imgHeight = img.height;
                                const ratio = Math.min((width * 0.9) / imgWidth, (height * 0.9) / imgHeight); // Reducir tamaño al 90%
                                const newWidth = imgWidth * ratio;
                                const newHeight = imgHeight * ratio;
                                const offsetX = (width - newWidth) / 2;
                                const offsetY = (height - newHeight) / 2;

                                // Insertar imagen
                                pdf.addImage(img, 'JPEG', xPosition + offsetX, yPosition + offsetY, newWidth, newHeight);

                                // Agregar texto debajo de la imagen
                                pdf.setFontSize(10);
                                pdf.setTextColor(0, 0, 0); // Color del texto
                                const textYPosition = yPosition + height + 5; // Posición Y del texto
                                pdf.text(texto, xPosition + width / 2, textYPosition, { align: 'center' });

                                callback();
                            };
                            img.onerror = function (error) {
                                console.error('Error cargando imagen:', error);
                                callback();
                            };
                        };
                        reader.onerror = function (error) {
                            console.error('Error leyendo archivo:', error);
                            callback();
                        };
                        reader.readAsDataURL(file);
                    } else {
                        // Si no se pudo cargar la imagen, proceder
                        callback();
                    }
                }

                function agregarImagenes() {
                    if (imagenMaquinaIndex < imagenesMaquina.length) {
                        const imagenInput = imagenesMaquina[imagenMaquinaIndex];
                        if (imagenInput && imagenInput.files && imagenInput.files.length > 0) {
                            const fila = Math.floor(imagenMaquinaIndex / columnas);
                            const columna = imagenMaquinaIndex % columnas;
                            const xPosition = marginLeft + columna * (borderWidth + espacio);
                            const yPosition = yOffset + fila * (borderHeight + espacio + 5);
                            const texto = textosImagenesMaquina[imagenMaquinaIndex];

                            agregarImagen(imagenInput, texto, xPosition, yPosition, borderWidth, borderHeight, function () {
                                imagenMaquinaIndex++;
                                agregarImagenes(); // Llamada recursiva para agregar la siguiente imagen
                            });
                        } else {
                            // Si no hay imagen seleccionada, pasar a la siguiente
                            imagenMaquinaIndex++;
                            agregarImagenes(); // Llamada recursiva para agregar la siguiente imagen
                        }
                    } else {
                        // Ajustar yOffset después de agregar las imágenes
                        const totalRows = Math.ceil(imagenMaquinaIndex / columnas);
                        yOffset += totalRows * (borderHeight + espacio + 5);
                        callback(); // Continuar con imágenes adicionales
                    }
                }

                agregarImagenes(); // Iniciar la inserción de imágenes
            } else {
                // Si no hay imágenes de la máquina, continuar con las imágenes adicionales
                callback();
            }
        }

        // Función para agregar imágenes adicionales
        function agregarImagenesAdicionales(callback) {
            if (hayImagenesAdicionales) {
                addNewPage(pdf);
                yOffset = 37; // Reiniciar yOffset al valor inicial para la nueva página
                let imagenIndex = 0;
                const maxImagenesPorPagina = 6; // Máximo de imágenes por página
                const columnas = 2; // 2 imágenes por fila
                const espacio = 10; // Espacio entre las imágenes
                const pageWidth = pdf.internal.pageSize.getWidth();
                const borderWidth = (pageWidth - 2 * marginLeft - (columnas - 1) * espacio) / columnas;
                const borderHeight = borderWidth * 0.75; // Mantener proporción 4:3

                function agregarImagen(imagenInput, texto, xPosition, yPosition, width, height, callback) {
                    // Dibujar borde
                    pdf.setDrawColor(0, 155, 0); // Color verde para el borde
                    pdf.setLineWidth(1);
                    pdf.rect(xPosition, yPosition, width, height); // Dibujar el borde de la imagen

                    const file = imagenInput.files[0]; // Obtener el archivo de imagen
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const img = new Image();
                            img.src = event.target.result;
                            img.onload = function () {
                                const imgWidth = img.width;
                                const imgHeight = img.height;
                                const ratio = Math.min((width * 0.9) / imgWidth, (height * 0.9) / imgHeight); // Reducir el tamaño al 90%
                                const newWidth = imgWidth * ratio;
                                const newHeight = imgHeight * ratio;
                                const offsetX = (width - newWidth) / 2;
                                const offsetY = (height - newHeight) / 2;

                                // Insertar imagen
                                pdf.addImage(img, 'JPEG', xPosition + offsetX, yPosition + offsetY, newWidth, newHeight);

                                // Agregar texto debajo de la imagen
                                pdf.setFontSize(10);
                                pdf.setTextColor(0, 0, 0); // Color del texto
                                const textYPosition = yPosition + height + 5; // Posición Y del texto
                                pdf.text(texto, xPosition + width / 2, textYPosition, { align: 'center' });

                                callback();
                            };
                            img.onerror = function (error) {
                                console.error('Error cargando imagen:', error);
                                callback();
                            };
                        };
                        reader.onerror = function (error) {
                            console.error('Error leyendo archivo:', error);
                            callback();
                        };
                        reader.readAsDataURL(file);
                    } else {
                        // Si no se pudo cargar la imagen, proceder
                        callback();
                    }
                }

                function agregarImagenes() {
                    if (imagenIndex < imagenesAdicionales.length) {
                        const imagenInput = imagenesAdicionales[imagenIndex];
                        if (imagenInput && imagenInput.files && imagenInput.files.length > 0) {
                            if (imagenIndex > 0 && imagenIndex % maxImagenesPorPagina === 0) {
                                // Crear nueva página si se excede el máximo de imágenes por página
                                addNewPage(pdf);
                                yOffset = 37; // Reiniciar yOffset al valor inicial para la nueva página
                            }

                            const indexInPage = imagenIndex % maxImagenesPorPagina;
                            const fila = Math.floor(indexInPage / columnas);
                            const columna = indexInPage % columnas;
                            const xPosition = marginLeft + columna * (borderWidth + espacio);
                            const yPosition = yOffset + fila * (borderHeight + espacio + 5);
                            const texto = textosImagenesAdicionales[imagenIndex];

                            agregarImagen(imagenInput, texto, xPosition, yPosition, borderWidth, borderHeight, function () {
                                imagenIndex++;
                                agregarImagenes();
                            });
                        } else {
                            imagenIndex++;
                            agregarImagenes();
                        }
                    } else {
                        // Actualizar yOffset después de agregar las imágenes adicionales
                        const imagesInLastPage = imagenesAdicionales.length % maxImagenesPorPagina || maxImagenesPorPagina;
                        const rowsInLastPage = Math.ceil(imagesInLastPage / columnas);
                        yOffset += rowsInLastPage * (borderHeight + espacio + 5);
                        callback();
                    }
                }

                agregarImagenes();
            } else {
                callback();
            }
        }

        // Iniciar el proceso de agregar imágenes
        agregarImagenesMaquina(function () {
            agregarImagenesAdicionales(function () {
                agregarObservacionMaquina(); // Continuar con la siguiente sección
            });
        });
    } else {
        // Si no hay imágenes, proceder directamente a la siguiente sección
        agregarObservacionMaquina();
    }
}

  

function agregarObservacionMaquina() {
    agregarPagina8();  // Continuar con la siguiente página



function agregarPagina8() {
// Crear nueva página intermedia
addNewPage(pdf);
// Descripción con recuadro
let conclusionText = document.getElementById("conclusion").value;

        pdf.autoTable({
            startY: yOffset,
            head: [['Conclusión']],
            body: [[conclusionText]],
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
            },
            columnStyles: {
                0: { cellWidth: pdf.internal.pageSize.getWidth() - 20 },
            },
            margin: { left: 10, right: 10 },
        });

        yOffset = pdf.lastAutoTable.finalY + 10;


// Nombre de documento
const nombreArchivo = document.getElementById("nombre_documento").value || "formulario servicio tecnico"; // Valor predeterminado si está vacío

// Guardar el PDF con el nombre proporcionado
pdf.save(nombreArchivo + ".pdf");
}



agregarImagenesMaquina();
}


        agregarPagina1();
    });

    function agregarImagenesAdicionales() {
        let imagenIndex = 0;
        const maxImagenesPorPagina = 6; // Máximo de imágenes por página
        const imagenes = [...document.querySelectorAll('.image-upload input[type="file"]')];
        const textosImagenes = imagenes.map((img, idx) => `Texto para Imagen ${idx + 1}`);
        
        function agregarImagenes() {
            if (imagenIndex < imagenes.length) {
                if (imagenIndex > 0 && imagenIndex % maxImagenesPorPagina === 0) {
                    // Si ya se agregaron 6 imágenes, crea una nueva página
                    addNewPage(pdf);
                    yOffset = 10; // Restablecer el yOffset al principio de la nueva página
                }
    
                // Agregar imagen como en la página 7
                let fila = Math.floor(imagenIndex / 2);
                let columna = imagenIndex % 2;
    
                let xPosition = marginLeft + columna * (bordeWidth + espacio);
                let yPosition = yOffset + fila * (bordeHeight + 15 + espacio);
    
                let imagen = imagenes[imagenIndex];
                let texto = textosImagenes[imagenIndex];
    
                agregarImagen(imagen, texto, xPosition, yPosition, bordeWidth, bordeHeight, function() {
                    imagenIndex++;
                    agregarImagenes(); // Llamada recursiva
                });
            }
        }
    
        agregarImagenes();
    }

    function addImageToPDF(pdf, inputFileElement, x, y, width, height, callback) {
        const file = inputFileElement.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function() {
                    let imgWidth = img.width;
                    let imgHeight = img.height;
                    let ratio = Math.min(width / imgWidth, height / imgHeight);
                    let newWidth = imgWidth * ratio;
                    let newHeight = imgHeight * ratio;
                    pdf.addImage(img, x, y, newWidth, newHeight);
                    callback();
                }
            }
            reader.readAsDataURL(file);
        } else {
            callback();
        }
    }
