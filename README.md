# tauri frontend audio sample (Typescript + React)

- sound1: use audio tag
    - win ok, mac ok, linux ok
- sound2: use Web audio API (create AudioContext once in initializing -- useEffect function)
    - win ok, mac ok, linux ng
- sound3: use Web audio API (create AudioContext with interactive -- every play button pushed)
    - win ok, mac ok, linux ok

- sound4: use Tauri Native Audio (Rodio)
    - all ng, but don't care with this problem, only refference.

- The library I installed to run tauri application on Linux (ubuntu )
    - sudo apt install libdbus-1-dev librust-glib-sys-dev librust-cairo-sys-rs-dev librust-gdk-sys-dev libsoup2.4-dev libwebkit2gtk-4.0-dev

## Sound material used
    OtoLogic(https://otologic.jp)
