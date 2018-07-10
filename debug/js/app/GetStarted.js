BH.add('GetStarted', function() {
	
	"use strict";
    eval(BH.System);
    
    BH.GetStarted = BH.Class(BH.BaseCompositeInput, {

        _init: function(node, cfg) {
            this.parent._init.call(this, node);
	        this._cfg = cfg || {};

			this.set('email', new BH.EmailInput(this._node.find('.bh-id-email-container')));
            this.set('error', new BH.TextNode(this._node.find('.bh-id-error')));
            this.set('GoToThanksEvent', new BH.Event());
	        this.set('nextBtn', new BH.Button(this._node.find('.bh-id-next-btn')));
            this.set('state', new BH.Attr());

            this._addInput({
                cls: BH.TextInput,
                name: 'firstName',
                node: this._node.find('.bh-id-first-name'),
                inputCfg: {
                    maxlength: 40
                },
                validationRules: [
                    BH.ValidationRules.Required
                ]
            });            
            
            this._addInput({
                cls: BH.TextInput,
                name: 'lastName',
                node: this._node.find('.bh-id-last-name'),
                inputCfg: {
                    maxlength: 40
                },
                validationRules: [
                    BH.ValidationRules.Required
                ]
            });            
            
            this._addInput({
                cls: BH.TextInput,
                name: 'phone',
                node: this._node.find('.bh-id-phone'),
                inputCfg: {
                    maxlength: 20
                },
                validationRules: [
	                BH.ValidationRules.Phone,
                    BH.ValidationRules.Required
                ]
            });
        },
        
        _render: function() {
            this.parent._render.call(this);

            this.get('firstName').render();
			this.get('lastName').render();
			this.get('phone').render();
			this.get('email').render();

			this.get('nextBtn').render();
			
			this._setup();
        },        

        _behavior: function() {
            var me = this;
            this.parent._behavior.call(this);
            
			this.on(this.get('firstName').get('changeEvent'), function() {
				me._isGoodToGo();
			});

			this.on(this.get('firstName').get('keyupEvent'), function() {
				me._isGoodToGo();
			});

			this.on(this.get('lastName').get('changeEvent'), function() {
				me._isGoodToGo();
			});

			this.on(this.get('lastName').get('keyupEvent'), function() {
				me._isGoodToGo();
			});

			this.on(this.get('phone').get('changeEvent'), function() {
				me._isGoodToGo();
			});
			
			this.on(this.get('phone').get('keyupEvent'), function() {
				me._isGoodToGo();
			});

			this.on(this.get('email').get('changeEvent'), function() {
                me.get('email').setData(me.get('email').getData().trim());
				me._isGoodToGo();
			});
			
			this.on(this.get('email').get('keyupEvent'), function() {
                me.get('email').trim();
                me._isGoodToGo();
			});

            this.on(this.get('nextBtn').get('clickEvent'), function() {
				
				BH.StylingService.save_user_info({
					'first_name': me.get('firstName').getData(),
					'last_name': me.get('lastName').getData(),
					'phone': me.get('phone').getData(),
					'email': this.get('email').getData()
				}, function(response) {
					me.get('GoToThanksEvent').fire(response);
				});	            
            });
        },

        clearErrors: function() {
        	this._errors = [];

        	this.get('error').hide();

			this.get('firstName').clearError();
			this.get('lastName').clearError();
			this.get('phone').clearError();
			this.get('email').clearErrors();
        },
        
		isComplete: function() {
			return !this.get('firstName').isEmptyTransient() && !this.get('lastName').isEmptyTransient() && !this.get('phone').isEmptyTransient() && !this.get('email').isEmptyTransient();
		},

        _isGoodToGo: function() {
	        
	        if (this.isComplete()) {

				this.clearErrors();
				this.validate();
				
				if (this.getErrors().length === 0) {
					this.get('nextBtn').enable();
				} else {
					this.get('nextBtn').disable();
				}
				
	        } else {
				this.get('nextBtn').disable();
	        }
        },
        
        _setup: function() {
	        this.get('nextBtn').disable();
        },
        
        validate: function() {
			this._errors = [];

			this.get('firstName').validate();
			this._errors = this._errors.concat(this.get('firstName').getErrors());			

			this.get('lastName').validate();
			this._errors = this._errors.concat(this.get('lastName').getErrors());			

            this.get('email').trim();
			this.get('email').validate();
			this._errors = this._errors.concat(this.get('email').getErrors());
        }
        
    });
});
