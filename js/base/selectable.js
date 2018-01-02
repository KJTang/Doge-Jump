import InputManager   from '../manager/input_manager'
import Node     from './node'
import Logger   from './logger'

export default class Selectable extends Node {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(x, y, width, height);
    }

    onEnable() {
        // Logger.print("Selectable onEnable: " + this.rect.toString());
        InputManager.instance.addSelectable(this);
    }

    onDisable() {
        // Logger.print("Selectable onDisable");
        InputManager.instance.removeSeleactable(this);
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
