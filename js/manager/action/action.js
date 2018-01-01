import Logger from '../../base/logger'

export default class Action {
    constructor() {
        this.finished = false;
    }

    onInit() {}

    update(dt) {}

    onDestory() {}

    get finished() {
        return this._finished;
    }

    set finished(value) {
        this._finished = value;
    }
}