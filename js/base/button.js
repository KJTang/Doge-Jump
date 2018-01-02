import InputManager   from '../manager/input_manager'
import Selectable     from './selectable'
import Vector2        from './vector'
import Sprite         from './sprite'
import Logger         from './logger'

export default class Button extends Selectable {
    constructor(x = 0, y = 0, width = 0, height = 0, callback = null) {
        super(x, y, width, height);
        // Logger.print("button " + this.rect.toString());
        this.callback = callback;

        this.spriteNormal = new Sprite('images/enemy.png', width, height, x, y);
        this.addChild(this.spriteNormal);
    }

    onSelect(point) {
        // Logger.print("button onSelect: " + point.toString());
        if (this.callback != null) {
            this.callback(point);
        }
    }
}
