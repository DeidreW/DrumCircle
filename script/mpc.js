var MPC = function() {
  var self = this;
  this.idPrefix = 'btn-'; // HTML ID prefix
  this.statusWidth = 6;
  this.progressWidth = 256;
  this.keys = {'1':0,'2':1}

  // scope within these event handler methods: "this" = SMSound() object instance (see SMSound() in soundmanager.js for reference) 

  this.showProgress = function() {
    // sound is loading, update bytes received using this.bytesLoaded / this.bytesTotal
    if (self._getButton(this.id).className != 'loading') self._getButton(this.id).className = 'loading'; // a bit inefficient here..
    self._showStatus(this.id,this.bytesLoaded,this.bytesTotal);
  }

  this.onid3 = function() {
    soundManager._writeDebug('mpc.onid3()');
    var oName = null;
    for (var oName in this.id3) {
      soundManager._writeDebug(oName+': '+this.id3[oName]) // write out name/value ID3 pairs (eg. "artist: Beck")
    }
  }

  this.onload = function() {
    var sID = this.id;
    self._getButton(this.id).className = '';
    self._getButton(this.id).title = ('Sound ID: '+this.id+' ('+this.url+')');
  }

  this.onfinish = function() {
    self._getButton(this.id).className = '';
    self._reset(this.id);
  }

  this.onplay = function() {
    self._getButton(this.id).className = 'active';
  }

  this.whileplaying = function() {
    self._showStatus(this.id,this.position,this.duration);
  }

  this._keyHandler = function(e) {
    var oEvt = e?e:event;
    var sChar = String.fromCharCode(oEvt.keyCode).toLowerCase();
    if (typeof self.keys[sChar] != 'undefined') soundManager.play('s'+self.keys[sChar]);
  }

  this._showStatus = function(sID,n1,n2) {
    var o = self._getButton(sID).getElementsByTagName('div')[0];
    var offX = (n2>0?(-self.progressWidth+parseInt((n1/n2)*o.offsetWidth)):-self.progressWidth);
    o.style.backgroundPosition = offX+'px 0px';
  }

  this._getButton = function(sID) {
    return document.getElementById(self.idPrefix+sID);
  }

  this._reset = function(sID) {
    var id = sID;
    self._showStatus(sID,1,1);
    setTimeout(function(){self._showStatus(sID,0,0);},200);
  }

  this.init = function() {
    document.onkeydown = self._keyHandler;
  }

}

var mpc = new MPC();

soundManager.flashVersion = (window.location.toString().match(/#flash8/i)?8:9);
if (soundManager.flashVersion != 8) {
  soundManager.useHighPerformance = true;
}

soundManager.setup({
  url: 'swf/', // path to load SWF from (overriding default)
  bgColor: '#333333',
  wmode: 'transparent',
  debugMode: false,
  consoleOnly: false,
  useFlashBlock: true
});

soundManager.onready(function() {

  // This is the "onload" equivalent which is called when SoundManager has been initialised (sounds can be created, etc.)

  mpc.init();

  // set up some default options / event handlers - so all sounds created are given these handlers

  soundManager.setup({
    defaultOptions: {
      autoLoad: true,
      whileloading: mpc.showProgress,
      onid3: mpc.onid3,
      onload: mpc.onload,
      onplay: mpc.onplay,
      whileplaying: mpc.whileplaying,
      onfinish: mpc.onfinish
    }
  });

  if (!soundManager.html5.needsFlash) {
    document.getElementById('isHTML5').style.display = 'inline';
  }
  var soundURLs = 'Djembe,Conga'.split(',');
  for (var i=0; i<soundURLs.length; i++) {
    soundManager.createSound('s'+i, 'audio/'+soundURLs[i]+'.mp3');
  }

});

