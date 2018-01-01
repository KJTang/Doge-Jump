export default class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    toString() {
        return "Rect: x = " + this.x + ", y = " + this.y + ", width = " + this.width + ", height = " + this.height;
    }

    static isOverlapPoint(rect, point) {
        if (point.x > rect.x && (point.x < rect.x + rect.width) && 
            point.y > rect.y && (point.y < rect.y + rect.height)) {
            return true;
        } 
        return false;
    }

    static isOverlapRect(recta, rectb) {
        // TODO: 
        return false;
    }
}