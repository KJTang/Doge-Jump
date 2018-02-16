import GameManager      from '../manager/game_manager'
import PhysicsManager   from '../manager/physics_manager'
import EventManager     from '../manager/event_manager'
import Logger       from '../base/logger'
import Node         from '../base/node'
import Sprite       from '../base/sprite'
import Vector2      from '../base/vector'
import Rect         from '../base/rect'

// function rnd(start, end){
//     return Math.floor(Math.random() * (end - start) + start)
// }

const ROCK_IMG_SRC  = 'images/environment/rock.png'
const ROCK_WIDTH    = 40;
const ROCK_HEIGHT   = 40;
const ROCK_CREATE_INTERVAL  = 1.5;
const ROCK_MOVE_SPEED       = 200;

export default class RockCreator extends Node {
    rocks = [];

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
        this.rocks.forEach(function(rock) {
            PhysicsManager.instance.removeCollider("ROCK", rock);
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
        this.curInterval = ROCK_CREATE_INTERVAL * (Math.random() * 0.4 - 0.2); // +- 20%
    }

    move(dt) {
        if (!this.moving) {
            return;
        }

        for (var i = 0; i < this.rocks.length; i++) {
            let rock = this.rocks[i];
            rock.position = new Vector2(rock.position.x - ROCK_MOVE_SPEED * dt, rock.position.y);
            if (rock.position.x < -ROCK_WIDTH) {
                PhysicsManager.instance.removeCollider("ROCK", rock);
                this.rocks.splice(i--, 1);
                Node.destory(rock);
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
            this.curInterval = ROCK_CREATE_INTERVAL * (1 + Math.random() * 0.4 - 0.2); // +- 20%

            // Logger.print("create rock");
            let rock = new Sprite(ROCK_IMG_SRC, ROCK_WIDTH, ROCK_HEIGHT);
            rock.position = new Vector2(GameManager.instance.designWidth + ROCK_WIDTH, GameManager.instance.designHeight * 0.4);
            this.addChild(rock);
            this.rocks.push(rock);
            rock.getBoundingBox = function(argument) {
                let rect = new Rect();
                rect.x = this.canvasRect.x + this.canvasRect.width / 4;
                rect.y = this.canvasRect.y + this.canvasRect.height / 4;
                rect.width = this.canvasRect.width / 2;
                rect.height = this.canvasRect.height / 2;
                return rect; 
            }
            PhysicsManager.instance.addCollider("ROCK", rock);
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
