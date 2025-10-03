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
			console.warn(`Game Faces | No portraits for ${actorId}`);
			return null;
		}
		const img = document.createElement("img");
		img.src = data.portraits[data.activeIndex];
		img.alt = actor.name;
		img.classList.add("gf-img");
		img.addEventListener("click", () => {
			// TODO: Open context menu with emotion labels
		});
		return img;
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
	}
}

export { PortraitDisplay };
