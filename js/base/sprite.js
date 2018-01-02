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

        Sprite.renderImg(ctx, this.img, this);
        
        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    static renderImg(ctx, img, node) {
        ctx.drawImage(
            img,
            node.rect.x,
            window.innerHeight - node.rect.y - node.rect.height,
            node.rect.width,
            node.rect.height
        );
    }

    // /**
    //  * 简单的碰撞检测定义：
    //  * 另一个精灵的中心点处于本精灵所在的矩形内即可
    //  * @param{Sprite} sp: Sptite的实例
    //  */
    // isCollideWith(sp) {
    //     let spX = sp.x + sp.width / 2
    //     let spY = sp.y + sp.height / 2

    //     if ( !this.visible || !sp.visible )
    //         return false

    //     return !!(   spX >= this.x
    //                         && spX <= this.x + this.width
    //                         && spY >= this.y
    //                         && spY <= this.y + this.height  )
    // }
}
