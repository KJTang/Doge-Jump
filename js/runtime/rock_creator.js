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
const ROCK_CREATE_INTERVAL  = [2, 1.75, 1.5];
const ROCK_LEVEL_INTERVAL   = [5, 5];
const ROCK_MOVE_SPEED       = [100, 150, 200];

export default class RockCreator extends Node {
    rocks = [];

    constructor() {
        super();

        this.curLevel = 0;
        this.createTimer = 0;
        this.levelTimer = 0;
        this.creating = false;
    }

    update(dt) {
        this.move(dt);
        this.create(dt);
        this.levelUp(dt);
    }

    start() {
        this.curLevel = 0;
        this.createTimer = 0;
        this.levelTimer = 0;
        this.creating = true;
        this.curInterval = ROCK_CREATE_INTERVAL[this.curLevel] * (Math.random() * 0.4 - 0.2); // +- 20%
    }

    move(dt) {
        for (var i = 0; i < this.rocks.length; i++) {
            let rock = this.rocks[i];
            rock.position = new Vector2(rock.position.x - ROCK_MOVE_SPEED[this.curLevel] * dt, rock.position.y);
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
            this.curInterval = ROCK_CREATE_INTERVAL[this.curLevel] * (1 + Math.random() * 0.4 - 0.2); // +- 20%

            // Logger.print("create rock");
            let rock = new Sprite(ROCK_IMG_SRC, ROCK_WIDTH, ROCK_HEIGHT);
            rock.position = new Vector2(GameManager.instance.designWidth + ROCK_WIDTH, GameManager.instance.designHeight * 0.4);
            this.rocks.push(rock);
            this.addChild(rock);
        }
    }

    levelUp(dt) {
        this.levelTimer += dt;
        if (this.levelTimer >= ROCK_LEVEL_INTERVAL[this.curLevel]) {
            this.levelTimer = 0;
            this.curLevel += 1;
        }
    }
}
