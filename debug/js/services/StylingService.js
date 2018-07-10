BH.add('StylingService', function() {
	
	"use strict";
    eval(BH.System);

    var StylingService = BH.Class(BH.Widget, {

		// Stub
        save_user_info: function(data, successCb, errorCb) {
		
			var random = Math.floor(Math.random() * (2));
			
			if (random === 0) {
				if (successCb) {
					successCb({
						'scheduled_appointment_date': 1543000626
					});
				}
			} else {
				if (errorCb) {
					errorCb('Sorry, something went wrong.');
				}
			}			
        }

    });

    if (!BH.StylingService) {
        BH.StylingService = new StylingService();
        BH.StylingService.render();
    }
});
