import Manager      from './manager'
import EventManager from './event_manager'
import GameManager  from './game_manager'

import Logger       from '../base/logger'
import Node         from '../base/node'
import Vector2      from '../base/vector'
import Rect         from '../base/rect'

export default class PhysicsManager extends Manager {
    constructor() {
        super();
    }

    static get instance() {
        if (this._instance == null) {
            this._instance = new PhysicsManager();
        }
        return this._instance;
    }

    restart() {
        this.colliders = new Map();
        this.rules = new Map();
        this.collisions = new Map();
    }

    update(dt) {
        super.update(dt);

        for (var [key, value] of this.rules) {
            let colliderListA = this.colliders.get(key.toString());
            let colliderListB = this.colliders.get(value.toString());
            if (!colliderListA || !colliderListB) {
                continue;
            }
            for (var colliderA of colliderListA) {
                for (var colliderB of colliderListB) {
                    if (Rect.isOverlapRect(colliderA.getBoundingBox(), colliderB.getBoundingBox())) {
                        this.handleCollisionBegin(colliderA, colliderB);
                    } else {
                        this.handleCollisionEnd(colliderA, colliderB);
                    }
                }
            }
        }
    }

    addRule(typeA, typeB) {
        // Logger.print("addRule: " + typeA + " " + typeB);
        if (!this.rules.has(typeA)) {
            this.rules.set(typeA, []);
        }
        this.rules.get(typeA).push(typeB);
    }

    removeRule(typeA, typeB) {
        if (!this.rules.has(typeA)) {
            return;
        }
        let ruleList = this.rules.get(typeA);
        for (let i = 0; i != ruleList.length; ++i) {
            if (ruleList[i] == typeB) {
                ruleList.splice(i, 1);
                break;
            }
        }
    }

    addCollider(type, collider) {
        if (!this.colliders.has(type)) {
            this.colliders.set(type, []);
        }
        this.colliders.get(type).push(collider);
        // Logger.print("addCollider: " + type + ", " + collider + ", " + this.colliders.get(type).length);
    }

    removeCollider(type, collider) {
        if (!this.colliders.has(type)) {
            return;
        }
        let colliderList = this.colliders.get(type);
        for (let i = 0; i != colliderList.length; ++i) {
            if (colliderList[i] == collider) {
                colliderList.splice(i, 1);
                break;
            }
        }
    }

    handleCollisionBegin(colliderA, colliderB) {
        if (this.collisions.has(colliderA) && this.collisions.get(colliderA).has(colliderB)) {
            colliderA.onCollision(colliderB);
            colliderB.onCollision(colliderA);
        } else {
            this.collisions.set(colliderA, new Set());
            this.collisions.get(colliderA).add(colliderB);

            colliderA.onCollisionBegin(colliderB);
            colliderB.onCollisionBegin(colliderA);
        }
    }

    handleCollisionEnd(colliderA, colliderB) {
        if (this.collisions.has(colliderA) && this.collisions.get(colliderA).has(colliderB)) {
            let collision = this.collisions.get(colliderA);
            collision.delete(colliderB);
            if (collision.length == 0) {
                this.collisions.delete(colliderA);
            }

            colliderA.onCollisionEnd(colliderB);
            colliderB.onCollisionEnd(colliderA);
        }
    }
}