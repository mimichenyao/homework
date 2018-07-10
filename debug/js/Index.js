BH.add('Index', function() {
	
	"use strict";
    eval(BH.System);
    
    // NOTE: The body has a hide class until rendering is complete.

    var Index = (function() {

        return BH.Class(BH.Widget, {

            _init: function(node, cfg) {
	            this._cfg = cfg || {};
                this.parent._init.call(this, node);

                this.set('state', new BH.Attr());
                
                this.set('Intro', new BH.Intro(this._node.find('.bh-id-intro')));
                this.set('GetStarted', new BH.GetStarted(this._node.find('.bh-id-get-started')));
                this.set('Thanks', new BH.Thanks(this._node.find('.bh-id-thanks')));
            },

            _render: function() {
	            this.parent._render.call(this);

	            this.get('Intro').render();
	            this.get('GetStarted').render();
	            this.get('Thanks').render();
            },

            _behavior: function() {
	            this.parent._behavior.call(this);
    			var me = this;

	            this.get('state').sync(this.get('Intro').get('state'));
	            this.get('state').sync(this.get('GetStarted').get('state'));
	            this.get('state').sync(this.get('Thanks').get('state'));

	            this.on(this.get('state'), function(value) {

					me._hideAllPages();

		            if (value === '') {
						BH.Hash.setHash('');
						me.get('Intro').show();
		            } else if (value === 'get-started') {
						BH.Hash.setHash('get-started');
						me.get('GetStarted').show();
		            } else if (value === 'thanks') {
						BH.Hash.setHash('thanks');
						me.get('Thanks').show();
		            }
	            });

				this.on(BH.Hash.get('changeEvent'), function(hash) {
					me.get('state').set(hash);
				});

				// initial state (e.g. reload index.html/#get-started)
				if (BH.Hash.getHash() === 'get-started') {
					this.get('state').set('get-started');
				} else if (BH.Hash.getHash() === 'thanks') {
					this.get('state').set('');
				} else {
					this.get('state').set('');
				}
				
	            this.on(this.get('GetStarted').get('GoToThanksEvent'), function(data) {
					me.get('Thanks').setData(data);
					me.get('state').set('thanks');
	            });
            },

			_hideAllPages: function() {
				this.get('Intro').hide();
				this.get('GetStarted').hide();
				this.get('Thanks').hide();
            }

        });
    }());

    if (!BH.Index) {
		BH.Index = new Index($('bdy'));
		BH.Index.render();
    }
});
