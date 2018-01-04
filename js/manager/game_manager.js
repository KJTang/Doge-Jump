import Manager  from './manager'
import Vector2  from '../base/vector'
import Logger   from '../base/logger'

export default class GameManager extends Manager {
    _designResolution = new Vector2(window.innerWidth, window.innerHeight);
    _scaleRate = 1;

    static get instance() {
        if (this._instance == null) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    restart() {
        this.designResolution = new Vector2(360, 640);
        Logger.print("GameManager scaleRate: " + this.scaleRate);
    }

    get screenWidth() {
        return window.innerWidth;
    }

    get screenHeight() {
        return window.innerHeight;
    }

    set designResolution(value) {
        this._designResolution = value;

        // default: fit width, expend height
        this._scaleRate = window.innerWidth / this._designResolution.x;
    }

    get designResolution() {
        return this._designResolution;
    }

    get designWidth() {
        return this._designResolution.x;
    }

    get designHeight() {
        return this._designResolution.y;
    }

    get scaleRate() {
        return this._scaleRate;
    }

    transPointCanvasToWorld(pos) {
        pos.y = window.innerHeight - pos.y; // reverse coord-y
        return new Vector2(pos.x / this.scaleRate, pos.y / this.scaleRate);
    }
}