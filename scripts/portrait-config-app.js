export class PortraitConfigApp extends ApplicationV2 {
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "portrait-config-app",
    title: game.i18n.localize("GAMEFACES.PortraitConfigTitle"),
    template: "modules/game-faces/templates/portrait-config.hbs",
    width: 500,
    height: "auto",
    resizable: true
  };

  constructor(actor, options = {}) {
    super(options);
    this.actor = actor; // Store the actor or relevant data
  }

  // Prepare data for the template
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    // Add any other data you want to pass to the template
    // e.g., context.expressions = ...;
    return context;
  }

  // Optionally handle form submission
  async _onSubmitForm(formConfig, event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // Process formData and update actor flags or data as needed
    // await this.actor.setFlag("game-faces", "portraits", ...);
    this.close();
  }
}