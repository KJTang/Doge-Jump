import Vector2 from 'vector'
import Node from 'node'
import Logger from 'logger'

export default class Scene extends Node {
    constructor() {
        super(window.innerWidth, window.innerHeight, 0, 0);
        this.pivot = new Vector2(0, 0);
    }

    onSwitchIn() {}
    
    onSwitchOut() {}
}
