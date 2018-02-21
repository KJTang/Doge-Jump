import GameManager      from './manager/game_manager'
import SceneManager     from './manager/scene_manager'
import ActionManager    from './manager/action_manager'
import EventManager     from './manager/event_manager'
import MusicManager     from './manager/music_manager'
import InputManager     from './manager/input_manager'
import PhysicsManager   from './manager/physics_manager'

import Logger       from './base/logger'
import Node         from './base/node'
import Sprite       from './base/sprite'
import Vector2      from './base/vector'

import MainScene    from './runtime/mainscene'
import PlayScene    from './runtime/playscene'

let ctx = canvas.getContext('2d')

export default class Main {
    managers = [];

    constructor() {
        this.restart()
    }

    restart() {
        this.managers = [];
        this.managers.push(GameManager.instance);
        this.managers.push(SceneManager.instance);
        this.managers.push(ActionManager.instance);
        this.managers.push(EventManager.instance);
        this.managers.push(MusicManager.instance);
        this.managers.push(InputManager.instance);
        this.managers.push(PhysicsManager.instance);

        this.managers.forEach(function(mgr) {
            mgr.restart();
        });

        // game entry
        SceneManager.instance.addScene("MainScene", function() {
            return new MainScene();
        });
        SceneManager.instance.addScene("PlayScene", function() {
            return new PlayScene();
        });
        SceneManager.instance.switchToScene("MainScene");
        // SceneManager.instance.switchToScene("PlayScene");

        // game loop
        window.requestAnimationFrame(this.loop.bind(this), canvas);
    }

    update(dt) {
        // update-order cannot be changed optionally
        GameManager.instance.update(dt);
        PhysicsManager.instance.update(dt);
        InputManager.instance.update(dt);
        SceneManager.instance.update(dt);
        ActionManager.instance.update(dt);
    }

    lateUpdate() {
        SceneManager.instance.lateUpdate();
    }

    render() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, GameManager.instance.screenWidth, GameManager.instance.screenHeight);
        // ctx.clearRect(0, 0, GameManager.instance.screenWidth, GameManager.instance.screenHeight);

        SceneManager.instance.render(ctx);
    }

    // game loop
    loop() {
        if (!this.lastTime) {
            this.lastTime = new Date().getTime();
        }
        this.curTime = new Date().getTime();

        this.update((this.curTime - this.lastTime) / 1000);
        this.lateUpdate();
        this.render();

        this.lastTime = this.curTime;

        if (SceneManager.instance.quitGame) {
            this.restart();
            return;
        }
        window.requestAnimationFrame(this.loop.bind(this), canvas);
    }
}
