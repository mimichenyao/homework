BH.add('Index', function() {
	
	"use strict";
    eval(BH.System);
    
    // NOTE: The body has a hide class until rendering is complete.

    var Index = (function() {

        return BH.Class(BH.Widget, {

            _init: function(node, cfg) {
	            this._cfg = cfg || {};
                this.parent._init.call(this, node);
                
                this.set('Header', new BH.Header(this._node.find('header')));
            },

            _render: function() {
	            this.parent._render.call(this);
	            
	            this.get('Header').render();
            }

        });
    }());

    if (!BH.Index) {
		BH.Index = new Index($('body'));
		BH.Index.render();
    }
});
