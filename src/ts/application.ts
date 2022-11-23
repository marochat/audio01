import { invoke } from '@tauri-apps/api/tauri';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { message, ask, open as fileOpen } from '@tauri-apps/api/dialog';
import { basename } from '@tauri-apps/api/path';


export const WebAudioAPI = class {
    private readonly audioContext: AudioContext;
    private audioSource?: AudioBufferSourceNode;
    constructor() {
        this.audioContext = new AudioContext();
    }

    public play = async (snd: string, onEnded?: () => void) => {
        let aryb: ArrayBuffer;
        try {
            const res = await fetch(snd);
            if(res.status !== 200) {
                throw Error;
            }
            aryb = await res.arrayBuffer();
        } catch(error) {
            //console.log(`err : ${error}`);
            const val = await invoke('get_file_obj', { path: snd })
            .catch(e => console.log(e));
            const val1 = new Uint8Array(val as Array<number>);
            aryb = val1.buffer;

        }
        const audiob = await this.audioContext.decodeAudioData(aryb);
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = audiob;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.start();
        if(onEnded){
            this.audioSource.onended = onEnded;
        }
    }

    public stop = () => {
        if(this.audioSource) this.audioSource.stop();
        //this.audioContext.close();
    }

    public close = () => {
        this.audioContext.close();
    }
}