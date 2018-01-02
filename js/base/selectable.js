import InputManager   from '../manager/input_manager'
import Node     from './node'
import Logger   from './logger'

export default class Selectable extends Node {
    constructor(width = 0, height = 0, swallowTouch = true) {
        super(width, height, 0, 0);
        this.swallowTouch = swallowTouch;
    }

    onEnable() {
        // Logger.print("Selectable onEnable: " + this.rect.toString());
        InputManager.instance.addSelectable(this);
    }

    onDisable() {
        // Logger.print("Selectable onDisable");
        InputManager.instance.removeSelectable(this);
    }

    // ui event, when touch screen, current obj was touched, will call these
    onSelectDown(point) {
        // Logger.print("onSelectDown: " + point.toString());
    }

    onSelectUp(point) {
        // Logger.print("onSelectUp: " + point.toString());
    }

    onSelect(point) {
        // Logger.print("onSelect: " + point.toString());
    }
}
