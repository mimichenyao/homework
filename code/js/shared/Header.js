BH.add('Header', function() {
	
	"use strict";
    eval(BH.System);
    
	// This widget uses html/templates/partials/header.html

    BH.Header = BH.Class(BH.Widget, {

        _init: function(node, cfg) {
            this.parent._init.call(this, node);
	        this._cfg = cfg || {};
	        
	        this._hamburgerMenu = this._node.find('.bh-id-hamburger-menu');
	        
	        this.set('hamburgerButton', new BH.Button(this._node.find('.bh-id-hamburger-button')));
        },
        
        _render: function() {
            this.parent._render.call(this);
            
            this.get('hamburgerButton').render();
        },        

        _behavior: function() {
            var me = this;
            this.parent._behavior.call(this);
            
			this.on(this.get('hamburgerButton').get('clickEvent'), function() {
				me._hamburgerMenu.toggleClass('open');
			});            
        }
        
    });
});
