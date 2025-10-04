import { GameFacesData } from "./portrait-manager.js";
import { PortraitDisplay } from "./portrait-display.js";

console.log("Game Faces | Hello wodlr");

class AddPortraitMenu extends foundry.applications.api.HandlebarsApplicationMixin(
	foundry.applications.api.ApplicationV2
) {
	static DEFAULT_OPTIONS = {
		id: "add-portrait-menu",
		window: {
			title: "Add Portrait",
			resizable: false,
		},
		position: { width: 400 },
	};

	static PARTS = {
		form: {
			template: "modules/game-faces/templates/add-portrait.hbs",
		},
	};

	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		const controlledActors = game.actors.filter((a) => a.isOwner);
		context.actors = controlledActors.map((a) => ({
			id: a.id,
			name: a.name,
		}));
		return context;
	}

	_onRender(context, options) {
		super._onRender(context, options);

		this.element
			.querySelector('button[name="browse"]')
			?.addEventListener("click", () => {
				const fp =
					new foundry.applications.apps.FilePicker.implementation({
						type: "image",
						callback: (path) => {
							this.element.querySelector(
								'input[name="path"]'
							).value = path;
						},
					});
				fp.render(true);
			});

		const form = this.element.querySelector("form");
		if (form && !form.dataset.gfBound) {
			form.dataset.gfBound = "true";

			form.addEventListener("submit", async (event) => {
				event.preventDefault();

				const submitBtn = form.querySelector('button[type="submit"]');
				if (submitBtn) submitBtn.disabled = true;

				try {
					const formEntries = new FormData(form);
					const data = Object.fromEntries(formEntries.entries());
					const actorId = (data.actor || "").trim();
					const path = (data.path || "").trim();

					if (!actorId || !path) {
						ui.notifications.warn(
							"Please select an actor and image."
						);
						return;
					}

					const actor = game.actors.get(actorId);
					if (!actor) {
						ui.notifications.error("Selected actor not found.");
						return;
					}

					const currentData =
						GameFacesData.getPortraitsForActor(actorId);
					const filename = path.split("/").pop();
					const label = filename.replace(/\.[^/.]+$/, "");

					// call portrait add
					const result = await GameFacesData.addPortrait(
						actorId,
						path,
						label
					);

					if (!result) {
						// addPortrait returns null when portrait already exists or update failed
						ui.notifications.warn(
							"Portrait not added (it may already exist)."
						);
						return;
					}

					ui.notifications.info(
						`Added new portrait for ${actor.name}`
					);

					if (window.PortraitDisplay) {
						await window.PortraitDisplay.render();
						updatePortraitStyles();
					}

					this.close();
				} catch (err) {
					console.error("Game Faces | Add portrait failed", err);
					ui.notifications.error(
						"Failed to add portrait — check console."
					);
				} finally {
					if (submitBtn) submitBtn.disabled = false;
				}
			});
		}
	}
}

Hooks.on("init", function () {
	console.log("Game Faces | Initialization workflow initiated.");

	game.settings.register(GameFaces.ID, GameFaces.SETTINGS.PORTRAIT_SIZE, {
		name: game.i18n.localize("GAMEFACES.Settings.PortraitSize.Name"),
		hint: game.i18n.localize("GAMEFACES.Settings.PortraitSize.Hint"),
		default: 128,
		type: Number,
		range: { min: 64, max: 256, step: 16 },
		scope: "client",
		config: true,
		onChange: () => {
			updatePortraitStyles();
			window.PortraitDisplay?.render();
		},
	});

	game.settings.register(GameFaces.ID, GameFaces.SETTINGS.BAR_POSITION, {
		name: game.i18n.localize("GAMEFACES.Settings.BarPosition.Name"),
		hint: game.i18n.localize("GAMEFACES.Settings.BarPosition.Hint"),
		default: "top",
		type: String,
		choices: {
			top: game.i18n.localize("GAMEFACES.Settings.BarPosition.ChoiceTop"),
			"above-hotbar": game.i18n.localize(
				"GAMEFACES.Settings.BarPosition.ChoiceAboveHotbar"
			),
		},
		scope: "client",
		config: true,
		onChange: () => {
			updatePortraitStyles();
			window.PortraitDisplay?.render();
		},
	});

	game.settings.register(GameFaces.ID, GameFaces.SETTINGS.EDGE_PADDING, {
		name: game.i18n.localize("GAMEFACES.Settings.EdgePadding.Name"),
		hint: game.i18n.localize("GAMEFACES.Settings.EdgePadding.Hint"),
		default: 10,
		type: Number,
		scope: "client",
		config: true,
		onChange: () => updatePortraitStyles(),
	});

	game.settings.register(GameFaces.ID, GameFaces.SETTINGS.PORTRAIT_GAP, {
		name: game.i18n.localize("GAMEFACES.Settings.PortraitGap.Name"),
		hint: game.i18n.localize("GAMEFACES.Settings.PortraitGap.Hint"),
		default: 8,
		type: Number,
		range: { min: 0, max: Infinity, step: 1 },
		scope: "client",
		config: true,
		onChange: () => updatePortraitStyles(),
	});

	game.settings.register(GameFaces.ID, GameFaces.SETTINGS.DROP_SHADOW, {
		name: game.i18n.localize("GAMEFACES.Settings.DropShadow.Name"),
		hint: game.i18n.localize("GAMEFACES.Settings.DropShadow.Hint"),
		default: true,
		type: Boolean,
		scope: "client",
		config: true,
		onChange: () => updatePortraitStyles(),
	});

	game.settings.register(GameFaces.ID, GameFaces.SETTINGS.BORDER_RADIUS, {
		name: game.i18n.localize("GAMEFACES.Settings.BorderRadius.Name"),
		hint: game.i18n.localize("GAMEFACES.Settings.BorderRadius.Hint"),
		default: 0,
		type: Number,
		range: { min: 0, max: 100, step: 1 },
		scope: "client",
		config: true,
		onChange: () => updatePortraitStyles(),
	});

	game.settings.registerMenu(GameFaces.ID, GameFaces.SETTINGS.ADD_PORTRAIT, {
		name: game.i18n.localize("GAMEFACES.Settings.AddPortraitMenu.Name"),
		label: game.i18n.localize("GAMEFACES.Settings.AddPortraitMenu.Label"),
		hint: game.i18n.localize("GAMEFACES.Settings.AddPortraitMenu.Hint"),
		icon: "fas fa-image",
		type: AddPortraitMenu,
		restricted: false,
	});
});

Hooks.on("ready", function () {
	console.log(
		"Game Faces | Core initialization complete. Game data is available."
	);

	const display = new PortraitDisplay();
	display.createBar();

	updatePortraitStyles();

	display.render();

	window.GameFaces = GameFaces;
	window.GameFacesData = GameFacesData;
	window.PortraitDisplay = display;

	window.addEventListener("resize", () => {
		updatePortraitStyles();
	});

	Hooks.on("renderHotbar", () => {
		updatePortraitStyles();
	});
});


class GameFaces {
	static ID = "game-faces";

	static FLAGS = {
		PORTRAITS: "portraits",
	};

	static SETTINGS = {
		PORTRAIT_SIZE: "portrait-size",
		BAR_POSITION: "bar-position",
		EDGE_PADDING: "edge-padding",
		DROP_SHADOW: "drop-shadow",
		BORDER_RADIUS: "border-radius",
		ADD_PORTRAIT: "add-portrait",
		PORTRAIT_GAP: "portrait-gap"
	};
}

function updatePortraitStyles() {
	const size = game.settings.get(
		GameFaces.ID,
		GameFaces.SETTINGS.PORTRAIT_SIZE
	);
	const dropShadow = game.settings.get(
		GameFaces.ID,
		GameFaces.SETTINGS.DROP_SHADOW
	);
	const borderRadius = game.settings.get(
		GameFaces.ID,
		GameFaces.SETTINGS.BORDER_RADIUS
	);
	const barPosition = game.settings.get(
		GameFaces.ID,
		GameFaces.SETTINGS.BAR_POSITION
	);
	const edgePadding = game.settings.get(
		GameFaces.ID,
		GameFaces.SETTINGS.EDGE_PADDING
	);
	const portraitGap = game.settings.get(
		GameFaces.ID,
		GameFaces.SETTINGS.PORTRAIT_GAP
	);

	let style = document.getElementById("gf-style");
	if (!style) {
		style = document.createElement("style");
		style.id = "gf-style";
		document.head.appendChild(style);
	}

	style.textContent = `
		#gf-bar {
			gap: ${portraitGap}px;
			${barPosition === "top" ? `top: ${edgePadding}px;` : ""}
			${barPosition === "above-hotbar" ? `bottom: calc(100px + 10px);` : ""}
		}

		.gf-img {
			width: ${size}px;
			height: ${size}px;
			border-radius: ${borderRadius}px;
			${dropShadow ? "box-shadow: 0 8px 10px rgba(0,0,0,0.75);" : ""}
		}
	`;
}

export { GameFaces, updatePortraitStyles };

