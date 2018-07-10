BH.add('Thanks', function() {
	
	"use strict";
    eval(BH.System);
    
    BH.Thanks = BH.Class(BH.Widget, {

        _init: function(node, cfg) {
            this.parent._init.call(this, node);
	        this._cfg = cfg || {};
	        
            this.set('appointment', new BH.TextNode(this._node.find('.bh-id-appointment')));
            this.set('name', new BH.TextNode(this._node.find('.bh-id-name')));
            this.set('state', new BH.Attr());
        },
        
        _render: function() {
            this.parent._render.call(this);
        },        

        _behavior: function() {
            var me = this;
            this.parent._behavior.call(this);
        },
        
        setData: function(data) {
	        this.get('name').text(data.first_name);
			this.get('appointment').text(data.scheduled_appointment_date);       
        }
        
    });
});
