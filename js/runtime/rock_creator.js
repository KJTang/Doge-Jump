import GameManager  from '../manager/game_manager'
import Logger       from '../base/logger'
import Node         from '../base/node'
import Sprite       from '../base/sprite'
import Vector2      from '../base/vector'

// function rnd(start, end){
//     return Math.floor(Math.random() * (end - start) + start)
// }

const ROCK_IMG_SRC  = 'images/environment/rock.png'
const ROCK_WIDTH    = 40;
const ROCK_HEIGHT   = 40;
const ROCK_CREATE_INTERVAL  = [2, 1.75, 1.5, 1.25, 1.1, 1.0];
const ROCK_MOVE_SPEED       = [150, 200, 250, 300, 350, 400];

export default class RockCreator extends Node {
    rocks = [];

    constructor() {
        super();

        this.createTimer = 0;
        this.creating = false;
    }

    update(dt) {
        this.move(dt);
        this.create(dt);
    }

    start() {
        this.createTimer = 0;
        this.creating = true;
        this.curInterval = ROCK_CREATE_INTERVAL[GameManager.instance.level] * (Math.random() * 0.4 - 0.2); // +- 20%
    }

    move(dt) {
        for (var i = 0; i < this.rocks.length; i++) {
            let rock = this.rocks[i];
            rock.position = new Vector2(rock.position.x - ROCK_MOVE_SPEED[GameManager.instance.level] * dt, rock.position.y);
            if (rock.position.x < -ROCK_WIDTH) {
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
            this.curInterval = ROCK_CREATE_INTERVAL[GameManager.instance.level] * (1 + Math.random() * 0.4 - 0.2); // +- 20%

            // Logger.print("create rock");
            let rock = new Sprite(ROCK_IMG_SRC, ROCK_WIDTH, ROCK_HEIGHT);
            rock.position = new Vector2(GameManager.instance.designWidth + ROCK_WIDTH, GameManager.instance.designHeight * 0.4);
            this.rocks.push(rock);
            this.addChild(rock);
        }
    }
}
