import Manager  from './manager'
import Vector2  from '../base/vector'
import Logger   from '../base/logger'

export default class GameManager extends Manager {
    _designResolution = new Vector2(window.innerWidth, window.innerHeight);
    _designStyle = 1;
    _scaleRate = 1;
    _scaleOffset = new Vector2(0, 0);
    _frameCnt = 0;  // debug

    static get instance() {
        if (this._instance == null) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    restart() {
        this.designResolution = new Vector2(360, 640);
        this.designStyle = 1;
        Logger.print("GameManager: designResolution: " + this.designResolution);
        Logger.print("GameManager: screenSize: " + new Vector2(this.screenWidth, this.screenHeight).toString());
        Logger.print("GameManager: scaleRate: " + this.scaleRate);

        // game data
        this._frameCnt = 0;
        this._score = 0;
    }

    update(dt) {
        this._frameCnt += 1;
    }

    get frameCnt() {
        return this._frameCnt;
    }

    get score() {
        return this._score;
    }

    scoreUp(up = 1) {
        this._score += up;
    }

    scoreClear() {
        this._score = 0;
    }

    get screenWidth() {
        return window.innerWidth;
    }

    get screenHeight() {
        return window.innerHeight;
    }

    set designResolution(value) {
        this._designResolution = value;

        if (this.designStyle == 1) {
            // 1: fit width, expend height
            this._scaleRate = window.innerWidth / this._designResolution.x;
            this._scaleOffset = new Vector2(0, (this._designResolution.y * this._scaleRate - window.innerHeight) / 2);
        } else if (this.designStyle == 2) {
            // 2: fit height, expend width
            this._scaleRate = window.innerHeight / this._designResolution.y;
            this._scaleOffset = new Vector2((this._designResolution.x * this._scaleRate - window.innerWidth) / 2, 0);
        } else {
            // default: fit width, expend height
            this._scaleRate = window.innerWidth / this._designResolution.x;
            this._scaleOffset = new Vector2(0, (this._designResolution.y * this._scaleRate - window.innerHeight) / 2);
        }
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

    set designStyle(value) {
        this._designStyle = value;
        this.designResolution = this.designResolution;
    }

    get designStyle() {
        return this._designStyle;
    }

    get scaleRate() {
        return this._scaleRate;
    }

    get scaleOffset() {
        return this._scaleOffset;
    }

    transPointCanvasToWorld(pos) {
        pos.y = window.innerHeight - pos.y; // reverse coord-y
        return new Vector2(pos.x / this.scaleRate + this.scaleOffset.x, pos.y / this.scaleRate + this.scaleOffset.y);
    }
}