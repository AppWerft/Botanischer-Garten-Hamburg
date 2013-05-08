exports.getPosition = function(_options) {
	var region = _options.source.region, x = _options.x, y = _options.y, width = _options.source.rect.width, height = _options.source.rect.height;
	return {
		latitude : region.latitude - region.latitudeDelta / 2 - x * region.latitudeDelta / width,
		longitude : region.longitude - region.longitudeDelta / 2 - y * region.longitudeDelta / height
	};
}
exports.getArea = function(_position, _areas) {
}
