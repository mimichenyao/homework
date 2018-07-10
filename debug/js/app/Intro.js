BH.add('Intro', function() {
	
	"use strict";
    eval(BH.System);
    
    BH.Intro = BH.Class(BH.Widget, {

        _init: function(node, cfg) {
            this.parent._init.call(this, node);
	        this._cfg = cfg || {};

            this.set('getStartedBtn', new BH.Button(this._node.find('.bh-id-get-started-btn')));
            this.set('state', new BH.Attr());
        },
        
        _render: function() {
            this.parent._render.call(this);
        },        

        _behavior: function() {
            var me = this;
            this.parent._behavior.call(this);

            this.on(this.get('getStartedBtn').get('clickEvent'), function() {
				me.get('state').set('get-started');
            });
        }
        
    });
});
