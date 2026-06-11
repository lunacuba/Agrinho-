
        // ================= LÓGICA (JAVASCRIPT) =================
        let dbLeaderboard = [];
        let currentSimData = null; 

        function initDB() {
            const savedData = localStorage.getItem('agrinho_db_v3');
            if (savedData) {
                dbLeaderboard = JSON.parse(savedData);
            } else {
                dbLeaderboard = [
                    { name: 'Ana Souza', crop: 'feijao', env: 95, profit: 680000 },
                    { name: 'Pedro Santos', crop: 'soja', env: 85, profit: 982000 },
                    { name: 'Mariana Lima', crop: 'milho', env: 75, profit: 810000 }
                ];
                localStorage.setItem('agrinho_db_v3', JSON.stringify(dbLeaderboard));
            }
            renderLeaderboard();
        }

        function renderLeaderboard(highlightName = null) {
            const tbody = document.getElementById('leaderboard-body');
            tbody.innerHTML = '';
            
            const cropNames = { 'soja': 'Soja', 'milho': 'Milho', 'feijao': 'Feijão' };

            dbLeaderboard.forEach(entry => {
                const tr = document.createElement('tr');
                if (entry.name === highlightName) tr.className = 'current-player';
                
                tr.innerHTML = `
                    <td>${entry.name}</td>
                    <td>${cropNames[entry.crop] || entry.crop}</td>
                    <td>${entry.env}%</td>
                    <td>${formatCurrency(entry.profit)}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        const feedback = document.getElementById('feedback');
        function showFeedback(msg, color) {
            feedback.innerText = msg;
            feedback.style.color = color || 'var(--agrinho-blue)';
            setTimeout(() => { if (!feedback.innerText.includes('👆')) feedback.innerText = ''; }, 3000);
        }

        function switchGame(event, mode) {
            document.querySelectorAll('.game-section').forEach(sec => sec.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            
            document.getElementById('game-' + mode).classList.add('active');
            if (event) event.currentTarget.classList.add('active');
            feedback.innerText = '';
        }

        // MODO 1: CLASSIFICAÇÃO
        const practices = [
            { id: 'p1', text: 'Rodar Culturas 🌽', type: 'good' }, 
            { id: 'p2', text: 'Uso de Joaninhas 🐞', type: 'good' },
            { id: 'p3', text: 'Plantio Direto 🍂', type: 'good' }, 
            { id: 'p4', text: 'Integração Floresta 🌲', type: 'good' },
            { id: 'p6', text: 'Cortar Árvores 🪓', type: 'bad' }, 
            { id: 'p7', text: 'Queimar o mato 🔥', type: 'bad' },
            { id: 'p8', text: 'Monocultura de Soja 📉', type: 'bad' }, 
            { id: 'p9', text: 'Excesso de Agrotóxicos 🧪', type: 'bad' }
        ];

        let draggedCard = null;

        function initDragGame() {
            const pool = document.getElementById('pool');
            pool.innerHTML = '';
            practices.sort(() => Math.random() - 0.5).forEach(p => {
                const card = document.createElement('div');
                card.className = 'card'; card.draggable = true; card.id = p.id; card.dataset.type = p.type; card.innerText = p.text;
                
                card.ondragstart = function(e) { draggedCard = this; setTimeout(() => this.classList.add('dragging'), 0); e.dataTransfer.setData('text', this.id); };
                card.ondragend = function() { this.classList.remove('dragging'); draggedCard = null; };
                card.onclick = function() {
                    if (this.draggable === false) return;
                    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                    draggedCard = this;
                    this.classList.add('selected');
                    showFeedback('👆 Você escolheu uma carta! Clique agora no quadro correspondente.');
                };
                pool.appendChild(card);
            });
        }

        document.querySelectorAll('.drop-zone').forEach(z => {
            z.ondragover = e => e.preventDefault();
            z.ondrop = function(e) { e.preventDefault(); if (draggedCard) processMove(this, draggedCard); };
            z.onclick = function() { if (draggedCard && draggedCard.classList.contains('selected')) processMove(this, draggedCard); };
        });

        function processMove(targetZone, cardElement) {
            if (targetZone.dataset.type === cardElement.dataset.type) {
                targetZone.querySelector('.cards-container').appendChild(cardElement); 
                cardElement.draggable = false; cardElement.classList.remove('selected'); cardElement.style.boxShadow = "none";
                showFeedback('✨ Boa! Você ajudou a natureza!', 'var(--good-color)');
                draggedCard = null;
            } else {
                cardElement.style.transform = "translateX(10px)";
                setTimeout(() => cardElement.style.transform = "translateX(0)", 200);
                showFeedback('❌ Cuidado! Isso prejudica o ambiente.', 'var(--bad-color)');
            }
        }

        // MODO 2: EXPLORAÇÃO
        const techs = [
            { id: 't1', icon: '☀️', x: 22, y: 25, name: 'Painéis Solares', desc: 'Energia limpa para a fazenda! Os painéis captam a luz solar e a transformam em eletricidade verde.' },
            { id: 't2', icon: '💧', x: 75, y: 55, name: 'Irrigação Inteligente', desc: 'Sensores medem a umidade do solo e liberam água apenas onde e quando é necessário.' },
            { id: 't3', icon: '🚁', x: 80, y: 20, name: 'Drones de Monitoramento', desc: 'Voam sobre as plantações para analisar a saúde das folhas e identificar focos de pragas.' },
            { id: 't4', icon: '🌱', x: 42, y: 52, name: 'Sensores de Solo', desc: 'Sensores especiais enterrados na terra que enviam em tempo real o nível de umidade e nutrientes.' },
            { id: 't5', icon: '♻️', x: 48, y: 82, name: 'Biodigestor Orgânico', desc: 'Transforma as fezes dos animais e os resíduos de plantio em biogás de energia limpa e adubo!' }
        ];

        let techFound = 0;

        function initExplore() {
            const mapEl = document.getElementById('farm-map');
            const collectList = document.getElementById('collectibles-list');
            
            document.querySelectorAll('.marker').forEach(m => m.remove());
            collectList.innerHTML = '';

            techs.forEach(t => {
                const m = document.createElement('div'); 
                m.className = 'marker'; 
                m.id = `marker-${t.id}`;
                m.style.left = t.x + '%'; 
                m.style.top = t.y + '%';
                m.innerHTML = t.icon;
                
                const handleDiscover = (e) => {
                    e.stopPropagation();
                    document.getElementById('tech-modal').classList.add('show'); 
                    document.getElementById('modal-icon').innerText = t.icon; 
                    document.getElementById('modal-title').innerText = t.name; 
                    document.getElementById('modal-desc').innerText = t.desc; 
                    
                    if (!m.classList.contains('found')) {
                        m.classList.add('found'); 
                        const slot = document.getElementById(`collect-${t.id}`);
                        if (slot) {
                            slot.innerText = t.icon;
                            slot.classList.add('unlocked');
                        }
                        techFound++;
                        updateProgress();
                    }
                };

                m.onclick = handleDiscover;
                m.ontouchstart = handleDiscover;
                mapEl.appendChild(m);

                const slot = document.createElement('div');
                slot.className = 'collectible-slot';
                slot.id = `collect-${t.id}`;
                slot.innerText = '?';
                collectList.appendChild(slot);
            });
        }

        function updateProgress() {
            const progressFill = document.getElementById('innov-progress');
            const percentage = Math.round((techFound / techs.length) * 100);
            progressFill.style.width = `${percentage}%`;
            progressFill.innerText = `${percentage}%`;

            if (techFound === techs.length) {
                setTimeout(() => showFeedback('🏆 MODO 2 CONCLUÍDO! Você encontrou todas as 5 tecnologias!', 'var(--agrinho-blue)'), 1000);
            }
        }

        // MODO 3: SIMULADOR
        let eventModifier = { env: 0, profit: 0 };
        let pendingSimParams = null;

        function formatCurrency(value) {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        function triggerSimulation() {
            const name = document.getElementById('sim-name').value.trim();
            if (!name) { alert("Diga o seu nome de produtor para podermos salvar o seu progresso na Base de Dados!"); return; }

            document.getElementById('dashboard-panel').style.display = 'flex';
            document.getElementById('leaderboard-section').style.display = 'none';
            eventModifier = { env: 0, profit: 0 }; 

            pendingSimParams = {
                name: name,
                size: parseInt(document.getElementById('sim-size').value),
                crop: document.querySelector('input[name="sim-crop"]:checked').value,
                soil: document.querySelector('input[name="sim-soil"]:checked').value,
                water: document.querySelector('input[name="sim-water"]:checked').value,
                prot: document.querySelector('input[name="sim-prot"]:checked').value
            };

            if (Math.random() < 0.35) {
                document.getElementById('event-modal').classList.add('show');
            } else {
                runSimulationCalc(pendingSimParams);
            }
        }

        function resolveEvent(choice) {
            document.getElementById('event-modal').classList.remove('show');
            if (choice === 'bio') {
                eventModifier.env = 5; eventModifier.profit = -10000; 
                showFeedback('🐛 As Vespas Parasitoides venceram as lagartas naturalmente!', 'var(--good-color)');
            } else {
                eventModifier.env = -15; eventModifier.profit = 15000; 
                showFeedback('⚠️ Químico aplicado. Lagartas controladas, mas os polinizadores sofreram!', 'var(--bad-color)');
            }
            setTimeout(() => { runSimulationCalc(pendingSimParams); }, 1000);
        }

        function runSimulationCalc(data) {
            let envScore = 50, profitPerHa = 0, yieldPerHa = 0;

            if (data.crop === 'soja') { profitPerHa += 4000; yieldPerHa = 70; envScore -= 10; }
            else if (data.crop === 'milho') { profitPerHa += 3000; yieldPerHa = 90; envScore += 5; }
            else if (data.crop === 'feijao') { profitPerHa += 2500; yieldPerHa = 50; envScore += 15; }

            if (data.soil === 'direto') { profitPerHa += 200; envScore += 20; }
            else if (data.soil === 'convencional') { profitPerHa -= 100; envScore -= 10; }
            else if (data.soil === 'ruim') { profitPerHa -= 800; yieldPerHa -= 15; envScore -= 30; }

            if (data.water === 'gotejo') { profitPerHa += 500; envScore += 15; yieldPerHa += 5; }
            else if (data.water === 'aspersao') { profitPerHa -= 300; envScore -= 5; }
            else if (data.water === 'sequeiro') { profitPerHa += 100; envScore += 5; yieldPerHa -= 10; document.getElementById('map-weather').innerText = 'Clima: Risco de Seca 🌡️'; }

            if (data.prot === 'bio') { profitPerHa -= 100; envScore += 20; }
            else if (data.prot === 'quim_resp') { profitPerHa += 100; envScore -= 5; }
            else if (data.prot === 'quim_excesso') { profitPerHa -= 500; envScore -= 25; yieldPerHa += 2; }

            let totalProfit = (profitPerHa * data.size) + (eventModifier.profit * (data.size/100));
            let totalYield = yieldPerHa * data.size;
            envScore += eventModifier.env;

            if (envScore > 100) envScore = 100; if (envScore < 0) envScore = 0; if (totalProfit < 0) totalProfit = 0;

            currentSimData = { ...data, profit: totalProfit, yield: totalYield, env: envScore };

            updateDashboardUI(currentSimData);
            document.getElementById('dashboard-panel').scrollIntoView({ behavior: 'smooth' });
        }

        function updateDashboardUI(result) {
            document.getElementById('res-profit').innerText = formatCurrency(result.profit);
            document.getElementById('res-yield').innerText = result.yield.toLocaleString() + ' sc';
            document.getElementById('res-env').innerText = result.env + '%';

            let prodPercent = Math.max(20, 100 - result.env); 
            document.getElementById('bar-prod').style.width = prodPercent + '%';
            document.getElementById('bar-eco').style.width = result.env + '%';

            const msgEl = document.getElementById('balance-msg');
            if (result.env >= 80) { msgEl.innerText = "🏆 Você é um Agricultor Sustentável de Topo!"; msgEl.style.color = "var(--good-color)"; } 
            else if (result.env < 50) { msgEl.innerText = "⚠️ Cuidado! A sua terra está se degradando rapidamente."; msgEl.style.color = "var(--bad-color)"; } 
            else { msgEl.innerText = "⚖️ Obteve bom lucro, mas pode cuidar melhor da biodiversidade!"; msgEl.style.color = "#f39c12"; }

            document.querySelectorAll('.badge').forEach(b => b.classList.remove('earned'));
            if (result.prot === 'bio') document.getElementById('badge-abelha').classList.add('earned');
            if (result.water === 'gotejo') document.getElementById('badge-agua').classList.add('earned');
            if (result.soil === 'direto') document.getElementById('badge-carbono').classList.add('earned');
            if (result.env >= 85) document.getElementById('badge-agrinho').classList.add('earned');

            const reportBox = document.getElementById('agronomist-report');
            reportBox.style.display = 'block';
            if (result.env >= 80) {
                document.getElementById('report-text').innerText = "Parabéns! Você entendeu perfeitamente o espírito do Programa Agrinho. Conseguiu gerar uma colheita rentável sem prejudicar as águas, o solo ou as abelhas locais!";
                reportBox.style.borderLeftColor = "var(--good-color)";
            } else {
                document.getElementById('report-text').innerText = "Recomendamos que repense as suas práticas. O uso excessivo de pesticidas e a falta de cobertura vegetal (Plantio Direto) estão deixando o seu campo vulnerável a chuvas fortes e pragas.";
                reportBox.style.borderLeftColor = "var(--bad-color)";
            }

            drawSatelliteMap(result);
        }

        function drawSatelliteMap(result) {
            const grid = document.getElementById('sat-grid');
            grid.innerHTML = ''; 
            const cellCount = result.size === 1000 ? 16 : 8;
            
            let emojiCultivo = '🌾';
            if(result.crop === 'milho') emojiCultivo = '🌽';
            if(result.crop === 'feijao') emojiCultivo = '🌱';

            for (let i = 0; i < cellCount; i++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                if (i === 0 || i === cellCount - 1) {
                    cell.classList.add('cell-forest'); cell.innerText = '🌲'; 
                } else {
                    if (result.env < 40 && Math.random() > 0.5) {
                        cell.classList.add('cell-degraded'); cell.innerText = '🟤'; 
                    } else {
                        cell.innerText = emojiCultivo;
                    }
                }
                grid.appendChild(cell);
            }
        }

        function voltarParaEdicao() {
            document.getElementById('form-panel').scrollIntoView({ behavior: 'smooth' });
        }

        function recomecarTudo() {
            document.getElementById('sim-name').value = '';
            document.querySelectorAll('input[type="radio"][value="soja"], input[type="radio"][value="direto"], input[type="radio"][value="gotejo"], input[type="radio"][value="bio"]').forEach(r => r.checked = true);
            document.getElementById('dashboard-panel').style.display = 'none';
            document.getElementById('form-panel').scrollIntoView({ behavior: 'smooth' });
            currentSimData = null;
        }

        function salvarNaBaseDeDados() {
            if (!currentSimData) return;
            
            dbLeaderboard.unshift({
                name: currentSimData.name,
                crop: currentSimData.crop,
                env: currentSimData.env,
                profit: currentSimData.profit
            });
            
            if (dbLeaderboard.length > 5) dbLeaderboard.pop();
            
            localStorage.setItem('agrinho_db_v3', JSON.stringify(dbLeaderboard));
            renderLeaderboard(currentSimData.name);
            
            document.getElementById('leaderboard-section').style.display = 'block';
            document.getElementById('leaderboard-section').scrollIntoView({ behavior: 'smooth' });
            
            alert('🎉 A sua simulação foi salva na Base de Dados com sucesso!');
        }

        // Iniciar tudo
        window.onload = function() {
            initDB();
            initDragGame();
            initExplore();
        };
    