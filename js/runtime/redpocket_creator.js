import GameManager      from '../manager/game_manager'
import PhysicsManager   from '../manager/physics_manager'
import EventManager     from '../manager/event_manager'
import Logger       from '../base/logger'
import Node         from '../base/node'
import Sprite       from '../base/sprite'
import Vector2      from '../base/vector'
import Rect         from '../base/rect'

const REDPOCKET_IMG_SRC  = 'images/environment/redpocket.png'
const REDPOCKET_WIDTH    = 40;
const REDPOCKET_HEIGHT   = 40;
const REDPOCKET_CREATE_INTERVAL  = 2.0;
const REDPOCKET_MOVE_SPEED       = 200;

export default class RedPocketCreator extends Node {
    pockets = [];

    constructor() {
        super();

        this.createTimer = 0;
        this.creating = false;
        this.moving = false;
    }

    onEnable() {
        this.deadListener = this.onPlayerDied.bind(this);
        EventManager.instance.addEventListener("YouDied", this.deadListener);
    }

    onDisable() {
        // remove collision listener
        this.pockets.forEach(function(pocket) {
            PhysicsManager.instance.removeCollider("REDPOCKET", pocket);
        });

        EventManager.instance.removeEventListener("YouDied", this.deadListener);
    }

    update(dt) {
        this.move(dt);
        this.create(dt);
    }

    start() {
        this.createTimer = 0;
        this.creating = true;
        this.moving = true;
        this.curInterval = REDPOCKET_CREATE_INTERVAL * (Math.random() * 0.4 - 0.2); // +- 20%
    }

    move(dt) {
        if (!this.moving) {
            return;
        }

        for (var i = 0; i < this.pockets.length; i++) {
            let pocket = this.pockets[i];
            pocket.position = new Vector2(pocket.position.x - REDPOCKET_MOVE_SPEED * dt, pocket.position.y);
            if (pocket.position.x < -REDPOCKET_WIDTH) {
                PhysicsManager.instance.removeCollider("REDPOCKET", pocket);
                this.pockets.splice(i--, 1);
                Node.destory(pocket);
            }
        }
    }

    create(dt) {
        if (!this.creating) {
            return;
        }

        this.createTimer += dt;
        if (this.createTimer >= this.curInterval) {
            this.createTimer = 0;
            this.curInterval = REDPOCKET_CREATE_INTERVAL * (1 + Math.random() * 0.4 - 0.2); // +- 20%

            // Logger.print("create pocket");
            let pocket = new Sprite(REDPOCKET_IMG_SRC, REDPOCKET_WIDTH, REDPOCKET_HEIGHT);
            pocket.position = new Vector2(GameManager.instance.designWidth + REDPOCKET_WIDTH, GameManager.instance.designHeight * 0.5);
            this.addChild(pocket);
            this.pockets.push(pocket);
            pocket.getBoundingBox = function(argument) {
                let rect = new Rect();
                rect.x = this.canvasRect.x + this.canvasRect.width / 4;
                rect.y = this.canvasRect.y + this.canvasRect.height / 4;
                rect.width = this.canvasRect.width / 2;
                rect.height = this.canvasRect.height / 2;
                return rect; 
            }
            PhysicsManager.instance.addCollider("REDPOCKET", pocket);
        }
    }

    pause() {
        this.moving = false;
        this.creating = false;
    }

    resume() {
        this.moving = true;
        this.creating = true;
    }

    onPlayerDied() {
        this.pause();
    }
}
