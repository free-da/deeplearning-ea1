// sketch.js

let classifier;
let img;
let confidenceChart;
let classifyBtn;

function preload() {
    img = loadImage('images/kitten.jpg');
}

function setup() {
    // Canvas erstellen und in den gewünschten Container hängen
    const cnv = createCanvas(400, 400);
    cnv.parent('ml5-canvas-container');

    // Bild aufs Canvas zeichnen
    image(img, 0, 0, width, height);

    // Button referenzieren und zunächst verstecken
    classifyBtn = select('#classifyButton');
    classifyBtn.hide();

    // MobileNet-Modell laden (Callback erhält direkt den Klassifizierer)
    ml5.imageClassifier('MobileNet', function(loadedClassifier) {
        classifier = loadedClassifier;
        console.log('✅ Modell geladen');

        // Button anzeigen und Klick-Handler anhängen
        classifyBtn.show();
        classifyBtn.mousePressed(handleClassify);
    });
}

function handleClassify() {
    console.log('🔄 Starte Klassifizierung des Canvas');

    classifier.classify(select('canvas').elt, function(err, results) {
        // ml5 liefert manchmal nur ein Argument (results)
        let resArray;
        if (Array.isArray(err)) {
            resArray = err;
        } else {
            if (err) {
                console.error('❌ Klassifikationsfehler:', err);
                return;
            }
            resArray = results;
        }

        if (!resArray || resArray.length === 0) {
            console.error('❌ Keine Ergebnisse erhalten.');
            return;
        }

        console.log('✅ Ergebnisse:', resArray);
        drawChart(resArray);
    });
}

function drawChart(results) {
    const labels = results.map(r => r.label);
    const confidences = results.map(r => r.confidence * 100);

    // Vorherigen Chart entfernen, falls vorhanden
    if (confidenceChart) {
        confidenceChart.destroy();
    }

    const ctx = document.getElementById('confidenceChart').getContext('2d');
    confidenceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: confidences,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56',
                    '#4BC0C0', '#9966FF', '#FF9F40'
                ],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Klassifikations‑Konfidenzen (%)'
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw.toFixed(1)}%`
                    }
                }
            }
        }
    });
}
