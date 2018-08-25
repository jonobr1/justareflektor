(function() {

  var DOM = document.createElement('div');

  var Loader = Sandbox.Loader = function(sandbox) {

    this.sandbox = sandbox;
    this.domElement = Loader.GenerateDOM(Loader.Template);
    this.queued = 0;
    this.assets = [];

  };

  _.extend(Loader, {

    Template: '<div class="loader" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; background: #000 url(./media/ajax-loader.gif) center center no-repeat;"></div>',

    GenerateDOM: function(html) {
      DOM.innerHTML = html;
      return DOM.children[0];
    }

  });

  _.extend(Loader.prototype, {

    appendTo: function(elem) {

      elem.appendChild(this.domElement);
      return this;

    },

    add: function(asset) {

      var remove = _.bind(function() {
        this.remove(asset);
        asset.unbind('dequeue', remove);
      }, this);

      asset.bind('dequeue', remove);
      this.show();

      this.queued++;
      this.assets.push(asset);
      return this;

    },

    clear: function() {

      _.each(this.assets, function(asset) {
        asset.trigger('dequeue');
      });

      this.assets.length = 0;

      return this;

    },

    remove: function(asset) {

      this.queued--;
      if (this.queued <= 0) {
        this.hide();
      }

      var index = _.indexOf(this.assets, asset);
      if (index < 0) {
        return this;
      }

      this.assets.splice(index, 1);

      return this;

    },

    show: function() {

      this.domElement.style.display = 'block';
      return this;

    },

    hide: function() {

      this.domElement.style.display = 'none';
      return this;

    }

  });

})();
