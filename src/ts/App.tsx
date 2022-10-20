import React, { useEffect } from 'react';

import chimeSound from '../audio/start-chaim.mp3';

export const App = () => {
    const btn1Ref = React.useRef<HTMLInputElement>(null);
    const btn2Ref = React.useRef<HTMLInputElement>(null);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const audioPlay1 = React.useCallback(() => {
        if(audioRef.current !== null) {
            if(btn1Ref.current?.value == 'play') {
                audioRef.current.play();
                btn1Ref.current.value = 'stop';
                audioRef.current.onended = () => {
                    btn1Ref.current!.value = 'play';
                }       
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                btn1Ref.current!.value = 'play';
            }
        }
    }, []);

    const audioSource = React.useRef<AudioBufferSourceNode | null>(null)
    const audioContext = React.useRef<AudioContext | null>(null)
    React.useEffect(() => {
        return () => {
            audioSource.current?.stop();
            audioContext.current?.close();
        }
    }, []);

    const audioPlay2 = () => {
        if(btn2Ref.current?.value == 'play') {
            window.AudioContext = window.AudioContext;
            audioContext.current = new AudioContext();
            audioSource.current = audioContext.current.createBufferSource();
            fetch(chimeSound).then(res => res.arrayBuffer())
            .then(arryb => audioContext.current?.decodeAudioData(arryb))
            .then(abuf => {
                if(abuf !== undefined && audioSource.current !== null){
                    audioSource.current.buffer = abuf;
                    audioSource.current.connect(audioContext.current!.destination);
                    audioSource.current.onended = () => {
                        //setPlaylbl2('play');
                        btn2Ref.current!.value = 'play';
                    }
                    audioSource.current.start(0);
                    //setPlaylbl2('stop');
                    btn2Ref.current!.value = 'stop';
                }
            });    
        } else {
            if(audioContext.current !== null && audioSource.current != null) {
                audioSource.current.stop();
                audioContext.current.close();
                //setPlaylbl2('play');
                btn2Ref.current!.value = 'play';
            }
        }
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
                <label htmlFor='btn1'>Sound1 (use Audio tag)</label>
                <input ref={btn1Ref} type='button' id='btn1' value='play' onClick={audioPlay1} onChange={handleOnChange}/>
            </form>
            <form>
                <label htmlFor='btn2'>Sound2 (use Web Audio API)</label>
                <input ref={btn2Ref} type='button' id='btn2' value='play' onClick={audioPlay2} onChange={handleOnChange}/>
            </form>
        </div>
    );
}
