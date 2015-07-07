angular.module( 'services.utils', ['lodash'])

.service('utils', function(lodash, config) {

	return {
		prepareUrl: function(uriSegments) {
			if (lodash.isNull(config.apiUrl)) {
				apiUrl = 'http://182.92.68.17:1337/api';
			}
			else {
				apiUrl = config.apiUrl;
			}

			return apiUrl + "/" + uriSegments;
		},

		showDatetime: function(string, format) {
			return moment(string).fromNow();
		}

	};

});
