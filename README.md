# El Pollo Loco - JSDoc Documentation

## 🎮 About the Game

**El Pollo Loco** is a Jump & Run game developed with Vanilla JavaScript and HTML5 Canvas. The player controls Pepe, who fights against chickens and an end boss.

## 📚 Code Documentation

This project uses **JSDoc** for code documentation. All classes, methods, and important properties are documented.

### Main Classes

- **DrawableObject** - Base class for all renderable objects
- **MovableObject** - Extends DrawableObject with physics and collision detection
- **Character** - The playable character (Pepe)
- **World** - Game engine and rendering pipeline
- **Level** - Level configuration with enemies and collectibles

### Enemies

- **Chicken** - Normal chickens
- **ChickenSmall** - Small chickens
- **Endboss** - Boss enemy with AI

### Collectibles

- **Coin** - Coins to collect
- **Bottle** - Bottles (ammunition for throwing)

### UI Components

- **StatusBar** - Base class for all status bars
- **HealthBar** - Health display
- **CoinBar** - Coin counter
- **BottleBar** - Bottle counter
- **EndbossBar** - Endboss health display

## 🛠️ Generate JSDoc HTML

To create the HTML documentation:

```bash
# Install JSDoc (if not already installed)
npm install -g jsdoc

# Optional: Install nice template
npm install docdash

# Generate documentation
jsdoc -c jsdoc.json

# Or simply:
jsdoc models js levels -d docs -r
```

The generated documentation can be found in the `docs/` folder.

## 📖 View Online

Open `docs/index.html` in your browser to view the generated documentation.

## 🎯 Code Quality

- ✅ All functions ≤14 lines
- ✅ All comments in English
- ✅ JSDoc for all classes and public methods
- ✅ Clean Code principles
- ✅ OOP with inheritance (3 levels)

## 🏗️ Architecture

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

## 📝 JSDoc Tags Used

- `@class` - Class declaration
- `@extends` - Inheritance
- `@type` - Property types
- `@param` - Function parameters
- `@returns` - Return values

## 💡 Example

```javascript
/**
 * Main playable character (Pepe).
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {number} */
  height = 250;

  /**
   * Moves character to the right.
   */
  moveRight() {
    this.x += this.speed;
  }
}
```
