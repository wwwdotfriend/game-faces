import { GameFacesData } from "./portrait-manager.js";
import { PortraitDisplay } from "./portrait-display.js";

console.log("Game Faces | Hello wodlr");

Hooks.on("init", function () {
	console.log("Game Faces | Initialization workflow initiated.");
});

Hooks.on("ready", function () {
	console.log(
		"Game Faces | Core initialization complete. Game data is available."
	);

	const display = new PortraitDisplay();
	display.createBar();
	display.render();

    window.GameFaces = GameFaces;
    window.GameFacesData = GameFacesData;
    window.PortraitDisplay = display;
});

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
	registerPackageDebugFlag(ToDoList.ID);
});

class GameFaces {
	static ID = "game-faces";

	static FLAGS = {
		PORTRAITS: "portraits",
	};

	static log(force, ...args) {
		const shouldLog =
			force ||
			game.modules.get("_dev-mode")?.api?.getPackageDebugValue(this.ID);

		if (shouldLog) {
			console.log(this.ID, "|", ...args);
		}
	}
}

export { GameFaces };
