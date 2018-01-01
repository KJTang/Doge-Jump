import Manager from './manager'
import Logger from '../base/logger'

export default class EventManager extends Manager {
    constructor() {
        super();
    }

    static get instance() {
        if (this._instance == null) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    restart() {
        this.events = new Object();
    }

    addEventListener(evt, callback) {
        if (this.events[evt] == null) {
            this.events[evt] = [];
        }
        this.events[evt].push(callback);
    }

    removeEventListener(evt, callback) {
        let list = this.events[evt];
        if (list != null) {
            for (var i = 0; i != list.length; ++i) {
                if (list[i] == callback) {
                    this.events[evt].splice(i, 1);
                    break;
                }
            }
        }
    }

    dispatch(evt, data = null) {
        let list = this.events[evt];
        if (list != null) {
            list.forEach(function(listener) {
                listener(data);
            });
        }
    }
}