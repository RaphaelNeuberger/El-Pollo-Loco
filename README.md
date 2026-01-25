# El Pollo Loco - JSDoc Documentation

## 🎮 Über das Spiel

**El Pollo Loco** ist ein Jump & Run Spiel, entwickelt mit Vanilla JavaScript und HTML5 Canvas. Der Spieler steuert Pepe, der gegen Hühner und einen Endboss kämpft.

## 📚 Code-Dokumentation

Dieses Projekt verwendet **JSDoc** zur Code-Dokumentation. Alle Klassen, Methoden und wichtigen Properties sind dokumentiert.

### Hauptklassen

- **DrawableObject** - Basisklasse für alle renderbaren Objekte
- **MovableObject** - Erweitert DrawableObject mit Physik und Kollision
- **Character** - Der spielbare Charakter (Pepe)
- **World** - Game Engine und Rendering-Pipeline
- **Level** - Level-Konfiguration mit Gegnern und Sammelobjekten

### Gegner

- **Chicken** - Normale Hühner
- **ChickenSmall** - Kleine Hühner
- **Endboss** - Boss-Gegner mit KI

### Sammelobjekte

- **Coin** - Münzen zum Einsammeln
- **Bottle** - Flaschen (Munition für Würfe)

### UI-Komponenten

- **StatusBar** - Basisklasse für alle Statusanzeigen
- **HealthBar** - Gesundheitsanzeige
- **CoinBar** - Münzen-Counter
- **BottleBar** - Flaschen-Counter
- **EndbossBar** - Endboss-Gesundheit

## 🛠️ JSDoc HTML generieren

Um die HTML-Dokumentation zu erstellen:

```bash
# JSDoc installieren (falls noch nicht vorhanden)
npm install -g jsdoc

# Optional: Schönes Template installieren
npm install docdash

# Dokumentation generieren
jsdoc -c jsdoc.json

# Oder einfach:
jsdoc models js levels -d docs -r
```

Die generierte Dokumentation findest du dann im `docs/` Ordner.

## 📖 Online ansehen

Öffne `docs/index.html` in deinem Browser, um die generierte Dokumentation anzusehen.

## 🎯 Code-Qualität

- ✅ Alle Funktionen ≤14 Zeilen
- ✅ Alle Kommentare auf Englisch
- ✅ JSDoc für alle Klassen und öffentliche Methoden
- ✅ Clean Code Prinzipien
- ✅ OOP mit Vererbung (3 Ebenen)

## 🏗️ Architektur

```
DrawableObject (Rendering)
  ├─ MovableObject (Physik)
  │   ├─ Character
  │   ├─ Enemies (Chicken, ChickenSmall, Endboss)
  │   ├─ Collectables (Coin, Bottle)
  │   └─ ThrowableObject
  └─ StatusBar (UI)
      └─ HealthBar, CoinBar, BottleBar, EndbossBar
```

## 📝 JSDoc Tags verwendet

- `@class` - Klassendeklaration
- `@extends` - Vererbung
- `@type` - Property-Typen
- `@param` - Funktionsparameter
- `@returns` - Rückgabewerte

## 💡 Beispiel

```javascript
/**
 * Main playable character (Pepe).
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {number} Character height in pixels */
  height = 250;

  /**
   * Moves character to the right.
   */
  moveRight() {
    this.x += this.speed;
  }
}
```
