import { GameFacesData } from "./portrait-manager.js";

class PortraitDisplay {
	constructor() {
		this.bar = null;
	}

	createBar() {
		const bar = document.createElement("div");
		bar.id = "gf-bar";
		bar.classList.add("gf-bar");

		document.body.appendChild(bar);
		this.bar = bar;
	}

	createContainer(actorId) {
		const container = document.createElement("div");
		container.id = `gf-container-${actorId}`;
		container.classList.add("gf-container");
		return container;
	}

	createPortraitImage(actor) {
		const data = GameFacesData.getPortraitsForActor(actor.id);
		if (data.portraits.length === 0) {
			console.warn(`Game Faces | No portraits for ${actor.id}`);
			return null;
		}
		const img = document.createElement("img");
		img.src = data.portraits[data.activeIndex];
		img.alt = actor.name;
		img.classList.add("gf-img");
		img.dataset.actorId = actor.id;

		return img;
	}

	setupContextMenus() {
		const portraits = this.bar.querySelectorAll(".gf-img");

		portraits.forEach((img) => {
			img.addEventListener("click", async (event) => {
				const actorId = img.dataset.actorId;
				const actor = game.actors.get(actorId);

				if (!actor.isOwner) {
					ui.notifications.warn(
						game.i18n.localize("GAMEFACES.NoPermissionExpression")
					);
					return;
				}

				const data = GameFacesData.getPortraitsForActor(actorId);

				const buttons = data.labels.map((label, index) => ({
					action: `emotion${index}`,
					label,
					// icon: '<i class="fas fa-masks-theater"></i>',
					default: index === data.activeIndex,
					callback: () => {
						GameFacesData.setActivePortrait(actorId, index);
						img.src = data.portraits[index];
					},
				}));

				foundry.applications.api.DialogV2.wait({
					window: {
						title: game.i18n.localize("GAMEFACES.WindowTitle"),
					},
					content: `<p>${game.i18n.format(
						"GAMEFACES.SelectExpressionFor",
						{ name: actor.name }
					)}</p>`,
					buttons,
					rejectClose: false,
				});
			});

			img.addEventListener("contextmenu", async (event) => {
				event.preventDefault();
				const actorId = img.dataset.actorId;
				const actor = game.actors.get(actorId);

				if (!actor?.isOwner) {
					ui.notifications.warn(
						game.i18n.localize("GAMEFACES.NoPermissionExpression")
					);
					return;
				}

				const old = document.getElementById("gf-context-overlay");
				if (old) old.remove();

				const overlay = document.createElement("div");
				overlay.id = "gf-context-overlay";
				overlay.className = "gf-context-overlay";

				const title =
					game.i18n.localize("GAMEFACES.WindowTitle") ||
					"Configure Portraits";
				const bodyText =
					game.i18n.format("GAMEFACES.ConfigurePortraitsFor", {
						name: actor.name,
					}) || "";

				overlay.innerHTML = `
					<div class="gf-dialog" role="dialog" aria-modal="true" aria-label="${title}">
						<header class="gf-dialog-header"><h3>${title}</h3></header>
						<div class="gf-dialog-body">${bodyText}</div>
						<footer class="gf-dialog-footer">
							<button class="gf-btn gf-btn-primary" data-action="open">Open Config</button>
							<button class="gf-btn" data-action="cancel">Cancel</button>
						</footer>
					</div>
					`;

				document.body.appendChild(overlay);


				const dialog = overlay.querySelector(".gf-dialog");
				const firstBtn = overlay.querySelector("button");
				if (firstBtn) firstBtn.focus();

				const cleanup = () => {
					overlay.remove();
					document.removeEventListener("keydown", onKeyDown);
					document.removeEventListener("click", onOutsideClick);
				};

				const onOutsideClick = (e) => {
					if (!dialog.contains(e.target)) cleanup();
				};

				const onKeyDown = (e) => {
					if (e.key === "Escape") cleanup();

					if (e.key === "Tab") {
						const focusable = Array.from(
							dialog.querySelectorAll("button")
						);
						if (focusable.length === 0) return;
						const idx = focusable.indexOf(document.activeElement);
						if (e.shiftKey) {
							if (idx === 0) {
								focusable[focusable.length - 1].focus();
								e.preventDefault();
							}
						} else {
							if (idx === focusable.length - 1) {
								focusable[0].focus();
								e.preventDefault();
							}
						}
					}
				};

				dialog.addEventListener("click", (e) => {
					e.stopPropagation();
					const btn = e.target.closest("button[data-action]");
					if (!btn) return;
					const action = btn.dataset.action;
					if (action === "open") {
						if (window.PortraitConfigApp) {
							const actorObj = game.actors.get(actorId);
							new window.PortraitConfigApp(actorObj).render(true);
						} else {
							ui.notifications.info(
								game.i18n.localize(
									"GAMEFACES.OpenConfigPlaceholder"
								) || "Open Config"
							);
						}
					}
					cleanup();
				});

				document.addEventListener("click", onOutsideClick);
				document.addEventListener("keydown", onKeyDown);
			});
		});
	}

	render() {
		if (!this.bar) {
			console.error("Game Faces | Bar not created yet!");
			return;
		}
		this.bar.innerHTML = "";
		const actors = game.actors.contents;
		const actorsWithPortraits = actors.filter((actor) => {
			const data = GameFacesData.getPortraitsForActor(actor.id);
			return data.portraits.length > 0;
		});
		actorsWithPortraits.forEach((actor) => {
			const container = this.createContainer(actor.id);
			const img = this.createPortraitImage(actor);
			if (img) {
				container.appendChild(img);
			}
			this.bar.appendChild(container);
		});

		this.setupContextMenus();
	}
}

export { PortraitDisplay };
