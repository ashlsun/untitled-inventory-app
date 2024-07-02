export function randomIntFromInterval(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function once<T extends Event>(fn?: (event: T) => void) {
	return function (event: T) {
		if (fn) fn(event);
		fn = undefined;
	};
}

export function preventDefault<T extends Event>(fn?: (event: T) => void) {
	return function (event: T) {
		event.preventDefault();
		if (fn) fn(event);
	};
}

export function stopPropagation<T extends Event>(fn?: (event: T) => void) {
	return function (event: T) {
		event.stopPropagation();
		if (fn) fn(event);
	};
}
