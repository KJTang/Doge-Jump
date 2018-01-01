import Manager from './manager'
import Logger from '../base/logger'

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

    switchToScene(scene) {
        if (scene != null) {
            this.nextScene = scene;
        }
    }

    // do this after all update
    realSwitchToScene() {
        if (this.curScene != null) {
            this.curScene.onSwitchOut();
        }
        this.curScene = this.nextScene;
        this.nextScene = null;
        this.curScene.onSwitchIn();
    }
}