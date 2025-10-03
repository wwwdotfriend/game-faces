import { GameFaces } from "./game-faces.js";

/**
 * Portrait data for a character
 * @typedef {Object} PortraitData
 * @property {string[]} portraits - Array of portrait image paths
 * @property {string[]} labels - Array of emotion labels for each portrait
 * @property {number} activeIndex - Index of currently active portrait
 */

class GameFacesData {
	static getPortraitsForActor(actorID) {
		const data = game.actors
			.get(actorID)
			?.getFlag(GameFaces.ID, GameFaces.FLAGS.PORTRAITS);
		return data ?? { portraits: [], labels: [], activeIndex: 0 };
	}

	static updatePortraits(actorId, portraitData) {
		const actor = game.actors.get(actorId);
		if (!actor) {
			console.warn(`Game Faces | Actor with ID ${actorId} not found`);
			return null;
		}
		return actor.setFlag(
			GameFaces.ID,
			GameFaces.FLAGS.PORTRAITS,
			portraitData
		);
	}

	static addPortrait(actorId, portraitPath, label = "Untitled") {
		const currentData = this.getPortraitsForActor(actorId);
		if (currentData.portraits.includes(portraitPath)) {
			console.warn(
				`Game Faces | Portrait already exists: ${portraitPath}`
			);
			return null;
		}
		currentData.portraits.push(portraitPath);
		currentData.labels.push(label);
		return this.updatePortraits(actorId, currentData);
	}

	static setActivePortrait(actorId, index) {
		const currentData = this.getPortraitsForActor(actorId);
		if (
			!currentData ||
			index < 0 ||
			index >= currentData.portraits.length
		) {
			console.warn(`Invalid portrait index: ${index}`);
			return null;
		}
		currentData.activeIndex = index;
		return this.updatePortraits(actorId, currentData);
	}
}

export { GameFacesData };
