/* jshint unused:true, eqnull:true */

BH.add('TextInput', function() {
	
	"use strict";
    eval(BH.System);

    var TextInputChangeEvent = BH.Class(BH.Base, {
	    
        _init: function(node) {
            this.parent._init.call(this);

            this._node = node;
            this._status = 'stable'; // stable | changing

            this.set('changeEvent', new BH.Event());

            this._behavior();
        },

        _behavior: function() {
            var me = this;

            this._node.on('change', function() {
	            
                if (me._status === 'stable') {
	                
                    me.get('changeEvent').fire();
                    me._status = 'changing';
                    
                    setTimeout(function() {
                        me._status = 'stable';
                    }, 200);
                }
            });

            this._node.on('blur', function() {

                if (me._status === 'stable') {
                    me.get('changeEvent').fire();
                } else {
                    me._status = 'stable';
                }
            });
        }
    });

    BH.TextInput = BH.Class(BH.Widget, {

        _init: function(node, cfg) {
            cfg = cfg || {};
            this.parent._init.call(this, node);

            this._cfg = cfg;
            this._placeHolder = cfg.placeHolder || '';

            this._usePlaceholder = false;
            
            this._autoCorrectValue = cfg.autoCorrectValue;
            this._disabled = false;
            this._status = 'empty'; // empty | filled
            this._validation = new BH.Validation();
            this._maxlength = cfg.maxlength || this._node.attr('maxlength') || 255;
            this._originalTabIndex = this._node.attr('tabindex');

            this.set('blurEvent', new BH.Event());
            this.set('changeEvent', new BH.Event());
            this.set('errorEvent', new BH.Event());
            this.set('focusEvent', new BH.Event());
            this.set('keyupEvent', new BH.Event());
            this.set('pressEnterEvent', new BH.Event());
            this.set('textInputChangeEvent', new TextInputChangeEvent(this._node));
            this.set('value', new BH.Attr());
        },

        _render: function() {
            if (this._usePlaceholder) {
                this._node.val(this._placeHolder).addClass('placeholder');
            }

            this._node.attr('maxlength', this._maxlength);
        },

        _behavior: function() {
            var me = this;

            this.on(this.get('textInputChangeEvent').get('changeEvent'), function() {
                me._change();
                me.get('changeEvent').fire();
            });

            this.on(this.get('value'), function(v) {
                me._displayValue(v);
            });

            this._node.on('focus', function() {
                if (me._status === 'empty') {
                    me._node.val('').removeClass('placeholder');
                }
                me.get('focusEvent').fire();
            });

            this._node.on('blur', function() {
                setTimeout(function() {
	                if (me._usePlaceholder && me._status === 'empty') {
	                    me._node.val(me._placeHolder).addClass('placeholder');
	                }
                }, 200);
                me.get('blurEvent').fire();
            });

            me._node.keypress(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    me.get('pressEnterEvent').fire(event);
                }
            });

            me._node.on('keyup', function() {
                me.get('keyupEvent').fire();
            });
        },

        _change: function() {
	        
            var v = this._node.val();

            if (this._usePlaceholder && v === this._placeHolder) {
                v = '';
            }
            this.setData(v);
        },

        addValidation: function(rule) {
            this._validation.addRule(rule);
        },

        getErrors: function() {
            return this._validation.getErrors();
        },

        _displayValue: function(v) {
            var me = this;
            
            if (v === null || v === '') {
                me._status = 'empty';
                if (me._usePlaceholder) {
                    me._node.val(me._placeHolder).addClass('placeholder');
                }
            } else {
                me._status = 'filled';
                me._node.val(v);
                me._node.removeClass('placeholder');
            }
        },

        getData: function() {
            this._change(); // move this line to here from validate
            return this.get('value').get();
        },

        getTransientData: function() {
            return this._node.val();
        },

        _validate: function(v) {
            this._node.removeClass('field-error');

            this._validation.validate(v);

            if (this._validation.hasErrors()) {

                if (this._autoCorrectValue != null) { // Do not change this to !==
                    v = this._autoCorrectValue;
                    this._validation.validate(v);
                }

                this._node.addClass('field-error');
                this.get('errorEvent').fire(this.getErrors()[0].message);
            }
            
            return v;
        },

        setData: function(v) {

            if (v && v.length > this._maxlength) {
                v = v.substr(0, this._maxlength);
            }

            v = this._validate(v);

            this.get('value').set(v);
        },

        validate: function() {
	        var data = this.getTransientData();
            this._validate(data);
        },

        clear: function(clearPlaceholder) {
            var me = this;
            
            me.clearError();
            
            this.get('value').set('');
            
            if (me._usePlaceholder) {
                me._node.val(me._placeHolder).addClass('placeholder');
            } else {
                me._node.val('');
            }
            
            if (clearPlaceholder && this._node.attr('placeholder')) {
                this._node.removeAttr('placeholder');
            }
        },

        toggleEnabled: function(on) {
            if (on) {
                this.enable();
            } else {
                this.disable();
            }
        },

        disable: function() {
            this._disabled = true;
            this._node.attr('tabindex', -1);
            this._node.attr('readonly', 'readonly');
        },

        enable: function() {
            this._disabled = false;
            if (this._originalTabIndex) {
                this._node.attr('tabindex', this._originalTabIndex);
            } else {
                this._node.removeAttr('tabindex');
            }
            this._node.removeAttr('readonly');
        },

        clearError: function() {
            this._node.removeClass('field-error');
            this._validation.clearError();
        },

        isComplete: function() {

            this.clearError();
            this.validate();

            return !this.hasErrors();
        },

        isEmpty: function() {
            return !this.getData();
        },

		// isEmptyTransient checks without triggering validation
        isEmptyTransient: function() {
            return !this.getTransientData();
        },

        focus: function() {
            if (!this._disabled) {
                this._node.focus();
            }
        },

        blur: function() {
            this._node.blur();
        },

        hasErrors: function() {
            return this._validation.hasErrors();
        },

        disableAutocomplete: function() {
            this._node.attr('autocomplete', 'off');
        },

        enableAutocomplete: function() {
            this._node.attr('autocomplete', 'on');
        },

        enableNumberInput: function() {
            this._node.attr('pattern', '\\d*');
        },

        disableNumberInput: function() {
            this._node.removeAttr('pattern');
        },

        toggleDoPlaceholder: function(on) {
            if (on) {
                this._usePlaceholder = true;
                if (this._placeHolder) {
                    this._node.attr('placeholder', this._placeHolder);
                }
            } else {
                if (this._usePlaceholder) {
                    if (this._status === 'empty') {
                        this._node.val('').removeClass('placeholder');
                    }
                }
                this._usePlaceholder = false;
                this._placeHolder = this._placeHolder || this._node.attr('placeholder');
                this._node.removeAttr('placeholder');
            }
        },

        setPlaceholderText: function(text) {
            this._placeHolder = text;
            this._node.attr('placeholder', text);

            if (this._usePlaceholder) {
                if (this._status === 'empty') {
                    this._node.val(this._placeHolder).addClass('placeholder');
                }
            }

        }
    });
});