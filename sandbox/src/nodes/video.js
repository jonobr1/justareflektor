(function() {

  var callbacks = [], videos;//, reveal;
  var image = document.createElement('canvas');
  image.width = 16;
  image.height = 16;

  var Video = Sandbox.Nodes.Video = function() {

    var _this = this;

    Sandbox.Node.call(this);

    this.destroy();

    this.outputs.texture = this.buffer = new THREE.Texture(image);
    this.outputs.texture.__parentNode = this;
    this.outputs.texture.minFilter = THREE.LinearFilter;
    this.outputs.texture.magFilter = THREE.LinearFilter;
    this.outputs.texture.format = THREE.RGBFormat;
    this.outputs.texture.generateMipmaps = false;
    this.outputs.texture.needsUpdate = true;

    var update = _.bind(function() {
      var src = this.getParam('source');
      this.outputs.texture.image = this.video = Video.getVideoBySrc(src);
    }, this);

    this.params = {
      source: {
        options: Video.Files,
        onUpdate: _.bind(function() {
          if (!this.sandbox) {
            return;
          }
          var file = Video.getAssetBySrc(this.getParam('source'));
          if (!_.isNull(file)) {
            file.ready(this.sandbox, update);
          }
        }, this)
      }
    };

    this.html = _.template(Sandbox.Graph.Templates.canvas, this)
      + _.template(Sandbox.Graph.Templates.description, this);

    this.destructables.push(this.buffer);

  };

  _.extend(Video, {

    // isReady: false,

    // ready: function(func) {
    //   if (Video.isReady) {
    //     func();
    //   } else {
    //     callbacks.push(func);
    //   }
    // },

    getVideoBySrc: function(src) {

      var files = Video.Files;
      for (var i = 0, l = files.length; i < l; i++) {
        var file = files[i];
        if (file.value === src) {
          return file.video;
        }
      }

      return null;

    },

    getAssetBySrc: function(src) {

      var files = Video.Files;
      for (var i = 0, l = files.length; i < l; i++) {
        var file = files[i];
        if (file.value === src) {
          return file;
        }
      }

    },

    Files: [
      new Sandbox.Asset({
        name: 'Light',
        value: './media/reflektor_1.mp4?fdjskaoi'
      }),
      new Sandbox.Asset({
        name: 'Sea',
        value: './media/reflektor_3.mp4?fdjskaoi'
      }),
      new Sandbox.Asset({
        name: 'Portrait',
        value: './media/reflektor_4.mp4?fdjskaoi'
      }),
      new Sandbox.Asset({
        name: 'Multiplication',
        value: './media/reflektor_5.mp4?fdjskaoi'
      })
    ]

  });

  // reveal = _.after(Video.Files.length, function() {

  //   Video.isReady = true;
  //   _.each(callbacks, function(callback) {
  //     callback();
  //   });

  //   callbacks.length = 0;

  // });

  _.each(Video.Files, function(file) {

    var video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('autoload', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('inline', '');
    video.setAttribute('muted', '');
    video.setAttribute('crossorigin', '');

    video.volume = 0.0;
    video.loop = true;

    video.addEventListener('canplaythrough', function() {
      file.available();
    });

    var source = document.createElement('source');
    source.setAttribute('src', file.value);
    video.appendChild(source);

    video.width = 1;
    video.height = 1;

    // source = document.createElement('source');
    // source.setAttribute('src', file.value.replace('mp4', 'webm'));
    // video.appendChild(source);

    var container = document.querySelector('.scripts');
    if (_.isElement(container)) {
      container.appendChild(video);
    }

    file.video = video;

  });

  _.extend(Video.prototype, Sandbox.Node.prototype, {

    name: 'Video',

    attach: function() {

      Sandbox.Node.prototype.attach.apply(this, arguments);

      // Choose defaults
      if (!this.params.source.value) {
        this.params.source.value = this.params.source.options[0].value;
      }

      this.params.source.onUpdate();

      return this;

    },

    update: function() {

      if (this.video && isPlaying(this.video)) {
        this.outputs.texture.needsUpdate = true;
      }

      return this.trigger('update');

    }

  });

  function isPlaying(clip) {
    return clip.readyState >= clip.HAVE_CURRENT_DATA && !clip.paused;
  }

})();
