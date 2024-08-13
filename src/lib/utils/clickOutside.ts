import type { Action } from 'svelte/action'

export const clickOutside: Action<
	HTMLElement,
	'click' | 'contextmenu' | undefined,
	{ 'on:outclick': (e: CustomEvent<string>) => void }
> = (node, type = 'click') => {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'))
		}
	}

	document.addEventListener(type, handleClick, true)

	return {
		destroy() {
			document.removeEventListener(type, handleClick, true)
		}
	}
}
