export type Animation = {
	type: string;
	duration: number;
	direction: string;
	transition: string;
	group: string;
};

export const animations = {
	fade: (options: Animation) => {
		console.log(options);
		return `animate__fade${mappings[options.transition]}${mappings[options.direction]}`;
	},
	slide: (options: Animation) => {
		console.log(options);
		return `animate__slide${mappings[options.transition]}${mappings[options.direction]}`;
	},
	bounce: (options: Animation) => {
		console.log(options);
		return `animate__bounce${mappings[options.transition]}${mappings[options.direction]}`;
	}
};

type Mappings = {
	[key: string]: string;
};

const mappings: Mappings = {
	up: 'Up',
	down: 'Down',
	left: 'Left',
	right: 'Right',
	enter: 'In',
	exit: 'Out'
};
