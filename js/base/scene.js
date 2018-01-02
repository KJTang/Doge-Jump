import Vector2 from 'vector'
import Node from 'node'
import Logger from 'logger'

export default class Scene extends Node {
    constructor() {
        super(window.innerWidth, window.innerHeight);
    }

    onSwitchIn() {}
    
    onSwitchOut() {}
}
