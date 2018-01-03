import Node     from 'node'
import Logger   from 'logger'

export default class Sprite extends Node {
    constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
        super(width, height, x, y);

        this.img = new Image();
        this.img.src = imgSrc;

        this.visible = true;
    }

    render(ctx) {
        if (!this.visible) {
            return;
        }

        Sprite.renderImg(ctx, this, this.img);
        
        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    static renderImg(ctx, node, img) {
        let canvasPos = node.canvasPosition;
        ctx.drawImage(
            img,
            canvasPos.x,
            canvasPos.y,
            node.rect.width,
            node.rect.height
        );
    }
}
