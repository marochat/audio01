#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::io::Cursor;
use rodio::{ Decoder, OutputStream, Sink };

#[tauri::command]
fn dbg_print(str: String) {
  println!("{}", str);
}

#[tauri::command]
fn audio_play(data: Vec<u8>) -> Result<(), String> {
  // println!("get cmd!!! {:?}", data);
  // for n in 0..100 {
  //   println!("{}", data[n]);
  // }
  let cur = Cursor::new(data);
  let source = Decoder::new(cur).unwrap();

  let(_, stream_handle) = OutputStream::try_default().unwrap();
  let sink = match Sink::try_new(&stream_handle) {
    Ok(sink) => sink,
    Err(err) => {
      println!("{}", err.to_string());
      return Err("error!".to_owned());
    }
  };
  sink.append(source);

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      audio_play, dbg_print
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
