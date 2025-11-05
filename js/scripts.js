       window.addEventListener('load', () => {
            if (checkScreenSize()) {
                //startGame();
            }
        });

        document.addEventListener('visibilitychange', () => {
            toggleAudio();
            /*
                if (document.hidden) {
                    bgMusic.pause();
                } else {
                    if(audioEnabled && bgMusic){
                        bgMusic.play().catch((err) => {console.error('visibilityChanged.bgMusic.play', err);});
                    }
                }
            */
        });

        // STATE
        const gameState = {
            selectedKart: null,
            kartColor: null,
            kartNumber: null,
            selectedDriver: null,
            maxSpeed: 0
        };

        // CARATTERISTICHE KART
        const kartSpecs = {
            'red': { maxSpeed: 145, name: 'ROSSO #1', color:'red', kart: '/images/gokart-red.png' },
            'blue': { maxSpeed: 160, name: 'BLU #2', color:'blue', kart: '/images/gokart-blue.png' },
            'yellow': { maxSpeed: 130, name: 'GIALLO #3', color:'yellow', kart: '/images/gokart-yellow.png' },
            'green': { maxSpeed: 155, name: 'VERDE #4', color:'green', kart: '/images/gokart-green.png' },
            'purple': { maxSpeed: 120, name: 'VIOLA #5', color:'purple', kart: '/images/gokart-purple.png' },
            'orange': { maxSpeed: 140, name: 'ARANCIO #6', color:'orange', kart: '/images/gokart-orange.png' }
        };

        const drivers = {
            1: { name: 'SPEEDY SAM', helmet: '/images/helmet-green.png' },
            2: { name: 'FLASH FRED', helmet: '/images/helmet-red.png' },
            3: { name: 'ROCKET ROSA', helmet: '/images/helmet-pink.png' },
            4: { name: 'TURBO ADRI', helmet: '/images/helmet-blue.png' },
            5: { name: 'CATICOLL', helmet: '/images/helmet-yellow.png' },
            6: { name: 'ZISORINO', helmet: '/images/helmet-white.png' }
        }

        const kartGrid = document.querySelector('.kart-grid');
        function fillKartList(){
            // Popola la lista dei kart
               kartGrid.innerHTML="";
            Object.entries(kartSpecs).forEach(([key, kart], i) => {
                const div = document.createElement('div');
                div.className = 'kart-option';
                div.dataset.kart = key;
                div.onclick = () => selectKart(key, kart.color, i + 1);
                div.innerHTML = `
                    <div class="kart-preview" style="color:${kart.color}">
                        <img src="${kart.kart}" alt="${kart.name}" title="${kart.name}" class="img-kart">
                    </div>
                    <div>${kart.name}</div>
                `;
                kartGrid.appendChild(div);
            });
        }

        const driverList = document.querySelector('.driver-list');
        function fillDriversList(){
        // Popola la lista dei piloti
            driverList.innerHTML="";
            Object.entries(drivers).forEach(([id, driver]) => {
                const div = document.createElement('div');
                div.className = 'driver-option';
                div.dataset.driver = id;
                div.onclick = () => selectDriver(id, driver.name);
                div.innerHTML = `
                    <img title="${driver.name}" alt="${driver.name}" class="img-helmet" src="${driver.helmet}">
                    <span>${driver.name}</span>
                `;
                driverList.appendChild(div);
            });
        }

        function checkScreenSize() {
            const minWidth = 600;  // puoi adattare
            const minHeight = 400;

            if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
                document.getElementById('smallScreenModal').style.display = 'block';
                return false;
            }
            return true;
        }

        function closeModal() {
            document.getElementById('smallScreenModal').style.display = 'none';
        }

        // RECORD
        function getRecord() {
            const recordData = localStorage.getItem('gokart_record');
            if (recordData) {
                try {
                    const record = JSON.parse(recordData);
                    if (
                        typeof record === 'object' &&
                        record !== null &&
                        typeof record.distance === 'number' &&
                        typeof record.time === 'number'
                    ) {
                        return record;
                    }
                } catch (e) {
                    console.warn('Record corrotto, resetto:', e);
                }
            }
            return { distance: 0, time: 0 };
        }

         function saveRecord(distance, time) {
            const currentRecord = getRecord();
            let updated = false;
            
            if (distance > currentRecord.distance) {
                localStorage.setItem('gokart_record', JSON.stringify({ distance: Math.floor(distance), time: time }));
                updated = true;
            }
            
            return updated;
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function displayRecord() {
            const record = getRecord();
            const bestRecordEl = document.getElementById('best-record');
            if (record.distance > 0) {
                bestRecordEl.textContent = `🏆 RECORD: ${record.distance}m | ⏱️ ${formatTime(record.time)}`;
            }
        }

        // NAVIGAZIONE
        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
            
            if (screenId === 'welcome') {
                displayRecord();
            }
        }



        // SELEZIONE KART
        function selectKart(id, color, number) {
            document.querySelectorAll('.kart-option').forEach(k => k.classList.remove('selected'));
            document.querySelector(`[data-kart="${id}"]`).classList.add('selected');
            gameState.selectedKart = id;
            gameState.kartColor = color;
            gameState.kartNumber = number;
            gameState.maxSpeed = kartSpecs[id].maxSpeed;
            document.getElementById('kart-next').disabled = false;
        }

        // SELEZIONE PILOTA
        function selectDriver(id, name) {
            //console.log("selectDriver: " + name);
            document.querySelectorAll('.driver-option').forEach(d => d.classList.remove('selected'));
            //event.currentTarget.classList.add('selected');
            document.querySelector(`[data-driver="${id}"]`).classList.add('selected');
            gameState.selectedDriver = name;
            document.getElementById('driver-next').disabled = false;
        }

        // AVVIO GIOCO
        function startGame() {
            showScreen('game');
            playSound('start');
            //mostra bottone pausa
            document.getElementById('player-info').textContent = 
                `${gameState.selectedDriver} - KART #${gameState.kartNumber}`;
            initGame();
            if(audioEnabled && bgMusic){
               bgMusic.play().catch((err) => {console.error('startGame.bgMusic.play', err);});
            }
        }

        // GIOCO
        let canvas, ctx;
        let kart = { x: 0, y: 0, lane: 1, realX: 0 };
        let speed = 50;
        let distance = 0;
        let roadOffset = 0;
        let turboActive = false;
        let turboTime = 0;
        let leftPressed = false;
        let rightPressed = false;
        let turboBoostY = 0;
        let fuel = 10;
        let maxFuel = 10;
        let lastFuelConsumption = 0;
        let fuelCans = [];
        let obstacles = [];
        let gameOver = false;
        let offRoad = false;
        let crashed = false;
        let paused = false;
        let animationId = null;
        let gameTime = 0;
        let gameStartTime = 0;
        

        function initGame() {
            canvas = document.getElementById('game-canvas');
            ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const roadWidth = canvas.width * 0.6;
            const roadX = (canvas.width - roadWidth) / 2;
            const laneWidth = roadWidth / 3;

            kart.realX = roadX + laneWidth * 1.5;
            kart.x = kart.realX;
            kart.y = canvas.height - 200;
            
            // RESET VARIABILI
            fuel = 10;
            distance = 0;
            speed = 50;
            roadOffset = 0;
            fuelCans = [];
            obstacles = [];
            gameOver = false;
            lastFuelConsumption = 0;
            offRoad = false;
            crashed = false;
            paused = false;
            turboBoostY = 0;
            gameTime = 0;
            gameStartTime = Date.now();

            // CONTROLLI
            const leftBtn = document.getElementById('left-btn');
            const rightBtn = document.getElementById('right-btn');
            const turboBtn = document.getElementById('turbo-btn');
            const pauseBtn = document.getElementById('pause-btn');

            leftBtn.addEventListener('mousedown', () => leftPressed = true);
            leftBtn.addEventListener('mouseup', () => leftPressed = false);
            leftBtn.addEventListener('mouseleave', () => leftPressed = false);

            rightBtn.addEventListener('mousedown', () => rightPressed = true);
            rightBtn.addEventListener('mouseup', () => rightPressed = false);
            rightBtn.addEventListener('mouseleave', () => rightPressed = false);

            leftBtn.addEventListener('touchstart', (e) => { 
                e.preventDefault(); 
                leftPressed = true; 
            });
            leftBtn.addEventListener('touchend', (e) => { 
                e.preventDefault(); 
                leftPressed = false; 
            });
            leftBtn.addEventListener('touchcancel', (e) => { 
                e.preventDefault(); 
                leftPressed = false; 
            });

            rightBtn.addEventListener('touchstart', (e) => { 
                e.preventDefault(); 
                rightPressed = true; 
            });
            rightBtn.addEventListener('touchend', (e) => { 
                e.preventDefault(); 
                rightPressed = false; 
            });
            rightBtn.addEventListener('touchcancel', (e) => { 
                e.preventDefault(); 
                rightPressed = false; 
            });

            turboBtn.addEventListener('click', activateTurbo);
            turboBtn.addEventListener('touchstart', (e) => { 
                e.preventDefault(); 
                activateTurbo(); 
            });

            pauseBtn.addEventListener('click', togglePause);
            pauseBtn.addEventListener('touchstart', (e) => { 
                e.preventDefault(); 
                togglePause(); 
            });

            // TASTIERA
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);

            gameLoop();
        }

        function handleKeyDown(e) {
            if (e.key === 'ArrowLeft') leftPressed = true;
            if (e.key === 'ArrowRight') rightPressed = true;
            if (e.key === 'ArrowUp' || e.key === ' ') {
                e.preventDefault();
                activateTurbo();
            }
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                togglePause();
            }
        }

        function handleKeyUp(e) {
            if (e.key === 'ArrowLeft') leftPressed = false;
            if (e.key === 'ArrowRight') rightPressed = false;
        }

        function activateTurbo() {
            if (!turboActive && !gameOver && !paused) {
                turboActive = true;
                turboTime = Date.now();
                turboBoostY = -100;
                playSound('turbo');
                setTimeout(() => {
                    turboBoostY = 0;
                    turboActive = false;
                    fuel = fuel - 1;

                    if (fuel <= 0) {
                        endGame();
                    }

                }, 2000);
            }
        }

        function gameLoop() {
            if (!paused && !gameOver) {
                update();
                draw();
            } else if (gameOver) {
                draw();
            }
            animationId = requestAnimationFrame(gameLoop);
        }

        function togglePause() {
            if (gameOver) return;
            
            console.log('togglePause.paused: ' + paused);

            paused = !paused;
            const modal = document.getElementById('pause-modal');
            if(paused == true){
                modal.classList.add('active');
            }
            else{
                modal.classList.remove('active');
            }
            
            console.log('modalPause.active: ' + modal.classList.contains('active'));

            if (paused) {
                saveRecord(distance, gameTime);
                const record = getRecord();
                document.getElementById('pause-record').textContent = record.distance;
                document.getElementById('pause-time-record').textContent = formatTime(record.time);
                bgMusic.pause();
            } else {
                // Riprendi il timer
                gameStartTime = Date.now() - (gameTime * 1000);
                if (audioEnabled){
                        bgMusic.play().catch((err) => { console.error('resumepause.bgmusic.play', err); });
                }
            }
        }

        function showModalGameOver() {
            console.log('showModalGameOver');
            const modal = document.getElementById('gameover-modal');
            modal.classList.add('active');
            modal.classList.remove('hidden');
            playSound('finish');
            bgMusic.pause();
               

            paused = false;
            document.getElementById('pause-modal').classList.remove('active');

            const record = getRecord();
            const isNewRecord = Math.floor(distance) >= record.distance;

            const distEl = document.getElementById('gameover-distance');
            const timeEl = document.getElementById('gameover-time');
            const recordEl = document.getElementById('gameover-record');

            distEl.textContent = `📏 Distanza: ${Math.floor(distance)}m`;
            timeEl.textContent = `⏱️ Tempo: ${formatTime(gameTime)}`;

            if (isNewRecord) {
                recordEl.innerHTML = `<span style="color:#00ff00; font-size:1.3em;">🏆 NUOVO RECORD! 🏆</span>`;
            } else {
                recordEl.innerHTML = `🏆 Record: ${record.distance}m | ⏱️ ${formatTime(record.time)}`;
                playSound('victory');
            }

            modal.classList.remove('hidden');

            const retryButton = document.getElementById('retryButton');
            retryButton.onclick = () => {
                modal.classList.add('hidden');
                modal.classList.remove('active');
                exitToMenu();
            };
        }

        function exitToMenu() {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            paused = false;
            document.getElementById('pause-modal').classList.remove('active');

            showScreen('kart-select');
            
            document.querySelectorAll('.kart-option').forEach(k => k.classList.remove('selected'));
            document.querySelectorAll('.driver-option').forEach(d => d.classList.remove('selected'));
            document.getElementById('kart-next').disabled = true;
            document.getElementById('driver-next').disabled = true;
        }

        function update() {
            if (gameOver) return;

            // AGGIORNA TIMER
            gameTime = (Date.now() - gameStartTime) / 1000;
            document.getElementById('time').textContent = formatTime(gameTime);

            const roadWidth = canvas.width * 0.6;
            const roadX = (canvas.width - roadWidth) / 2;
            const laneWidth = roadWidth / 3;

            if (!crashed) {
                if (leftPressed) {
                    kart.realX -= 12;
                }
                if (rightPressed) {
                    kart.realX += 12;
                }
            }

            const minX = roadX + 30;
            const maxX = roadX + roadWidth - 30;
            
            kart.realX = Math.max(minX + 30, Math.min(maxX - 30, kart.realX));
            
            const laneCenter1 = roadX + laneWidth * 0.5;
            const laneCenter2 = roadX + laneWidth * 1.5;
            const laneCenter3 = roadX + laneWidth * 2.5;
            const laneMargin = laneWidth * 0.4;
            
            offRoad = true;
            if (Math.abs(kart.realX - laneCenter1) < laneMargin ||
                Math.abs(kart.realX - laneCenter2) < laneMargin ||
                Math.abs(kart.realX - laneCenter3) < laneMargin) {
                offRoad = false;
            }

            if (kart.realX < roadX + laneWidth) kart.lane = 0;
            else if (kart.realX < roadX + laneWidth * 2) kart.lane = 1;
            else kart.lane = 2;

            kart.x += (kart.realX - kart.x) * 0.15;
            
            if (turboBoostY < 0) {
                turboBoostY += 5;
            }

            const maxSpeed = gameState.maxSpeed;
            const turboBoost = turboActive ? 30 : 0;
            let targetSpeed = Math.min(maxSpeed + turboBoost, maxSpeed + 30);
            
            if (offRoad) {
                targetSpeed = targetSpeed * 0.3;
            }
            
            if (crashed) {
                targetSpeed = targetSpeed * 0.5;
            }
            
            if (speed < targetSpeed) {
                speed = Math.min(speed + 0.3, targetSpeed);
            } else if (speed > targetSpeed) {
                speed = Math.max(speed - 1, targetSpeed);
            }

            distance += speed / 100;
            roadOffset += speed / 10;

            const metersTraveled = distance;
            if (Math.floor(metersTraveled / 500) > lastFuelConsumption) {
                fuel = Math.max(0, fuel - 1);
                lastFuelConsumption = Math.floor(metersTraveled / 500);
                
                if (fuel <= 0) {
                    endGame();
                }
            }

            if (Math.random() < 0.008) {
                const lane = Math.floor(Math.random() * 3);
                fuelCans.push({
                    x: roadX + (lane + 0.5) * laneWidth,
                    y: -50,
                    lane: lane
                });
            }

            if (Math.random() < 0.012) {
                const lane = Math.floor(Math.random() * 3);
                const colors = ['#ff0000', '#0088ff', '#ffff00', '#00ff00', '#ff00ff', '#ff8800'];
                const obstacleColor = colors[Math.floor(Math.random() * colors.length)];
                
                obstacles.push({
                    x: roadX + (lane + 0.5) * laneWidth,
                    y: -100,
                    lane: lane,
                    color: obstacleColor,
                    number: Math.floor(Math.random() * 9) + 1
                });
            }

            fuelCans.forEach((can, index) => {
                can.y += speed / 10;

                if (Math.abs(can.x - kart.x) < 40 && Math.abs(can.y - (kart.y + turboBoostY)) < 60) {
                    fuel = Math.min(maxFuel, fuel + 1);
                    fuelCans.splice(index, 1);
                    playSound('fuel');
                }

                if (can.y > canvas.height) {
                    fuelCans.splice(index, 1);
                }
            });

            obstacles.forEach((obs, index) => {
                obs.y += speed / 10;

                if (Math.abs(obs.x - kart.x) < 50 && Math.abs(obs.y - (kart.y + turboBoostY)) < 70) {
                    if (!crashed) {
                        crashed = true;
                        fuel = Math.max(0, fuel - 1);
                        playSound('collision');

                        if (fuel <= 0) {
                            endGame();
                        }
                        
                        speed = speed * 0.3;
                        
                        setTimeout(() => {
                            crashed = false;
                        }, 1000);
                    }
                }

                if (obs.y > canvas.height) {
                    obstacles.splice(index, 1);
                }
            });

            document.getElementById('distance').textContent = Math.floor(distance);
            document.getElementById('speed').textContent = Math.floor(speed);
            updateFuelUI();
        }

        function endGame() {
            console.log("endGame");
            if (gameOver) return; // evita doppie chiamate
            gameOver = true;
            speed = 0;

            cancelAnimationFrame(animationId);
            console.log("GAME OVER - mostro modal");

            setTimeout(() => {
                showModalGameOver();

            }, 100); // piccolo delay per uscire dal frame corrente
        }

        function updateFuelUI() {
            const fuelPercent = (fuel / maxFuel) * 100;
            document.getElementById('fuel-bar').style.width = fuelPercent + '%';
            document.getElementById('fuel-amount').textContent = fuel.toFixed(1) + 'L';
            document.getElementById('fuel-percent').textContent = Math.floor(fuelPercent) + '%';
        }

        let audioEnabled = false;
        let bgMusic = null;
        // Suoni di gioco
        const sounds = {
            bgMusic01: new Audio('/sounds/music-01.mp3'),
            bgMusic02: new Audio('/sounds/music-02.mp3'),
            collision: new Audio('/sounds/collision.wav'),
            fuel: new Audio('/sounds/fuel.wav'),
            start: new Audio('/sounds/start.wav'),
            finish: new Audio('/sounds/finish.wav'),
            victory: new Audio('/sounds/victory.wav'),
            turbo: new Audio('/sounds/turbo.wav')
        };
        sounds.bgMusic01.loop = true;
        sounds.bgMusic01.volume = 0.3;
        sounds.bgMusic02.loop = true;
        sounds.bgMusic02.volume = 0.3;

        // Toggle musica
        function toggleAudio() {
            const btn = document.getElementById('audioToggle');
            audioEnabled = !audioEnabled;
            if(bgMusic == null){
                changeMusic(1);
            }
            if (audioEnabled) {
                btn.classList.add('active');
                btn.textContent = '🔈 Audio ON';
                bgMusic.play().catch((err) => { console.error("toggleAudio.bgMusic.play", err); }); // play richiede interazione utente
            } else {
                btn.classList.remove('active');
                btn.textContent = '🔇 Audio OFF';
                bgMusic.pause();
            }
            saveAudioSettings();
        }

        function changeMusic(index){
            // Rimuove la classe 'active' da tutti i pulsanti
            document.querySelectorAll('.music-btn').forEach(btn => btn.classList.remove('active'));

            // Aggiunge 'active' solo al pulsante selezionato
            const selectedBtn = document.querySelectorAll('.music-btn')[index-1];
            if (selectedBtn) selectedBtn.classList.add('active');

            // Ferma la musica precedente
            if (bgMusic) {
                bgMusic.pause();
                bgMusic.currentTime = 0; // opzionale: resetta all’inizio
            }

            // Imposta e riproduce la nuova musica
            switch(index){
                case 1:
                    bgMusic = sounds.bgMusic01;
                    break;
                case 2:
                    bgMusic = sounds.bgMusic02;
                    break;
                default:
                    bgMusic = sounds.bgMusic01;
                    break;
            }
            
            if (bgMusic) {
                bgMusic.volume = 0.5;
                bgMusic.loop = true;
                bgMusic.play().catch((err) => { console.error('changeMusic.bgMusic.play',err); });
            }

            saveAudioSettings();
        }

        function startMusic(){
            if(audioEnabled && bgMusic){
                bgMusic.play().catch((err) => {console.error('startMusic.bgMusic.play', err);});
            }
        }

        // Funzione per suoni specifici
        function playSound(type) {
        if (!audioEnabled) return;
            const sound = sounds[type];
            if (sound) {
                sound.currentTime = 0; // reset per ripetere subito
                sound.play().catch((err) => {console.error('Error playing sound: ',err)});
            }
        }


        function saveAudioSettings(){
            let audioSettings = { enabled: audioEnabled, music: bgMusic.src };
            localStorage.setItem('audioSettings', JSON.stringify(audioSettings) );
        }

        function loadAudioSettings(){
            let data = localStorage.getItem('audioSettings');
            if(data){
                let audioSettings = JSON.parse(data);
                audioEnabled = audioSettings.enabled;
                bgMusic = new Audio(audioSettings.music);
                bgMusic.loop = true;
                bgMusic.volume = 0.3;
            }
        }



        function draw() {
            if (gameOver) return;

            ctx.fillStyle = '#1a4d1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const roadWidth = canvas.width * 0.6;
            const roadX = (canvas.width - roadWidth) / 2;

            ctx.fillStyle = '#444';
            ctx.fillRect(roadX, 0, roadWidth, canvas.height);

            const kerbWidth = 30;
            const kerbHeight = 40;
            const numKerbs = Math.ceil(canvas.height / kerbHeight) + 2;
            
            for (let side = 0; side < 2; side++) {
                const x = side === 0 ? roadX : roadX + roadWidth - kerbWidth;
                
                for (let i = -1; i < numKerbs; i++) {
                    const y = (i * kerbHeight + (roadOffset % (kerbHeight * 2)));
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(x, y, kerbWidth, kerbHeight);
                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(x, y + kerbHeight, kerbWidth, kerbHeight);
                }
            }

            const laneWidth = roadWidth / 3;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.setLineDash([30, 30]);
            ctx.lineDashOffset = -roadOffset;
            
            for (let i = 1; i < 3; i++) {
                const lineX = roadX + (roadWidth / 3) * i;
                ctx.beginPath();
                ctx.moveTo(lineX, 0);
                ctx.lineTo(lineX, canvas.height);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            const kartWidth = 60;
            const kartHeight = 80;
            const kartY = kart.y + turboBoostY;

            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(kart.x - kartWidth/2 + 5, kartY + kartHeight - 10, kartWidth, 15);

            if (offRoad) {
                ctx.fillStyle = 'rgba(255, 100, 0, 0.6)';
                ctx.fillRect(kart.x - kartWidth/2 - 10, kartY - 10, kartWidth + 20, kartHeight + 20);
            }

            ctx.fillStyle = gameState.kartColor;
            ctx.fillRect(kart.x - kartWidth/2, kartY, kartWidth, kartHeight);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(gameState.kartNumber, kart.x, kartY + 50);

            ctx.fillStyle = '#000';
            ctx.fillRect(kart.x - kartWidth/2 - 5, kartY + 10, 10, 15);
            ctx.fillRect(kart.x + kartWidth/2 - 5, kartY + 10, 10, 15);
            ctx.fillRect(kart.x - kartWidth/2 - 5, kartY + 55, 10, 15);
            ctx.fillRect(kart.x + kartWidth/2 - 5, kartY + 55, 10, 15);

            if (turboActive) {
                ctx.fillStyle = '#ff6600';
                ctx.globalAlpha = 0.7;
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(
                        kart.x - 10 + Math.random() * 20,
                        kartY + kartHeight + i * 10,
                        5,
                        10
                    );
                }
                ctx.globalAlpha = 1;
            }

            fuelCans.forEach(can => {
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(can.x - 17, can.y + 33, 34, 10);

                ctx.fillStyle = '#00aaff';
                ctx.fillRect(can.x - 15, can.y, 30, 40);
                
                ctx.fillStyle = '#0077cc';
                ctx.fillRect(can.x - 15, can.y + 10, 30, 5);
                ctx.fillRect(can.x - 15, can.y + 25, 30, 5);
                
                ctx.fillStyle = '#ffcc00';
                ctx.fillRect(can.x - 10, can.y - 5, 20, 7);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⛽', can.x, can.y + 27);
            });

            obstacles.forEach(obs => {
                const obsWidth = 55;
                const obsHeight = 75;

                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(obs.x - obsWidth/2 + 5, obs.y + obsHeight - 10, obsWidth, 15);

                ctx.fillStyle = obs.color;
                ctx.fillRect(obs.x - obsWidth/2, obs.y, obsWidth, obsHeight);

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(obs.number, obs.x, obs.y + 45);

                ctx.fillStyle = '#000';
                ctx.fillRect(obs.x - obsWidth/2 - 5, obs.y + 10, 10, 15);
                ctx.fillRect(obs.x + obsWidth/2 - 5, obs.y + 10, 10, 15);
                ctx.fillRect(obs.x - obsWidth/2 - 5, obs.y + 50, 10, 15);
                ctx.fillRect(obs.x + obsWidth/2 - 5, obs.y + 50, 10, 15);

                if (Math.abs(obs.x - kart.x) < 50 && Math.abs(obs.y - (kart.y + turboBoostY)) < 70) {
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(obs.x - obsWidth/2 - 5, obs.y - 5, obsWidth + 10, obsHeight + 10);
                }
            });

            if (crashed) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 50px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('💥 COLLISIONE! -1L 💥', canvas.width / 2, 150);
            }

            if (gameOver) {
                console.log("draw.gameOver");
                /*
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                const record = getRecord();
                const isNewRecord = Math.floor(distance) >= record;
                
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 60px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('CARBURANTE ESAURITO!', canvas.width / 2, canvas.height / 2 - 100);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 40px Arial';
                ctx.fillText('📏 Distanza: ' + Math.floor(distance) + 'm', canvas.width / 2, canvas.height / 2 - 40);
                ctx.fillText('⏱️ Tempo: ' + formatTime(gameTime), canvas.width / 2, canvas.height / 2 + 10);
                
                if (isNewRecord) {
                    ctx.fillStyle = '#00ff00';
                    ctx.font = 'bold 50px Arial';
                    ctx.fillText('🏆 NUOVO RECORD! 🏆', canvas.width / 2, canvas.height / 2 + 70);
                } else {
                    ctx.fillStyle = '#ffff00';
                    ctx.font = 'bold 35px Arial';
                    ctx.fillText('🏆 Record: ' + record.distance + 'm | ⏱️ ' + formatTime(record.time), canvas.width / 2, canvas.height / 2 + 70);
                }
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 30px Arial';
                ctx.fillText('Premi ESC per uscire', canvas.width / 2, canvas.height / 2 + 100);

                // --- Aggiungi bottone "Gioca di nuovo" ---
                if (!document.getElementById('retryButton')) {
                    const btn = document.createElement('button');
                    btn.id = 'retryButton';
                    btn.textContent = '🎮 Gioca di nuovo';
                    btn.className = 'btn-restart';
                    btn.onclick = () => {
                        btn.remove();
                        exitToMenu();
                    };
                    document.body.appendChild(btn);
                }
                */
            }
        }

        fillDriversList();
        fillKartList();
        loadAudioSettings();
        displayRecord();
