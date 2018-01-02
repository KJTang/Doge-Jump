import Manager  from './manager'
import Logger   from '../base/logger'

export default class GameManager extends Manager {
    static get instance() {
        if (this._instance == null) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    restart() {
    }

    get screenWidth() {
        return window.innerWidth;
    }

    get screenHeight() {
        return window.innerHeight;
    }
}