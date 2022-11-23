import { invoke } from '@tauri-apps/api';
import React, { useEffect } from 'react';

import chimeSound from '../audio/Chime-Announce02-1.mp3';

const print = (str: string) => {
    invoke('dbg_print', {str: str});
}

const Copyright = () => {
    console.log('Sound material used');
    return (
        <div>
            <hr />
            <blockquote style={{color: 'gray', fontSize: 'small'}}>
            Sound material used from 'OtoLogic(https://otologic.jp)'': 
            </blockquote>
        </div>
    );
}

export const App = () => {
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const [ btnLbl1, setBtnLbl1 ] = React.useState<string>('play');
    const [ btnLbl2, setBtnLbl2 ] = React.useState<string>('play');
    const [ btnLbl3, setBtnLbl3 ] = React.useState<string>('play');
    const [ btnLbl4, setBtnLbl4 ] = React.useState<string>('play');

    const audioPlay1 = () => {
        if(audioRef.current !== null) {
            if(btnLbl1 == 'play') {
                audioRef.current.play();
                setBtnLbl1('stop');
                audioRef.current.onended = () => {
                    setBtnLbl1('play');
                }       
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setBtnLbl1('play');
            }
        }
    };

    const audioSource = React.useRef<AudioBufferSourceNode | null>(null)
    const audioContext = React.useRef<AudioContext | null>(null)
    React.useEffect(() => {
        window.AudioContext = window.AudioContext;
        audioContext.current = new AudioContext();
        return () => {
            audioSource.current?.stop();
            audioContext.current?.close();
        }
    }, []);

    const audioPlay2 = () => {
        if(btnLbl2 == 'play') {
            // AudioContext is created at once in initial (useEffect function)
            audioSource.current = audioContext.current!.createBufferSource();
            fetch(chimeSound).then(res => res.arrayBuffer())
            .then(arryb => audioContext.current?.decodeAudioData(arryb))
            .then(abuf => {
                if(abuf !== undefined && audioSource.current !== null){
                    audioSource.current.buffer = abuf;
                    audioSource.current.connect(audioContext.current!.destination);
                    audioSource.current.onended = () => {
                        //setPlaylbl2('play');
                        setBtnLbl2('play');
                    }
                    audioSource.current.start(0);
                    setBtnLbl2('stop');
                }
            });    
        } else {
            if(audioContext.current !== null && audioSource.current != null) {
                audioSource.current.stop();
                // audioContext.current.close();
                setBtnLbl2('play');
            }
        }
    }

    const audioPlay3 = () => {
        if(btnLbl3 == 'play') {
            // create AudioContext with interactive.
            const ctx = new AudioContext();
            audioSource.current = ctx.createBufferSource();
            fetch(chimeSound).then(res => res.arrayBuffer())
            .then(arryb => audioContext.current?.decodeAudioData(arryb))
            .then(abuf => {
                if(abuf !== undefined && audioSource.current !== null){
                    audioSource.current.buffer = abuf;
                    audioSource.current.connect(ctx.destination);
                    audioSource.current.onended = () => {
                        //setPlaylbl2('play');
                        setBtnLbl3('play');
                    }
                    audioSource.current.start(0);
                    setBtnLbl3('stop');
                }
            });    
        } else {
            if(audioContext.current !== null && audioSource.current != null) {
                audioSource.current.stop();
                setBtnLbl3('play');
            }
        }
    }

    const audioPlay4 = () => {
        fetch(chimeSound).then(res => res.arrayBuffer())
        .then(arryb => {
            console.log('play3 invoke!')
            const buf = new Uint8Array(arryb);
            // console.log(Array.from(buf))
            invoke('audio_play', {data: Array.from(buf)});
        })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.id)
    }

    return (
        <div>
            <h1>Audio Test</h1>
            <form>
                <audio ref={audioRef}>
                    <source type='audio/mp3' src={chimeSound} />
                </audio>
                <label htmlFor='btn1'>Sound1</label>
                <input type='button' id='btn1' value={btnLbl1} onClick={audioPlay1} onChange={handleOnChange}/>
                <label> -- Use Audio tag</label>
            </form>
            <form>
                <label htmlFor='btn2'>Sound2</label>
                <input type='button' id='btn2' value={btnLbl2} onClick={audioPlay2} onChange={handleOnChange}/>
                <label> -- Use WebAudioAPI (create AudioContext once in initial -- useEffect)</label>
            </form>
            <form>
                <label htmlFor='btn3'>Sound3</label>
                <input type='button' id='btn3' value={btnLbl3} onClick={audioPlay3} onChange={handleOnChange}/>
                <label> -- Use WebAudioAPI (create AudioContext with interactive - every play button pushed)</label>
            </form>
            <form>
                <label htmlFor='btn4'>Sound4</label>
                <input type='button' id='btn4' value={btnLbl4} onClick={audioPlay4} onChange={handleOnChange}/>
                <label> -- Use Tauri Native Audio (rodio) -- not work...</label>
            </form>
            <Copyright />
        </div>
    );
}
