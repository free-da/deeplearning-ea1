document.addEventListener("DOMContentLoaded", () => {
    const imageGroups = {
        korrekt: ['flamingo4.jpg', 'flamingo2.jpg', 'flamingo3.jpg'],
        falsch: ['wellensittich.jpg', 'wellensittich2.jpg', 'wellensittich3.jpg'],
    };

    const charts = {};
    const imgElements = {};
    const initializedGroups = new Set();

    let classifier;

    // Zeige den Splashscreen an
    const splashscreen = document.getElementById('splashscreen');
    const tabsContainer = $('ul.tabs');
    const uploadTab = $('#tab-upload');

    // Lade den MobileNet-Klassifikator
    ml5.imageClassifier('MobileNet', loaded => {
        console.log('Klassifikator geladen.');
        classifier = loaded;

        // Verstecke den Splashscreen, wenn der Klassifikator fertig geladen ist
        splashscreen.style.display = 'none';

        // Bereite die Tabs vor und stelle sicher, dass die Bilder und Charts richtig geladen werden
        setupTabListener();

        setupUploadUI(); // Upload-Tab immer verfügbar

        // Initialisiere den aktiven Tab (ohne #tab-)
        const initialTab = tabsContainer.find('li.is-active a').attr('href').replace('#tab-', '');
        if (initialTab !== 'upload') {
            setupGroup(initialTab);
        }

    });

    function showImageInLayout(group, img, container, index) {
            // Dynamische Zeile mit Bild und Canvas erstellen
            const row = $('<div class="row"></div>');
            const imgContainer = $('<div class="column medium-6"></div>').append(img);
            const chartContainer = $('<div class="column medium-6"></div>');
            const canvas = $('<canvas></canvas>', {width: 400, height: 400}).get(0); // Canvas ohne ID
            chartContainer.append(canvas);
            row.append(imgContainer).append(chartContainer);

            // Das Bild und der Canvas in den Container hinzufügen
            container.append(row);

            imgElements[index] = img;

            // Klassifizieren und Diagramm anzeigen, wenn das Bild geladen wurde
            classifyAndShow(group, index, img, canvas);
    }

// Diese Funktion stellt sicher, dass die Bilder und die Charts korrekt geladen werden
    function setupGroup(group) {
        if (initializedGroups.has(group)) return;
        initializedGroups.add(group);

        const images = imageGroups[group];
        const container = $(`#tab-${group} #${group}-container`); // Direkt auf den Container im Tab zugreifen

        // Bilder hinzufügen
        images.forEach((src, index) => {
            const img = new Image();
            img.src = `images/${group}/${src}`;
            img.width = 300;
            img.onload = () => {
                showImageInLayout(group, img, container, index);
            };
        });
    }

    // Klassifizieren und Diagramm anzeigen
    function classifyAndShow(group, index, img, canvas) {
        // Klassifikationslogik wie gehabt
        classifier.classify(img)
            .then(results => {
                const labels = results.map(r => r.label);
                const confidences = results.map(r => r.confidence);

                const ctx = canvas.getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Confidence',
                            data: confidences,
                            backgroundColor: ['#66c2a5', '#fc8d62', '#8da0cb']
                        }]
                    },
                    options: {
                        responsive: true,
                        animation: { animateScale: true }
                    }
                });
            })
            .catch(err => {
                console.error('Fehler bei Klassifikation:', err);
            });
    }

    // Event-Listener für Tab-Wechsel
    function setupTabListener() {
        tabsContainer.on('change.zf.tabs', function (event) {
            const activeTabHref = $(this).find('li.is-active a').attr('href'); // z. B. #panel2
            const group = activeTabHref.replace('#tab-', '');

            if (group === 'upload') {
                // Der Upload-Tab benötigt keine Funktion zum Vorab-Laden der Bilder
                return;
            } else {
                setupGroup(group); // Wenn es sich um einen anderen Tab handelt (korrekt/falsch)
            }
        });
    }

    // Upload-Dropzone aktivieren und handle den Dateiupload
    function setupUploadUI() {
        const uploadTabContent = $('#tab-upload');
        const fileInput = $('#upload-input');
        const uploadDropzone = $('#upload-dropzone');
        const uploadContainer = $('#upload-container');

        // Datei-Upload und Klassifizierung nach dem Hochladen
        fileInput.on('change', function () {
            const file = fileInput[0].files[0];
            if (file) {
                handleFileUpload(file, uploadContainer);
            }
        });

        // Drag-and-Drop-Verhalten
        uploadDropzone.on('dragover', function (e) {
            e.preventDefault(); // Verhindere das Standardverhalten
            $(this).addClass('drag-over');
        }).on('dragleave', function () {
            $(this).removeClass('drag-over');
        }).on('drop', function (e) {
            e.preventDefault();
            const file = e.originalEvent.dataTransfer.files[0];
            if (file) {
                handleFileUpload(file, uploadContainer);
            }
        });
    }

    // Diese Funktion kümmert sich um das Hochladen und Klassifizieren des Bildes
    function handleFileUpload(file, container) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.width = 300;
            img.onload = function () {
                container.empty(); // Lösche den vorherigen Inhalt
                //
                // // Bild in den Container hinzufügen
                // container.append(img);
                //
                // // Canvas für das Bild erstellen und hinzufügen
                // const canvas = document.createElement('canvas');
                // canvas.width = 400;
                // canvas.height = 400;
                // container.append(canvas); // Canvas zum Container hinzufügen

                // Klassifizieren und Diagramm anzeigen
                showImageInLayout('upload',img,container,0);
                //classifyAndShow('upload', 0, img, canvas);
            };
        };
        reader.readAsDataURL(file);
    }
});
