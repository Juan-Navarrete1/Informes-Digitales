// PDF_emergencia.js

document.getElementById("generarPDF").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imagenCount = 11; // Ajusta este valor si tienes más imágenes

    let yOffset = 37;
    let pageNumber = 1;
    const marginLeft = 10;
    const marginRight = 10;

    // Función para agregar encabezado con imagen
    function addHeader(pdf, callback) {
        const imgUrl = 'encabezado.jpg';  // Reemplaza esto con la ruta correcta de tu imagen

        const img = new Image();
        img.crossOrigin = 'Anonymous';  // Necesario si la imagen está en otro dominio
        img.onload = function() {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - marginLeft - marginRight;
            const imgHeight = (imgWidth * img.height) / img.width;
            pdf.addImage(img, 'PNG', marginLeft, 5, imgWidth, imgHeight);
            callback();
        };
        img.onerror = function() {
            console.error('Error cargando la imagen del encabezado.');
            callback(); // Continuar incluso si hay un error
        };
        img.src = imgUrl;
    }

    // Función para agregar pie de página
    function addFooter(pdf, pageNumber) {
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setDrawColor(0, 255, 0); // Bordes verdes
        pdf.setLineWidth(0.5);
        pdf.line(marginLeft, pageHeight - 20, pdf.internal.pageSize.getWidth() - marginRight, pageHeight - 20);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text("Página " + pageNumber, pdf.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
    }

    // Función para agregar una nueva página
    function addNewPage(pdf, callback) {
        pdf.addPage();
        pageNumber++;
        yOffset = 37;
        addHeader(pdf, function() {
            addFooter(pdf, pageNumber);
            callback();
        });
    }

    // Función principal para generar el PDF
    function generatePDF() {
        addHeader(pdf, function() {
            addFooter(pdf, pageNumber);
            agregarPagina1();
        });
    }

    // Función para agregar contenido a la página 1
    function agregarPagina1() {
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);  // Negro
        pdf.text("Informe de Servicio Técnico", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
        yOffset += 10;
        pdf.setFontSize(14);

        // Datos de la primera línea: Planta, Tipo de Servicio y Fecha
        const encabezado = [['Planta', 'Tipo de Servicio', 'Fecha']];
        const cuerpo = [[
            document.getElementById("planta").value,
            document.getElementById("tipo_servicio").value,
            document.getElementById("fecha").value
        ]];

        // Configuración de la tabla con encabezado verde
        pdf.autoTable({
            startY: yOffset,
            head: encabezado,
            body: cuerpo,
            margin: { left: 10, right: 10 },
            styles: {
                fontSize: 10,
                halign: 'center',
                valign: 'middle',
                cellPadding: 1.5,
            },
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                cellPadding: 1,
                halign: 'center',
                fontSize: 12,
                fontStyle: 'bold'
            },
            theme: 'striped'
        });

        yOffset = pdf.lastAutoTable.finalY + 10;

        // Segunda línea como tabla con fondo verde
        const modelo = document.getElementById("modelo").value;
        const maquina = document.getElementById("Maquina").value;
        const marca = document.getElementById("Marca").value;
        const numeroSerie = document.getElementById("numero_serie").value;
        const anio = document.getElementById("Año").value;

        pdf.autoTable({
            startY: yOffset,
            head: [['Modelo', 'Máquina', 'Marca', 'N.º de Serie', 'Año']],
            body: [[modelo, maquina, marca, numeroSerie, anio]],
            margin: { left: 10, right: 10 },
            styles: {
                fontSize: 10,
                halign: 'center',
                valign: 'middle',
                cellPadding: 1.5,
            },
            headStyles: {
                fillColor: [0, 205, 0],
                textColor: [255, 255, 255],
                halign: 'center',
                fontSize: 12,
                cellPadding: 1,
            },
            theme: 'striped',
            columnStyles: {
                0: { cellWidth: 38 },
                1: { cellWidth: 38 },
                2: { cellWidth: 38 },
                3: { cellWidth: 38 },
                4: { cellWidth: 38 },
            }
        });

        yOffset = pdf.lastAutoTable.finalY + 10;

        // Agregar la descripción como tabla
        let observacionText = document.getElementById("descripcion").value;

        pdf.autoTable({
            startY: yOffset,
            head: [['Descripción']],
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

        pdf.setFontSize(14);
        pdf.text(
            "Máquina a inspeccionar",
            pdf.internal.pageSize.getWidth() / 2, yOffset, { align: "center" }
        );
        yOffset += 6;

        // Función para agregar la imagen en la página 1
        function agregarImagenPagina1() {
            const imagenElement = document.getElementById("imagen5"); // Imagen del campo 'imagen5'

            if (imagenElement.files.length > 0) {
                const file = imagenElement.files[0];
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        // Ajustar tamaño de la imagen y calcular la posición para centrarla
                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        const ratio = Math.min(150 / imgWidth, 105 / imgHeight);
                        const newWidth = imgWidth * ratio;
                        const newHeight = imgHeight * ratio;

                        // Calcular la posición X para centrar la imagen en la página
                        const pageWidth = pdf.internal.pageSize.getWidth();
                        const xPosition = (pageWidth - newWidth) / 2;
                        const yPosition = yOffset;

                        // Insertar la imagen en la posición centrada
                        pdf.addImage(img, 'JPEG', xPosition, yPosition, newWidth, newHeight);

                        yOffset += newHeight + 10;

                        agregarPagina2(); // Continuar con la página 2
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                agregarPagina2(); // Continuar con la página 2 si no hay imagen
            }
        }

        agregarImagenPagina1();
    }

    // Función para agregar la página 2 con Solicitud y Trabajo Desarrollado
    function agregarPagina2() {
        // Agregar nueva página
        addNewPage(pdf, function() {
            // Agregar la "Solicitud" como tabla
            let solicitudText = document.getElementById("Solicitud").value;

            pdf.autoTable({
                startY: yOffset,
                head: [['Solicitud']],
                body: [[solicitudText]],
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

            // Agregar "Trabajo Desarrollado" como tabla
            let trabajoDesarrolladoText = document.getElementById("trabajo_desarrollado").value;

            pdf.autoTable({
                startY: yOffset,
                head: [['Trabajo Desarrollado']],
                body: [[trabajoDesarrolladoText]],
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

            agregarPagina3(); // Continuar con la página 3
        });
    }

    function agregarPagina3() {
        // Aquí agregamos la lógica para las imágenes y las conclusiones
        // Definir las imágenes de la máquina (imagen6 - imagenN)
        const imagenesMaquina = [];
        const textosImagenesMaquina = [];

        for (let i = 6; i <= imagenCount; i++) {
            const imagenInput = document.getElementById(`imagen${i}`);
            if (imagenInput) {
                imagenesMaquina.push(imagenInput);
                const textoInput = document.getElementById(`texto_imagen${i}`);
                textosImagenesMaquina.push(textoInput ? textoInput.value : "");
            }
        }

        // Comprobar si hay imágenes para agregar
        const hayImagenes = imagenesMaquina.some(input => input.files.length > 0);

        if (hayImagenes) {
            // Agregar nueva página
            addNewPage(pdf, function() {
                pdf.setFontSize(14);
                pdf.text("Registro Fotográfico", pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
                yOffset += 10;

                let maxRowHeight = 0; // Variable para controlar la altura máxima de la fila

                // Función para agregar imágenes
                function agregarImagenesMaquina(index) {
                    if (index >= imagenesMaquina.length) {
                        agregarConclusiones(); // Después de las imágenes, agregar conclusiones
                        return;
                    }

                    const imagenInput = imagenesMaquina[index];
                    const texto = textosImagenesMaquina[index];

                    if (imagenInput.files.length > 0) {
                        const file = imagenInput.files[0];
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            const img = new Image();
                            img.onload = function() {
                                // Ajustar tamaño y posición
                                const spacingBetweenImages = 10;
                                const margin = 5; // Margen dentro del rectángulo

                                const pageWidth = pdf.internal.pageSize.getWidth();
                                const availableWidth = pageWidth - marginLeft - marginRight;
                                const maxWidth = (availableWidth - spacingBetweenImages) / 2;
                                const maxHeight = 100; // Altura máxima disponible para cada imagen

                                const availableWidthForImage = maxWidth - 2 * margin;
                                const availableHeightForImage = maxHeight - 2 * margin;

                                // Calcular la relación de aspecto para mantener las proporciones
                                const ratio = Math.min(availableWidthForImage / img.width, availableHeightForImage / img.height);

                                const newWidth = img.width * ratio;
                                const newHeight = img.height * ratio;

                                // Dimensiones del rectángulo que contendrá la imagen
                                const rectWidth = maxWidth;
                                const rectHeight = maxHeight;

                                // Posición del rectángulo
                                const xRect = marginLeft + (index % 2) * (rectWidth + spacingBetweenImages);
                                const yRect = yOffset;

                                // Posición de la imagen dentro del rectángulo
                                const xImg = xRect + (rectWidth - newWidth) / 2;
                                const yImg = yRect + (rectHeight - newHeight) / 2;

                                // Dibujar el rectángulo verde
                                pdf.setDrawColor(0, 205, 0); // Color del borde (verde)
                                pdf.setLineWidth(0.5); // Ancho del borde
                                pdf.rect(xRect, yRect, rectWidth, rectHeight);

                                // Agregar la imagen dentro del rectángulo
                                pdf.addImage(img, 'JPEG', xImg, yImg, newWidth, newHeight);

                                // Agregar el texto debajo del rectángulo
                                pdf.setFontSize(10);
                                const textYPosition = yRect + rectHeight + 5;
                                pdf.text(texto, xRect + rectWidth / 2, textYPosition, { align: 'center' });

                                // Calcular la altura total incluyendo el texto y márgenes
                                const totalHeight = rectHeight + 5 + 5; // Altura del rectángulo + espacio para el texto + margen adicional

                                // Actualizar la altura máxima de la fila
                                maxRowHeight = Math.max(maxRowHeight, totalHeight);

                                // Después de cada dos imágenes o si es la última imagen, actualizar yOffset y reiniciar maxRowHeight
                                if (index % 2 === 1 || index === imagenesMaquina.length - 1) {
                                    yOffset += maxRowHeight + 5; // Ajustar yOffset después de una fila de imágenes
                                    maxRowHeight = 0; // Reiniciar para la siguiente fila
                                }

                                // Verificar si es necesario agregar una nueva página
                                if (yOffset > pdf.internal.pageSize.getHeight() - 50) {
                                    addNewPage(pdf, function() {
                                        agregarImagenesMaquina(index + 1);
                                    });
                                } else {
                                    agregarImagenesMaquina(index + 1);
                                }
                            };
                            img.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        agregarImagenesMaquina(index + 1);
                    }
                }

                agregarImagenesMaquina(0);
            });
        } else {
            agregarConclusiones(); // Si no hay imágenes, continuar con las conclusiones
        }
    }

    function agregarConclusiones() {
        // Agregar una nueva página para las conclusiones si es necesario
        if (yOffset > pdf.internal.pageSize.getHeight() - 50) {
            addNewPage(pdf, function() {
                agregarTextoConclusion();
            });
        } else {
            agregarTextoConclusion();
        }
    }

    function agregarTextoConclusion() {
        // Agregar una nueva página para las conclusiones si es necesario
        addNewPage(pdf, function() {
            // Agregar encabezado y pie de página en la nueva página
            addHeader(pdf, function() {
                addFooter(pdf, pageNumber);
    
                // Agregar la conclusión como tabla
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
    
                // Finalizar y guardar el PDF
                const nombreDocumento = document.getElementById("nombre_documento").value || "informe.pdf";
                pdf.save(nombreDocumento);
            });
        });
    }
    
    // Inicia la generación del PDF
    generatePDF();

});
