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
						"You don't have permission to change this character's expression."
					);
					return;
				}

				const data = GameFacesData.getPortraitsForActor(actorId);

				const buttons = {};
				data.labels.forEach((label, index) => {
					buttons[`emotion${index}`] = {
						icon: '<i class="fas fa-masks-theater"></i>',
						label: label,
						callback: () => {
							GameFacesData.setActivePortrait(actorId, index);
							img.src = data.portraits[index];
						},
					};
				});

				new Dialog({
					title: "Choose Expression",
					buttons: buttons,
					default: `emotion${data.activeIndex}`,
				}).render(true);
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
