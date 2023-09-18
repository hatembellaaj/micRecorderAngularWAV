import { Component } from '@angular/core';

declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'micRecorder';
  recordingDuration =  50;
  //Lets declare Record OBJ
  record;
  //Will use this flag for toggeling recording
  recording = false;
  //URL of Blob
  url;
  error;
  constructor(private domSanitizer: DomSanitizer) {
  }
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  /**
   * Start recording.
   */
  initiateRecording() {

    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
   * Will be called automatically.
   */
  successCallback(stream) {
    var options = {
      mimeType: 'audio/wav',
      fileExtension: 'wav',
      numberOfAudioChannels: 2,
      bufferSize: 16384,
      checkForInactiveTracks: true,
      recorderType: StereoAudioRecorder,
     // desiredSampRate: 44100,
      
    };
/*    if(window.browser == 'safari') {
      options.type = 'audio';
      delete options.desiredSampRate;
      options.sampleRate = 44100;
      options.bufferSize = 4096;
      options.numberOfAudioChannels = 2;
    }*/
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    
   // this.record.setRecordingDuration(this.recordingDuration).onRecordingStopped(this.stopRecording);


    this.record.record();

  }
  /**
   * Stop recording.
   */
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    console.log("blob", blob);
    console.log("url", this.url);
  }
  /**
   * Process Error.
   */
  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }
  ngOnInit() {

  }
}

