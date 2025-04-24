document.addEventListener("DOMContentLoaded", () => {
    const imageGroups = {
        korrekt: ['flamingo4.jpg', 'flamingo2.jpg', 'flamingo3.jpg'],
        falsch: ['wellensittich.jpg', 'wellensittich2.jpg', 'wellensittich3.jpg'],
    };

    const charts = {};
    const imgElements = {};
    const initializedGroups = new Set();
    let classifier;

    const globalLoader = document.getElementById('global-loader');
    const progressBarFill = document.querySelector('.progress-bar-fill');

    // Initialisiere den Klassifikator
    ml5.imageClassifier('MobileNet', loaded => {
        classifier = loaded;
        console.log('Klassifikator geladen.');

        // Lade Tab-Listener und andere logische Prozesse
        setupTabListener();

        // Klassifikator ist bereit, zeige den Loader und starte den Ladeprozess
        setTimeout(() => {
            globalLoader.classList.add('hidden');
            $('ul.tabs li.is-active a').click(); // Initialer Klick auf den aktiven Tab
        }, 1000);

        setupUploadClassifier(); // Upload-Tabs
    });

    function setupTabListener() {
        $('ul.tabs').on('change.zf.tabs', function () {
            const activeTabHref = $(this).find('li.is-active a').attr('href'); // z. B. #tab-upload
            const groupName = activeTabHref.replace('#tab-', '');

            if (!initializedGroups.has(groupName)) {
                if (groupName === 'upload') {
                    setupUpload();
                } else {
                    setupGroup(groupName);
                }
            }
        });
    }

    function setupGroup(groupName) {
        if (!imageGroups[groupName]) {
            console.error(`Unbekannte Gruppe: ${groupName}`);
            return;
        }

        initializedGroups.add(groupName);

        const container = document.getElementById(`${groupName}-container`);
        if (!container) {
            console.error(`Container für Gruppe ${groupName} nicht gefunden.`);
            return;
        }

        const basePath = `images/${groupName}/`;

        imageGroups[groupName].forEach((filename, i) => {
            const index = `${groupName}-${i}`;
            const row = document.createElement('div');
            row.className = 'row';

            const leftCol = document.createElement('div');
            leftCol.className = 'column medium-6';
            const rightCol = document.createElement('div');
            rightCol.className = 'column medium-6';

            const img = new Image();
            img.src = basePath + filename;
            img.width = 400;
            img.id = `image-${index}`;
            imgElements[index] = img;
            leftCol.appendChild(img);

            const canvas = document.createElement('canvas');
            canvas.id = `chart-${index}`;
            canvas.width = 400;
            canvas.height = 400;
            rightCol.appendChild(canvas);

            row.appendChild(leftCol);
            row.appendChild(rightCol);
            container.appendChild(row);

            img.onload = () => {
                classifyAndShow(index, img, canvas);
            };
        });
    }

    function classifyAndShow(index, img, canvas) {
        classifier.classify(img)
            .then(results => {
                const labels = results.map(r => r.label);
                const confidences = results.map(r => r.confidence);

                if (charts[index]) charts[index].destroy();

                charts[index] = new Chart(canvas, {
                    type: 'pie',
                    data: {
                        labels,
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
            .catch(err => console.error(`Fehler bei Klassifikation (${index}):`, err));
    }

    function setupUploadClassifier() {
        if (initializedGroups.has('upload')) return;
        initializedGroups.add('upload');

        const container = document.getElementById('upload-container');
        const dropZone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('upload-input');

        // Zeige den Ladebalken an, während der Upload-Bereich geladen wird
        globalLoader.classList.remove('hidden');
        progressBarFill.style.animation = 'none';  // Ladeanimation stoppen
        progressBarFill.style.width = '0';  // Setze den Ladebalken auf 0%
        setTimeout(() => {
            // Ladeanimation wieder starten
            progressBarFill.style.animation = 'fill 5s linear forwards';
        }, 100);

        // Zeige den Upload-Bereich erst nach dem Laden des Klassifikators und des Ladebalkens
        setTimeout(() => {
            dropZone.style.display = 'block';
            globalLoader.classList.add('hidden'); // Verstecke den Ladebalken
        }, 3000); // Verzögere das Anzeigen des Upload-Bereichs, um den Ladebalken sichtbar zu machen

        // Upload-Event-Listener
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', e => {
            e.preventDefault();
            dropZone.style.borderColor = '#66c2a5';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = '#ccc';
        });

        dropZone.addEventListener('drop', e => {
            e.preventDefault();
            dropZone.style.borderColor = '#ccc';
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) handleFile(file);
        });
    }

    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                // Erstelle ein neues Container-Element für das Bild und das Chart
                const row = document.createElement('div');
                row.className = 'row';

                // Bild anzeigen
                const leftCol = document.createElement('div');
                leftCol.className = 'column medium-6';
                leftCol.appendChild(img);
                row.appendChild(leftCol);

                // Chart erstellen
                const rightCol = document.createElement('div');
                rightCol.className = 'column medium-6';
                const chartCanvas = document.createElement('canvas');
                chartCanvas.width = 400;
                chartCanvas.height = 400;
                rightCol.appendChild(chartCanvas);
                row.appendChild(rightCol);

                // Füge den neuen Container zum Upload-Bereich hinzu
                document.getElementById('upload-container').appendChild(row);

                // Klassifikation des hochgeladenen Bildes und Chart erzeugen
                classifier.classify(img)
                    .then(results => {
                        const labels = results.map(r => r.label);
                        const confidences = results.map(r => r.confidence);

                        new Chart(chartCanvas, {
                            type: 'pie',
                            data: {
                                labels,
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
                    .catch(err => console.error('Fehler bei Klassifikation:', err));
            };
        };
        reader.readAsDataURL(file);
    }

});
