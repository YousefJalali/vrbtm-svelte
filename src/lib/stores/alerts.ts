import { get, writable } from 'svelte/store'
import { v4 as uuid } from 'uuid'

type AlertType = 'error' | 'info' | 'success'

function handleAlerts() {
	const { subscribe, set, update } = writable<{ id: string; type: AlertType; message: string }[]>([
		// {
		// 	id: uuid(),
		// 	type: 'error',
		// 	message: 'Something went wrong!'
		// }
	])

	function add({ type, message }: { type: AlertType; message: string }) {
		const allAlerts = [...get(alerts)]

		if (allAlerts.length >= 3) allAlerts.shift()

		const id = uuid()

		allAlerts.push({
			id,
			type,
			message
		})

		set(allAlerts)

		return setTimeout(() => {
			clear(id)
		}, 3000)
	}

	function clear(id: string) {
		update((alerts) => alerts.filter((alert) => alert.id !== id))
	}

	return {
		subscribe,
		set,
		update,
		add,
		clear
	}
}

export const alerts = handleAlerts()
