document.addEventListener("DOMContentLoaded", () => {
    const images = [
        'images/kitten.jpg',
        'images/bird.jpg',
        'images/red_panda.jpg'
    ];

    const charts = [];
    const imgElements = [];
    const loadingBars = [];

    const classifier = ml5.imageClassifier('MobileNet', () => {
        console.log('Klassifikator geladen.');
        setupTabs(); // Tabs vorbereiten, nachdem der Klassifikator bereit ist
    });

    function classifyAndShow(index) {
        const container = document.querySelector(`#canvas-container-${index + 1}`);
        const chartCanvas = document.querySelector(`#confidenceChart-${index + 1}`);

        const img = imgElements[index];
        if (!img) return;

        classifier.classify(img)
            .then(results => {
                const labels = results.map(r => r.label);
                const confidences = results.map(r => r.confidence);

                if (charts[index]) charts[index].destroy();

                charts[index] = new Chart(chartCanvas, {
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

    function setupTabs() {
        images.forEach((src, index) => {
            const container = document.querySelector(`#canvas-container-${index + 1}`);
            container.innerHTML = '';

            const loader = document.querySelector(`#loader-${index + 1}`);
            loadingBars[index] = loader;

            const img = new Image();
            img.src = src;
            img.width = 400;
            img.height = 400;
            img.id = `image-${index + 1}`;
            img.classList.add('hidden');

            img.onload = () => {
                // Ladebalken ausblenden
                loader.style.display = 'none';

                // Bild sichtbar machen
                img.classList.remove('hidden');
                imgElements[index] = img;

                container.appendChild(img);

                if (index === 0) classifyAndShow(index);
            };

        });

        // Foundation Tabs aktivieren
        $(document).foundation();

        // Richtiges Event-Handling für Tabs
        $('ul.tabs').on('change.zf.tabs', function (event) {
            const activeTabHref = $(this).find('li.is-active a').attr('href'); // z. B. #panel2
            const index = parseInt(activeTabHref.replace('#panel', '')) - 1;

            if (!isNaN(index)) {
                classifyAndShow(index);
            }
        });
    }
});
