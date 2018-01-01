import Vector2 from 'vector'
import Logger from 'logger'

export default class Node {
    _position = new Vector2(0, 0);
    _worldPosition = new Vector2(0, 0);
    isWorldPosDirty = true;

    enable = true;
    visible = true;

    parent = null;
    children = [];

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.position = new Vector2(x, y);
        this.width  = width
        this.height = height
    }

    update(dt) {
        if (!this.enable) {
            return;
        }

        this.children.forEach(function(child) {
            child.update(dt);
        });
    }

    render(ctx) {
        if (!this.visible) {
            return;
        }

        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    onEnable() {}
    
    onDisable() {}

    setEnable(bEnable) {
        if (this.enable != bEnable) {
            this.enable = bEnable;
            if (bEnable) {
                this.onEnable();
            } else {
                this.onDisable();
            }
        }
    }

    set position(value) {
        this._position.x = value.x;
        this._position.y = value.y;

        // set dirty
        this.isWorldPosDirty = true;
        this.children.forEach(function(child) {
            child.isWorldPosDirty = true;
        });
    }

    get position() {
        return new Vector2(this._position.x, this._position.y);
    }

    get worldPosition() {
        if (!this.isWorldPosDirty) {
            return this._worldPosition;
        }

        // let parent = this.parent;
        // this._worldPosition = new Vector2(0, 0);
        // while (parent != null) {
        //     this._worldPosition.add(parent.position);
        //     parent = parent.parent;
        // }

        this._worldPosition = this.position;
        if (this.parent != null) {
            this._worldPosition.add(this.parent.worldPosition);
        }

        this.isWorldPosDirty = false;
        return this._worldPosition;
    }

    addChild(node) {
        node.setParent(this);
        this.children.push(node);
    }

    removeChild(node) {
        this.children.pop(node);
    }

    setParent(parent, changeWorldPos = true) {
        this.parent = parent;

        if (changeWorldPos) {
            this.isWorldPosDirty = true;
        } else {
            this.worldPosition.position = Vector2.sub(this.worldPosition, parent.worldPosition);
        }
    }
}
