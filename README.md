![Static Badge](https://img.shields.io/badge/FOUNDRY-V13-red?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/All%20Systems-red?style=for-the-badge)
[![Foundry Package Badge](https://img.shields.io/badge/Foundry%20Package-1.0.0-red?style=for-the-badge&logo=foundryvirtualtabletop)](https://foundryvtt.com/packages/game-faces)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/internetfriendstudios)

![Static Badge](https://img.shields.io/badge/Discord-internetfriend-5865F2?style=for-the-badge&logo=discord&logoColor=5865F2)


<h1 style="text-align: center;">Game Faces</h1>

![Portrait Bar Screenshot](https://i.imgur.com/LyvjwS4.png)

<p style="text-align: center;"><i><b>A lightweight roleplay portrait switcher for you and your party.</i></b></p>


<p style="text-align: center;"><i>Let your players show you how they really feel.</i></b></p>

---

## Overview

Game Faces adds a customizable portrait bar to Foundry VTT, allowing players to switch between multiple portrait expressions for their characters.  
Portraits can be added, renamed, removed, or switched for a different image.

---

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Chat Commands](#chat-commands)
- [Settings](#settings)
- [Adding and Managing Portraits](#adding-and-managing-portraits)
- [Installation](#installation)
- [Compatibility](#compatibility)
- [Known Issues](#known-issues)
- [License](#license)
- [Credits](#credits)

---

## Features

- Portrait bar that displays all actors with available portraits
- Click portraits to change facial expressions
- Right-click to configure available portraits per actor
- Add portraits directly through the module or settings menu
- Client-side customizable display settings
- Chat commands for changing your portrait so you can make macros.

---

## Screenshots

### Portrait Bar Top
![Portrait Bar Screenshot](https://i.imgur.com/LyvjwS4.png)

### Portrait Bar Bottom
![Portrait Bar Bottom](https://i.imgur.com/0Buv2Ow.png)

### Left Click Menu
![Left Click Menu](https://i.imgur.com/QJTyhun.png)

### Right Click Menu / Portrait Config  
![Portrait Configuration Screenshot](https://i.imgur.com/oIbeJO0.png)


---

## Chat Commands

Game Faces adds a chat command for quick expression switching:

| Command | Description |
|----------|-------------|
| `/gf [label]` | Change your controlled actor’s portrait to the expression with the given label. |
| `/gf toggle` or `/gft` | Toggle clientside visibility of the portrait bar. |

---

## Settings

Game Faces provides several client-side options under **Module Settings**.

| Setting | Description |
|----------|-------------|
| **Add Portrait (GM Only)**| Select an actor and add a portrait. |
| **Portrait Size** | Size of portrait images in pixels (default: 128). |
| **Bar Position** | Choose where to display the portrait bar (Top of screen or Above hotbar). |
| **Top Padding** | Distance from top edge in pixels (only applies if Bar Position is Top). |
| **Portrait Gap** | Change how the amount of space in pixels between each portrait. |
| **Drop Shadow** | Toggle a drop shadow around portrait images. |
| **Border Radius** | Control how round each portrait is. |

---

## Adding and Managing Portraits

### Add a New Portrait (GMs Only)
#### If Actor Has No Portraits
1. In the Game Settings (Sidebar → Cogwheel), go to **Configure Settings → Game Faces → Add Portrait**.
2. Select an actor.
3. Browse or enter an image path.
4. Save to add the portrait.

#### If Actor Has Portraits
1. Right click an actor's portrait.
2. Select `Add` on the bottom of the menu.
3. Select or upload a new portrait.

### Manage Existing Portraits
Right-click a portrait in the bar to open the configuration window. You can:
- Add or remove portraits
- Rename portrait labels
- Replace existing portrait images

---

## Installation

### Method 1: Foundry VTT Module Browser
Search for **Game Faces** in the module browser and install directly or paste the [Manifest Link](https://github.com/wwwdotfriend/game-faces/releases/download/1.0.0/module.json).

```
https://github.com/wwwdotfriend/game-faces/releases/download/1.0.0/module.json
```

### Method 2: Manual Installation
1. Download the latest release from [Releases](#).
2. Extract the `game-faces` to your Foundry `Data/modules` directory.
3. Enable **Game Faces** in your World’s Module Settings.

---

## Compatibility

- **Foundry VTT Version:** v13+
- **Systems:** Should work with all systems

---

## Known Issues

- Portrait bar position updates may require a brief refresh/reload in some cases.

---

## Todo
- Finish localization
- Hover tooltips for portraits
- Portrait borders
- Hide button
- More styling options

## Features I Might Add
- Mood indicators
- GIF or WebM support
- Show initiative in combat
- Show IC Chat messages under portrait

---

## License

This module is distributed under the MIT License.  
See [LICENSE](LICENSE) for details.

---

## Credits
 
**Spanish Localization:** kermitthefrogfan

**Support:** Add me on Discord `internetfriend` 

![Static Badge](https://img.shields.io/badge/Discord-internetfriend-5865F2?style=for-the-badge&logo=discord&logoColor=5865F2)

