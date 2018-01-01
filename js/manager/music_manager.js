import Manager from './manager'

import Logger from '../base/logger'

export default class MusicManager extends Manager {
    musics = new Object();

    static get instance() {
        if (this._instance == null) {
            this._instance = new MusicManager();
        }
        return this._instance;
    }

    restart() {
        this.musics = new Object();
    }

    loadMusic(name, path, loop = false) {
        let audio = new Audio();
        audio.loop = loop;
        audio.src  = path;

        this.musics[name] = audio;
    }

    unloadMusic(name) {
        this.musics[name] = null;
    }

    playMusic(name, replay = true) {
        let audio = this.musics[name];
        if (audio) {
            if (replay) {
                audio.currentTime = 0
            }
            audio.play();
        }
    }

    pauseMusic(name) {
        let audio = this.musics[name];
        if (audio) {
            audio.pause();
        }
    }
}