import Logger from '../../base/logger'
import Action from './action'

export default class ActionCallFunc extends Action {
    constructor(func, delay = 0) {
        super();
        this.callback = func;
        this.delay = delay;
        this.timer = 0;
    }

    onInit() {
        this.timer = 0;
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.delay) {
            this.callback();
            this.finished = true;
        }
    }

    onDestory() {}
}