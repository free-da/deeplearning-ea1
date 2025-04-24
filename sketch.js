document.addEventListener("DOMContentLoaded", () => {
    const imageGroups = {
        korrekt: ['flamingo4.jpg', 'flamingo2.jpg', 'flamingo3.jpg'],
        falsch: ['wellensittich.jpg', 'wellensittich2.jpg', 'wellensittich3.jpg'],
    };

    const charts = {};
    const imgElements = {};
    const initializedGroups = new Set();

    let classifier;

    ml5.imageClassifier('MobileNet', loaded => {
        console.log('Klassifikator geladen.');
        classifier = loaded;

        setupTabListener();

        // Lade initial den aktiven Tab (id ohne #tab-)
        const initial = $('ul.tabs li.is-active a').attr('href').replace('#tab-', '');
        if (initial === 'upload') {
            setupUpload();
        } else {
            setupGroup(initial);
        }
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
        const loader = document.getElementById(`loader-${groupName}`);
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
                if (i === imageGroups[groupName].length - 1) {
                    loader.style.display = 'none';
                }
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

    function setupUpload() {
        initializedGroups.add('upload');

        const container = document.getElementById('upload-container');
        const loader = document.getElementById('loader-upload');
        loader.style.display = 'none'; // sicherstellen, dass er wirklich aus bleibt


        const dropZone = document.getElementById('upload-dropzone');
        // dropZone.id = 'dropzone';
        // dropZone.textContent = 'Ziehe ein Bild hierher oder klicke zum Hochladen';
        // dropZone.style.border = '2px dashed #ccc';
        // dropZone.style.padding = '40px';
        // dropZone.style.textAlign = 'center';
        // dropZone.style.cursor = 'pointer';

        const fileInput = document.getElementById('upload-input');
        //fileInput.type = 'file';
        //fileInput.accept = 'image/*';
        //fileInput.style.display = 'none';

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', e => {
            console.log("HALLO!");
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

        //container.appendChild(dropZone);
        //container.appendChild(fileInput);

        function handleFile(file) {
            loader.style.display = 'block';

            const reader = new FileReader();
            reader.onload = () => {
                const row = document.createElement('div');
                row.className = 'row';

                const leftCol = document.createElement('div');
                leftCol.className = 'column medium-6';
                const rightCol = document.createElement('div');
                rightCol.className = 'column medium-6';

                const img = new Image();
                img.src = reader.result;
                img.width = 400;
                img.onload = () => {
                    const index = `upload-${Date.now()}`;
                    imgElements[index] = img;

                    const canvas = document.createElement('canvas');
                    canvas.width = 400;
                    canvas.height = 400;

                    classifyAndShow(index, img, canvas);
                    loader.style.display = 'none';

                    leftCol.appendChild(img);
                    rightCol.appendChild(canvas);

                    row.appendChild(leftCol);
                    row.appendChild(rightCol);
                    container.appendChild(row);
                };
            };
            reader.readAsDataURL(file);
        }
    }
});
