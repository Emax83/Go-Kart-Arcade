# 🏎️ Go-Kart Arcade

Un gioco arcade di corse go-kart in stile retrò anni ’80, creato con HTML5, CSS3 e JavaScript vanilla.

![Go-Kart Arcade](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎮 Demo

[Gioca Ora!](#) *(Inserisci qui il link al deploy su Vercel)*

## ✨ Caratteristiche

- 🎨 **Grafica retrò anni ’80** con effetti neon e stile arcade
- 🏁 **6 go-kart diversi** con velocità massime differenti (120-160 km/h)
- 👤 **5 piloti selezionabili** con nomi di fantasia
- ⛽ **Sistema di carburante** - raccogli bidoni per continuare
- 🚗 **Ostacoli dinamici** - evita i kart avversari
- 🚀 **Modalità Turbo** - boost di velocità temporaneo
- 💥 **Collisioni realistiche** - ogni scontro costa 1 litro di carburante
- 🏆 **Sistema di record** salvato in localStorage
- ⏸️ **Pausa** con menu di opzioni
- 📱 **Responsive** - giocabile su desktop, tablet e mobile
- 🎹 **Controlli multipli** - touch, mouse e tastiera

## 🎯 Obiettivo

Percorri la **massima distanza possibile** evitando ostacoli e raccogliendo bidoni di carburante. Ogni 1000 metri consumi 1 litro di carburante. Quando finisce, il gioco termina!

## 🕹️ Controlli

### 🖱️ Desktop (Tastiera)

- **⬅️ Freccia Sinistra** - Sposta a sinistra
- **➡️ Freccia Destra** - Sposta a destra
- **⬆️ Freccia Su / Spazio** - Turbo
- **ESC / P** - Pausa

### 📱 Mobile/Tablet (Touch)

- **Pulsante Sinistro** - Sposta a sinistra
- **Pulsante Destro** - Sposta a destra
- **Pulsante Centrale** - Turbo
- **Tieni premuto** per movimento continuo

## 🚀 Caratteristiche dei Kart

|Kart|Colore   |Velocità Max|
|----|---------|------------|
|#1  |🔴 Rosso  |145 km/h    |
|#2  |🔵 Blu    |160 km/h    |
|#3  |🟡 Giallo |130 km/h    |
|#4  |🟢 Verde  |155 km/h    |
|#5  |🟣 Viola  |120 km/h    |
|#6  |🟠 Arancio|140 km/h    |

## 📦 Installazione

### Deploy su Vercel

1. Fai il fork di questo repository
1. Connetti il repository a [Vercel](https://vercel.com)
1. Deploy automatico!

### Esecuzione Locale

```bash
# Clona il repository
git clone https://github.com/tuousername/gokart-arcade.git

# Entra nella cartella
cd gokart-arcade

# Apri index.html nel browser
# Oppure usa un server locale
python -m http.server 8000
# Visita http://localhost:8000
```

## 🛠️ Tecnologie Utilizzate

- **HTML5 Canvas** - Rendering grafico
- **CSS3** - Styling e animazioni
- **JavaScript Vanilla** - Logica di gioco
- **Bootstrap Icons** - Icone UI
- **localStorage** - Salvataggio record

## 📂 Struttura del Progetto

```
gokart-arcade/
│
├── index.html          # File principale del gioco
├── README.md           # Questo file
└── manifest.json       # (Opzionale) Web App Manifest
```

## 🎨 Caratteristiche Tecniche

- ✅ **Zero dipendenze**
- ✅ **Single Page Application** - un unico file HTML
- ✅ **Performance ottimizzate** - 60 FPS costanti
- ✅ **Offline-ready** - giocabile senza connessione dopo il primo caricamento
- ✅ **Progressive Web App** pronta
- ✅ **SEO ottimizzato** con meta tag completi

## 🎯 Gameplay Mechanics

### Sistema Carburante

- **Inizio**: 10 litri
- **Consumo**: 1 litro ogni 1000 metri (1 km)
- **Bidoni carburante**: +5 litri (max 10L)
- **Collisioni**: -1 litro per ogni scontro

### Velocità e Movimento

- **Accelerazione automatica** fino alla velocità massima del kart
- **Turbo**: +30 km/h per 2 secondi
- **Fuori pista**: -70% velocità
- **Dopo collisione**: -50% velocità per 2 secondi

### Record e Punteggi

- Il **record massimo** viene salvato automaticamente
- Visibile nel menu principale
- Aggiornato in tempo reale durante la pausa

## 🐛 Bug Conosciuti

Nessun bug noto al momento. Segnala eventuali problemi nella sezione [Issues](../../issues).

## 🤝 Contribuire

I contributi sono benvenuti!

1. Fai il fork del progetto
1. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
1. Committa le modifiche (`git commit -m 'Add some AmazingFeature'`)
1. Pusha sul branch (`git push origin feature/AmazingFeature`)
1. Apri una Pull Request

## 📝 Roadmap

Funzionalità future pianificate:

- [ ] Modalità multiplayer locale
- [ ] Power-up aggiuntivi (scudo, missile, etc.)
- [ ] Classifiche online
- [ ] Più tracciati/piste
- [ ] Modalità notturna
- [ ] Sistema di livelli
- [ ] Effetti sonori e musica
- [ ] Salvataggio progressi

## 📄 Licenza

Questo progetto è distribuito con licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 👨‍💻 Autore

Creato con ❤️ per gli amanti dei giochi arcade retrò

## 🙏 Ringraziamenti

- Ispirato ai classici giochi arcade degli anni ’80
- Bootstrap Icons per le icone
- La community di developer che mantiene vivo lo spirito retro gaming

## 📞 Contatti

- 🐛 Report bug: [Issues](../../issues)
- 💡 Richieste feature: [Issues](../../issues)
- 🌟 Se ti piace il progetto, lascia una stella!

-----

**Divertiti e batti il tuo record! 🏎️💨**
