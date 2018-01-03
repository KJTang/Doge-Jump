import Manager  from './manager'
import Logger   from '../base/logger'
import Node     from '../base/node'

export default class SceneManager extends Manager {
    constructor() {
        super();
        this.curScene = null;
        this.quitGame = false;
    }

    get curScene() {
        return this._curScene;
    }

    set curScene(value) {
        this._curScene = value;
    }

    get quitGame() {
        return this._quitGame;
    }

    set quitGame(value) {
        this._quitGame = value;
    }

    static get instance() {
        if (this._instance == null) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }

    restart() {
        this.sceneMap = new Object();
        this.quitGame = false;
    }

    update(dt) {
        if (this.curScene) {
            this.curScene.update(dt);
        }
    }

    lateUpdate() {
        if (this.nextScene) {
            this.realSwitchToScene();
        }
    }

    render(ctx) {
        if (this.curScene) {
            this.curScene.render(ctx);
        }
    }

    addScene(name, func) {
        if (!this.sceneMap) {
            this.sceneMap = new Object();
        }
        this.sceneMap[name] = func;
    }

    switchToScene(name) {
        let func = null;
        let scene = null;
        if (name != null && (func = this.sceneMap[name]) && (scene = func())) {
            this.nextScene = scene;
        }
    }

    // do this after all update
    realSwitchToScene() {
        if (this.curScene != null) {
            this.curScene.onSwitchOut();
            Node.destory(this.curScene);
        }
        this.curScene = this.nextScene;
        this.nextScene = null;
        this.curScene.onSwitchIn();
    }
}