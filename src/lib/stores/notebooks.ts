// import { browser } from '$app/environment'
import { get, writable } from 'svelte/store'

const defaultNotebooks = {
	'Understanding Quantum Physics':
		'Quantum physics explores the behavior of particles at the atomic and subatomic levels. For example, particles can exist in multiple states simultaneously, a phenomenon known as superposition. Additionally, the uncertainty principle, formulated by Werner Heisenberg, states that one cannot simultaneously know both the position and momentum of a particle with absolute precision. This principle is crucial for understanding the complex nature of quantum mechanics. It is fascinating how such principles influence technologies like quantum computing and cryptography.',
	'Advanced Calculus Techniques':
		'Advanced calculus often involves techniques such as integration by parts, partial fractions, and contour integration. For instance, the integral of e^x from 0 to 1 is e - 1, which is approximately 1.718. Another key concept is the Taylor series, which provides a polynomial approximation of functions around a point. Understanding these techniques is essential for solving complex problems in fields like physics and engineering. The interplay between theory and application makes advanced calculus a critical area of study.',
	'Chemical Reactions and Equilibria':
		'Chemical reactions are processes in which substances transform into new substances with different properties. For example, the reaction between hydrogen and oxygen to form water is represented by the equation 2H₂ + O₂ → 2H₂O. Chemical equilibria occur when the rate of the forward reaction equals the rate of the reverse reaction, resulting in constant concentrations of reactants and products. The equilibrium constant (K) quantifies the position of equilibrium and is vital for predicting the behavior of reactions in various conditions.',
	'Exploring Modern Literature':
		"Modern literature often reflects contemporary issues and explores diverse perspectives. Authors like Haruki Murakami and Margaret Atwood use unique narrative styles and address themes such as identity, technology, and society. For example, Murakami's novel '1Q84' blends reality with fantasy in a story set in an alternate Tokyo. Literature from this era frequently incorporates elements like nonlinear storytelling and symbolic language to challenge readers and provoke thought. The rich tapestry of modern literature offers insights into the human condition and cultural shifts.",
	'World War II: Key Events':
		'World War II, which lasted from 1939 to 1945, was marked by significant events and turning points. The invasion of Poland by Germany in September 1939 triggered the conflict. Key moments include the Battle of Stalingrad, which ended with a decisive Soviet victory, and the D-Day invasion of Normandy in June 1944, which marked the beginning of the end for Nazi Germany. The war concluded with the unconditional surrender of Germany in May 1945 and Japan in September 1945 after the atomic bombings of Hiroshima and Nagasaki. These events reshaped global geopolitics and led to the establishment of the United Nations.'
}

function fetchNotebooks() {
	// if (browser) {
	// 	const storedNotebooks = localStorage.getItem('notebooks')

	// 	if (typeof storedNotebooks === 'string' && Object.keys(JSON.parse(storedNotebooks)).length)
	// 		return JSON.parse(storedNotebooks)
	// }

	return defaultNotebooks

	return {
		sample: ''
	}
}

function handleNotebooks() {
	const { subscribe, set, update } = writable<{ [notebookId: string]: string }>(fetchNotebooks())

	function create({ name }: { name: string }) {
		const newNotebook = { [name]: '' }
		update((notebooks) => ({ ...newNotebook, ...notebooks }))

		// const storedNotebooks = localStorage.getItem('notebooks') || {}
		// localStorage.setItem('notebooks', JSON.stringify({ ...newNotebook, ...storedNotebooks }))
	}

	function updateName({ oldName, newName }: { oldName: string; newName: string }) {
		const allNotebooks = { ...get(notebooks) }
		delete Object.assign(allNotebooks, { [newName]: allNotebooks[oldName] })[oldName]
		// let newNotebook = {
		// 	[name]: allNotebooks[name]
		// }

		// delete allNotebooks[name]
		set({ ...allNotebooks })
	}

	function updateText({ name, text }: { name: string | null; text: string }) {
		if (!name) return

		const allNotebooks = { ...get(notebooks) }
		allNotebooks[name] = text
		set(allNotebooks)

		// localStorage.setItem('notebooks', JSON.stringify(allNotebooks))
	}

	function remove(name: string) {
		let allNotebooks = { ...get(notebooks) }
		delete allNotebooks[name]

		if (!Object.keys(allNotebooks).length) allNotebooks = { sample: '' }

		set(allNotebooks)

		// localStorage.setItem('notebooks', JSON.stringify(allNotebooks))
	}

	return {
		subscribe,
		set,
		update,
		create,
		updateName,
		updateText,
		remove
	}
}

export const notebooks = handleNotebooks()
