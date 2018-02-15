import Sprite  from './sprite'
import Logger  from './logger'

export default class Animation extends Sprite {
    constructor(imgSrc, width = 0, height = 0, interval = 0.1, loop = true) {
        super(imgSrc, width, height)

        this.isPlaying = false;
        this.interval = interval;
        this.loop = loop;

        this.frameIdx = -1;     // cur frame
        this.frameCnt = 0;
        this.imgList = [];

        this.timetick = 0;
    }

    initFrames(imgList) {
        imgList.forEach((imgSrc) => {
            let img = new Image();
            img.src = imgSrc;
            this.imgList.push(img);
        });
        this.frameCnt = imgList.length;

        // this.imgList.forEach(function(img) {
        //     Logger.print(img.src);
        // });
    }

    update(dt) {
        super.update(dt);
        if (!this.isPlaying) {
            return;
        }

        this.timetick += dt;
        if (this.timetick >= this.interval){
            this.timetick = 0;
            this.frameIdx += 1;

            if (this.frameIdx == this.frameCnt) {
                if (this.loop) {
                    this.frameIdx = 0;
                } else {
                    this.stop();
                }
            }
        }
    }

    render(ctx) {
        if (this.imgList[this.frameIdx] != null) {
            // Logger.print(this.imgList[this.frameIdx]);
            Sprite.renderImg(ctx, this, this.imgList[this.frameIdx]);
        }

        this.children.forEach(function(child) {
            child.render(ctx);
        });
    }

    play(index = 0) {
        this.isPlaying = true;
        this.frameIdx = index;
        this.timetick = 0;
    }

    stop() {
        this.isPlaying = false;
        this.frameIdx = -1;
    }

    pause() {
        this.isPlaying = false;
    }

    resume() {
        this.isPlaying = true;
    }
}
