import Manager      from './manager'
import EventManager from './event_manager'

import Logger       from '../base/logger'
import Vector2      from '../base/vector'

export default class InputManager extends Manager {
    constructor() {
        super();
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        canvas.addEventListener('touchcancel', this.onTouchCancel.bind(this));
    }

    static get instance() {
        if (this._instance == null) {
            this._instance = new InputManager();
        }
        return this._instance;
    }

    onTouchStart(e) {
        e.preventDefault();
        this.curTouchX = e.touches[0].clientX;
        this.curTouchY = e.touches[0].clientY;
        let pos = Vector2.transPos(new Vector2(this.curTouchX, this.curTouchY));
        this.isTouching = true;

        // Logger.print("touch start: " + pos.toString());
        EventManager.instance.dispatch("TouchStart", pos);
    }

    onTouchMove(e) {
        e.preventDefault();
        this.curTouchX = e.touches[0].clientX;
        this.curTouchY = e.touches[0].clientY;
    }

    onTouchEnd(e) {
        e.preventDefault();
        let pos = Vector2.transPos(new Vector2(this.curTouchX, this.curTouchY));
        this.isTouching = false;

        // Logger.print("touch end: " + pos.toString());
        EventManager.instance.dispatch("TouchEnd", pos);
    }

    onTouchCancel(e) {
        e.preventDefault();
        this.isTouching = false;
    }
}