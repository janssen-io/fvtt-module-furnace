
/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
 * @type {BasePlaceableHUD}
 */
class FurnaceDrawingHUD extends DrawingHUD {
  // Override the constructor's name
  static get name() {
    return "DrawingHUD"
  }
  /**
   * Assign the default options which are supported by the entity edit sheet
   * @type {Object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "public/modules/furnace/templates/drawing-hud.html"
    });
  }

  /* -------------------------------------------- */

  /* -------------------------------------------- */

  setPosition() {
    let width = this.object.data.width
    let height = this.object.data.height
    let x = this.object.data.x + (width > 0 ? 0 : width)
    let y = this.object.data.y + (height > 0 ? 0 : height)
    const position = {
      width: Math.abs(width) + 150,
      height: Math.abs(height) + 20,
      left: x - 70,
      top: y - 5
    };
    this.element.css(position);
  }

  /* -------------------------------------------- */

  /**
   * Activate event listeners which provide interactivity for the Token HUD application
   * @param html
   */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".config").click(this._onDrawingConfig.bind(this));
    // Color change inputs
    html.find('input[type="color"]').change(this._onColorPickerChange.bind(this));
  }

  /* -------------------------------------------- */
  async _onColorPickerChange(event) {
    event.preventDefault();
    let data = {}
    data[event.target.name] = event.target.value
    const drawings = this.object._controlled ? canvas.drawings.controlled : [this.object];
    for (let d of drawings) {
      // If user sets a fill color but fill is NONE then change it
      if (event.target.name == "fillColor" && d.fillType == FURNACE_DRAWING_FILL_TYPE.NONE)
        data.fillType = FURNACE_DRAWING_FILL_TYPE.SOLID;
      await d.update(canvas.scene._id, data)
      delete data.fillType
    }
    this.render()
    this.object.layer.updateStartingData(this.object)
  }

  _onToggleVisibility(event) {
    this._onToggleField(event, "hidden")
  }
  _onToggleLocked(event) {
    this._onToggleField(event, "locked")
  }

  async _onToggleField(event, field) {
    event.preventDefault();
    let btn = $(event.currentTarget);
    let isEnabled = this.object.data[field];
    const drawings = this.object._controlled ? canvas.drawings.controlled : [this.object];
    for (let d of drawings) {
      await d.update(canvas.scene._id, { [field]: !isEnabled });
    }
    btn.toggleClass("active");
  }

  /**
   * Handle Drawing configuration button click
   * @private
   */
  _onDrawingConfig(event) {
    event.preventDefault();
    this.object.sheet.render(true);
  }
}

