document.addEventListener("DOMContentLoaded", () => {
    const images = [
        'images/kitten.jpg',
        'images/bird.jpg',
        'images/red_panda.jpg'
    ];

    const charts = [];

    images.forEach((src, index) => {
        const canvasContainer = document.getElementById(`canvas-container-${index + 1}`);
        const chartCanvas = document.getElementById(`confidenceChart-${index + 1}`);

        const img = new Image();
        img.src = src;
        img.width = 300;
        img.style.display = 'none'; // erst verstecken
        canvasContainer.appendChild(img);

        // Klassifikator laden und Klassifikation nach Bild-Load starten
        img.onload = () => {
            img.style.display = 'block';
            const classifier = ml5.imageClassifier('MobileNet', () => {
                classifier.classify(img, (err, results) => {
                    if (err) {
                        console.error('Fehler bei Klassifikation:', err);
                        return;
                    }

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
                        }
                    });
                });
            });
        };
    });
});
