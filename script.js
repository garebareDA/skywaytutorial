'use strict';

let localsteam = null;
let peer = null;
let existngcall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((steam) => {
  $('#my-video').get(0).srcObject = steam;
}).catch((err) => {
  console.error(err);
  return;
});

peer = new Peer({
  key: '841ce991-89d8-4257-b656-500ea6b055d5',
  debug: 3
});

peer.on('open', () => {
  $('#my-id').text(peer.id);
});

peer.on('close',(err) => {
  alert(err.message);
});

$('make-call').submit((e) => {
  e.preventDefault();
  const call = peer.call($('#callto-id').val(), localsteam);
  setupCallEventHandlers(call);
});

$('#end-call').click(() => {
  existngcall.close();
});

peer.on('call', (call) => {
  call.answer(localsteam);
  setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
  if (existngcall) {
    existngcall.close();
  };

  existngcall = call;

  call.on('stream', (stream) => {
    addVideo(call, stream);
    setupEndCallUI();
    $('#their-id').text(call.remoteId);
  });

  call.on('close', () => {
    removeVideo(call.remoteId);
    setupMakeCallUI();
  });
}

function addVideo(call,stream){
  $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId){
  $('#their-video').get(0).srcObject = undefined;
}

function setupMakeCallUI(){
  $('#make-call').show();
  $('#end-call').hide();
}

function setupEndCallUI() {
  $('#make-call').hide();
  $('#end-call').show();
}