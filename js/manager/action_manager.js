import Manager from './manager'

import Logger from '../base/logger'
import Action from './action/action'

export default class ActionManager extends Manager {
    actions = [];

    static get instance() {
        if (this._instance == null) {
            this._instance = new ActionManager();
        }
        return this._instance;
    }

    update(dt) {
        for (var i = 0; i < this.actions.length; i++) {
            let act = this.actions[i];
            act.update(dt);
            if (act.finished === true) {
                act.onDestory();
                this.actions.splice(i--, 1);
            }
        }
    }

    addAction(act) {
        this.actions.push(act);
        act.onInit();
    }
}