BH.add('EmailInput', function() {
	
	"use strict";
    eval(BH.System);

    BH.EmailInput = new BH.Class(BH.BaseCompositeInput, {

        _init: function(node) {
            this.parent._init.call(this, node);
            
            this._dGenericErrorMessage = this._node.find('.error-message');

            this.set('emailLoginErrorMessage', new BH.Widget(this._node.find('.bh-id-email-login-error-message')));
            this.set('emailLoginErrorLink', new BH.Button(this._node.find('.bh-id-email-login-error-link')));

			this._emailNode = this._node.find('.bh-id-email');

            this._addInput({
                cls: BH.TextInput,
                name: 'email',
                node: this._emailNode,
                validationRules: [
                    BH.ValidationRules.Required,
                    BH.ValidationRules.Email
                ],
                inputCfg: {
                    maxlength: 45
                }
            });

			this.set('changeEvent', new BH.Event());
            this.set('doEmailLoginEvent', new BH.Event());
            this.set('keyupEvent', new BH.Event());
        },

        _render: function() {
            this.parent._render.call(this);
            this.get('emailLoginErrorLink').render();
        },

        _behavior: function() {
            var me = this;
            me.parent._behavior.call(me);

            this.on(this.get('emailLoginErrorLink').get('clickEvent'), function() {
                me.get('doEmailLoginEvent').fire();
            });

			this.on(this.get('email').get('changeEvent'), function() {
				me.get('changeEvent').fire();
			});

			this.on(this.get('email').get('keyupEvent'), function() {
				me.get('keyupEvent').fire();
			});
        },

        _displayEmailRowError: function() {
            var me = this;
            
            setTimeout(function() {
                var requiredError = BH.ValidationError.hasErrorType('required', me.get('email').getErrors()),
                    invalidError = BH.ValidationError.hasErrorType('invalid', me.get('email').getErrors());

                if (requiredError) {
                    me._node.addClass('required-field-error');
                } else {
                    me._node.removeClass('required-field-error');
                }
                
            }, 0);

        },

        _handleErrors: function() {
            this._errors = [];
            this.get('_extendHandleErrorsEvent').fire();
            this._displayEmailRowError();
        },

        getData: function() {
            return this.get('email').getData();
        },

        getTransientData: function() {
            return {
                email: this.get('email').getTransientData()
            };
        },

        clearErrors: function() {
            this.get('email').clearError();
            this._node.removeClass('required-field-error');
        },

        clear: function() {
            this.get('email').clear();
        },

        disable: function() {
            this.get('email').disable();
        },

        setData: function(data) {
            if (data.email) {
                this.get('email').setData(data.email);
            }
        },

        setEmail: function(email) {
            this.get('email').get('value').set(email);
        },

        isEmpty: function() {
            return !this.get('email').getData();
        },

        isEmptyTransient: function() {
            return !this.get('email').getTransientData();
        },
        
        trim: function() {
	        var _data = this.get('email').getTransientData();
	        this.get('email').setData(_data.trim());
        }
    });
});