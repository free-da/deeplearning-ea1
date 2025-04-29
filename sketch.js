
    const loadingMessages = [
        ["Initialisiere Subsystem für spontane Eingebungen …", "_Falls das System plötzlich geniale Ideen haben sollte._"],
        ["Entferne semantisches Rauschen aus Keks-Datenbanken …", "_Nicht jede Cookie-Info ist wirklich nützlich._"],
        ["Synchronisiere neuronale Eigenheiten mit kosmischer Uhrzeit …", "_Weil Timing bekanntlich alles ist – auch bei KI._"],
        ["Optimiere SVG-Bananenkurven für grafische Konsistenz …", "_Gerade Bananen sehen einfach falsch aus._"],
        ["Importiere unnötig komplexe Lösung für ein einfaches Problem …", "_Ganz im Sinne moderner Softwarearchitektur._"],
        ["Rekalibriere Zufallsgenerator auf kreative Tagesform …", "_Ein bisschen Glück kann nie schaden._"],
        ["Puffere rekursive Kaffee-Requests …", "_Künstliche Intelligenz braucht auch Koffein._"],
        ["Dekodiere tief verschachtelte Wenn-dann-Sätze …", "_Weil Sprache manchmal ein Labyrinth ist._"],
        ["Lade 1.21 Gigabyte Unsinnswissen …", "_Nicht relevant, aber amüsant._"],
        ["Simuliere Quantenrauschen für realistische Entscheidungen …", "_Ein bisschen Unschärfe hat noch keinem geschadet._"],
        ["Berechne Flugkurve hypothetischer Watschelwesen …", "_Für die Wissenschaft._"],
        ["Wärme neuronale Netze vor …", "_Kalte Netze arbeiten langsamer._"],
        ["Extrahiere Emotionen aus ASCII-Art …", "_♥ bedeutet meistens Liebe._"],
        ["Importiere ISO-zertifizierte Bananenschale …", "_Sicher ist sicher._"],
        ["Justiere semantischen Kompass auf Nord-Sinn …", "_Damit nichts verloren geht._"],
        ["Formatiere Diskette zur Sicherung der Backups …", "_Oldschool ist das neue Modern._"],
        ["Aktiviere Modul für soziale Unsicherheit …", "_Damit sich die KI besser einfühlen kann._"],
        ["Scanne Gehirn für unerlaubte Ohrwürmer …", "_Verdächtige Melodien werden gemeldet._"],
        ["Öffne Wurmloch zur Cloud …", "_Bandbreite könnte instabil sein._"],
        ["Starte Rückwärts-Logik-Debugger …", "_Fehler? Nein, Features._"],
        ["Entferne Doppeldeutigkeiten aus Sprachzentrum …", "_Wirklich? Wirklich wirklich._"],
        ["Trainiere KI auf diplomatisches Schweigen …", "_Manchmal ist nichts sagen das Beste._"],
        ["Backe neuronale Kekse für spätere Analyse …", "_Knusprig, aber datenreich._"],
        ["Sammle Daten von imaginären Benutzern …", "_Die haben erstaunlich viele Meinungen._"],
        ["Entwirre Paradoxa aus Benutzeranfragen …", "_Ein bisschen Logik, ein bisschen Magie._"],
        ["Reinige Vektorraum mit semantischem Mopp …", "_Ordnung muss sein._"],
        ["Lade Syntaxmodul für sarkastische Antworten …", "_Nur im Notfall aktivieren._"],
        ["Frage das Orakel nach Debug-Hinweisen …", "_Antwort unklar, versuche es später nochmal._"],
        ["Synchronisiere KI mit dem inneren Kind …", "_Lachen ist erlaubt._"],
        ["Importiere kausale Kausalitätsverkettung …", "_Weil alles irgendwie zusammenhängt._"],
        ["Pinsel DataFrame-Kanten weich …", "_Scharfe Übergänge vermeiden._"],
        ["Aktiviere Modus für kontrolliertes Chaos …", "_Chaos, aber mit Stil._"],
        ["Verifiziere Realitätsabgleich mit Schmetterlingslogik …", "_Kleiner Flügelschlag, große Wirkung._"],
        ["Bringe Klassifikatoren zum Meditieren …", "_Om…._"],
        ["Repliziere neuronale Höflichkeit …", "_Danke, bitte und gerne._"],
        ["Lade Sprachmodelle mit extra Ironie …", "_Nicht alles ernst nehmen._"],
        ["Validiere Entropiegrenzen des Smalltalks …", "_Wetter ist immer ein Thema._"],
        ["Verbinde mit hypersemantischer Zwischenwelt …", "_Warte auf Empfang …._"],
        ["Testweise Überladung der Wahrscheinlichkeit …", "_Erwartung ist alles._"],
        ["Erzeuge semantischen Schaum für weiche Übergänge …", "_Formulierung deluxe._"],
        ["Entferne Glitches aus grammatischer Matrix …", "_Vong Syntax her korrekt._"],
        ["Analysiere Muster in Kaffeesatz …", "_Fein gemahlen, tief gedeutet._"],
        ["Installiere Zufall mit System …", "_Unberechenbar, aber planvoll._"],
        ["Lade vordefinierte Antwortfloskeln für Meetings …", "_„Klingt gut, lass uns das vertiefen.“_"],
        ["Kalibriere Tastaturresonanz für kreative Eingaben …", "_Mechanisch inspiriert._"],
        ["Sammle Userdaten aus Paralleluniversen …", "_Opt-in erfolgt automatisch._"],
        ["Baue neuronales Kartenhaus …", "_Bitte nicht zu stark atmen._"],
        ["Verschlüssel Gedankenreste in Emojis …", "_🤖💡💥_"],
        ["Schüttele KI leicht vor dem Gebrauch …", "_Für gleichmäßige Verteilung._"]
    ];

    // Zeige den Splashscreen an
    const splashscreen = document.getElementById('splashscreen');
    const loadingText = document.getElementById('loading-text');

    let classifier;

    // Zufällige Nachricht anzeigen
    function showRandomMessage() {
        const [main, sub] = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        document.getElementById('main-message').innerText = main;
        document.getElementById('sub-message').innerText = sub;
    }

    function setupTabs() {

        const charts = {};

        const tabsContainer = $('ul.tabs');
        const uploadTab = $('#tab-upload');

        // Bereite die Tabs vor und stelle sicher, dass die Bilder und Charts richtig geladen werden
        setupTabListener(tabsContainer);

        setupUploadUI(); // Upload-Tab immer verfügbar

        // Initialisiere den aktiven Tab (ohne #tab-)
        const initialTab = tabsContainer.find('li.is-active a').attr('href').replace('#tab-', '');
        if (initialTab !== 'upload') {
            setupGroup(initialTab);
        }
    }
    function startLoading() {

        // Starte Message-Anzeige
        showRandomMessage(); // Sofort erste Nachricht
        messageInterval = setInterval(showRandomMessage, 2000);

        // Lade Klassifikator asynchron
        ml5.imageClassifier('MobileNet', loaded => {
            console.log('Klassifikator geladen.');
            classifier = loaded;

            // Stoppe Nachrichtenanzeige
            clearInterval(messageInterval);

            // Verstecke Splashscreen, zeige App
            document.getElementById('splashscreen').style.display = 'none';
            document.getElementById('app').style.display = 'block';

            // Starte eigentliche Anwendung
            setupTabs(); // z. B.
        });
    }

    function stopLoadingMessages() {
        clearInterval(messageInterval);
        loadingText.innerHTML = '';
    }

    function showImageInLayout(group, img, container, index) {
            // Dynamische Zeile mit Bild und Canvas erstellen
            const row = $('<div class="row"></div>');
            const imgContainer = $('<div class="column medium-6"></div>').append(img);
            const chartContainer = $('<div class="column medium-6"></div>');
            const canvas = $('<canvas></canvas>', {width: 400, height: 400}).get(0); // Canvas ohne ID
            const imgElements = {};

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
        const imageGroups = {
            korrekt: ['flamingo4.jpg', 'flamingo2.jpg', 'flamingo3.jpg'],
            falsch: ['wellensittich.jpg', 'wellensittich2.jpg', 'wellensittich3.jpg'],
        };

        const initializedGroups = new Set();
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
    function setupTabListener(tabsContainer) {
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

        // Stelle sicher, dass der Klick auf die Dropzone das Datei-Input-Feld auslöst
        uploadDropzone.on('click', function () {
            fileInput.click(); // Öffnet den Datei-Dialog
        });

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

    document.addEventListener("DOMContentLoaded", startLoading);