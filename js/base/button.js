import InputManager   from '../manager/input_manager'
import Selectable     from './selectable'
import Vector2        from './vector'
import Sprite         from './sprite'
import Logger         from './logger'

export default class Button extends Selectable {
    constructor(imgNormal, imgSelect, x = 0, y = 0, width = 0, height = 0, callback = null) {
        super(x, y, width, height);
        this.callback = callback;

        this.spriteNormal = new Sprite(imgNormal, width, height, x, y);
        this.addChild(this.spriteNormal);

        this.spriteSelect = new Sprite(imgSelect, width, height, x, y);
        this.addChild(this.spriteSelect);

        this.spriteSelect.enable = false;
    }

    onSelectDown(point) {
        this.spriteNormal.enable = false;
        this.spriteSelect.enable = true;
    }

    onSelectUp(point) {
        this.spriteNormal.enable = true;
        this.spriteSelect.enable = false;
    }

    onSelect(point) {
        if (this.callback != null) {
            this.callback(point);
        }
    }
}
