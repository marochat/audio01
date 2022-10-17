import React from 'react';

import chimeSound from '../audio/start-chaim.mp3';

export const App = () => {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const audioPlay1 = () => {
        audioRef.current!.play();
    }

    const audioSource = React.useRef<AudioBufferSourceNode | null>(null)
    React.useEffect(() => {
        return () => {
            audioSource.current?.stop();
        }
    }, []);

    const audioPlay2 = () => {
        window.AudioContext = window.AudioContext;
        const ctx = new AudioContext();
        audioSource.current = ctx.createBufferSource();
        fetch(chimeSound).then(res => res.arrayBuffer())
        .then(arryb => ctx.decodeAudioData(arryb))
        .then(abuf => {
            audioSource.current!.buffer = abuf;
            audioSource.current!.connect(ctx.destination);
            audioSource.current!.start(0);
        });
    }
    return (
        <div>
            <h1>Audio Test</h1>
            <form>
                <audio ref={audioRef}>
                    <source type='audio/mp3' src={chimeSound} />
                </audio>
                <label htmlFor='btn1'>Sound1 (use Audio tag)</label>
                <input type='button' id='btn1' value='play' onClick={audioPlay1} />
            </form>
            <form>
                <label htmlFor='btn2'>Sound2 (use Web Audio API)</label>
                <input type='button' id='btn2' value='play' onClick={audioPlay2} />
            </form>
        </div>
    );
}
