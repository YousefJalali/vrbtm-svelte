export function longpress(node: HTMLElement, duration: number) {
	let timer: number

	const handleMousedown = () => {
		timer = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'))
		}, duration)
	}

	const handleMouseup = () => {
		clearTimeout(timer)
	}

	node.addEventListener('mousedown', handleMousedown)
	node.addEventListener('mouseup', handleMouseup)

	return {
		update(newDuration: number) {
			duration = newDuration
		},
		destroy() {
			node.removeEventListener('mousedown', handleMousedown)
			node.removeEventListener('mouseup', handleMouseup)
		}
	}
}
