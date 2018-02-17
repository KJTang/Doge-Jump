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

        for (var [key, valueList] of this.rules) {
            for (var value of valueList) {
                let colliderTagA = key.toString();
                let colliderTagB = value.toString();
                // Logger.print("=====", colliderTagA, colliderTagB, GameManager.instance.frameCnt);

                let colliderListA = this.colliders.get(colliderTagA);
                let colliderListB = this.colliders.get(colliderTagB);
                if (!colliderListA || !colliderListB) {
                    continue;
                }
                // Logger.print("========", colliderTagA, colliderTagB);
                for (var colliderA of colliderListA) {
                    for (var colliderB of colliderListB) {
                        if (Rect.isOverlapRect(colliderA.getBoundingBox(), colliderB.getBoundingBox())) {
                            this.handleCollisionBegin(colliderA, colliderB, colliderTagA, colliderTagB);
                        } else {
                            this.handleCollisionEnd(colliderA, colliderB, colliderTagA, colliderTagB);
                        }
                    }
                }
            }
        }
    }

    addRule(typeA, typeB) {
        // Logger.print("addRule: " + typeA + " " + typeB);
        if (!this.rules.has(typeA)) {
            this.rules.set(typeA, new Set());
        }
        // already have
        let ruleList = this.rules.get(typeA);
        if (ruleList.has(typeB)) {
            return;
        }
        ruleList.add(typeB);
    }

    removeRule(typeA, typeB) {
        if (!this.rules.has(typeA)) {
            return;
        }
        let ruleList = this.rules.get(typeA);
        ruleList.delete(typeB);
    }

    addCollider(type, collider) {
        if (!this.colliders.has(type)) {
            this.colliders.set(type, new Set());
        }
        // already have
        let colliderList = this.colliders.get(type);
        if (colliderList.has(collider)) {
            return;
        }
        colliderList.add(collider);
    }

    removeCollider(type, collider) {
        // Logger.print("removeCollider");
        if (!this.colliders.has(type)) {
            return;
        }
        let colliderList = this.colliders.get(type);
        // Logger.print("1", colliderList);/
        colliderList.delete(collider);
        // Logger.print("2", colliderList);
    }

    handleCollisionBegin(colliderA, colliderB, colliderTagA, colliderTagB) {
        if (this.collisions.has(colliderA) && this.collisions.get(colliderA).has(colliderB)) {
            colliderA.onCollision(colliderB, colliderTagB);
            colliderB.onCollision(colliderA, colliderTagA);
        } else {
            this.collisions.set(colliderA, new Set());
            this.collisions.get(colliderA).add(colliderB);

            colliderA.onCollisionBegin(colliderB, colliderTagB);
            colliderB.onCollisionBegin(colliderA, colliderTagA);
        }
    }

    handleCollisionEnd(colliderA, colliderB, colliderTagA, colliderTagB) {
        if (this.collisions.has(colliderA) && this.collisions.get(colliderA).has(colliderB)) {
            let collision = this.collisions.get(colliderA);
            collision.delete(colliderB);
            if (collision.length == 0) {
                this.collisions.delete(colliderA);
            }

            colliderA.onCollisionEnd(colliderB, colliderTagB);
            colliderB.onCollisionEnd(colliderA, colliderTagA);
        }
    }
}