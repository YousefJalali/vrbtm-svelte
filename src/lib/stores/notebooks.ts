import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const defaultNotebooks = {
	'6a7b28f1-d8db-4739-9c63-cb5de9ab3b94': {
		name: 'Understanding Quantum Physics',
		text: 'Quantum physics explores the behavior of particles at the atomic and subatomic levels. For example, particles can exist in multiple states simultaneously, a phenomenon known as superposition. Additionally, the uncertainty principle, formulated by Werner Heisenberg, states that one cannot simultaneously know both the position and momentum of a particle with absolute precision. This principle is crucial for understanding the complex nature of quantum mechanics. It is fascinating how such principles influence technologies like quantum computing and cryptography.'
	},
	'7c2a29b2-a7a2-4816-85f9-8c3de0cba3d1': {
		name: 'Advanced Calculus Techniques',
		text: 'Advanced calculus often involves techniques such as integration by parts, partial fractions, and contour integration. For instance, the integral of e^x from 0 to 1 is e - 1, which is approximately 1.718. Another key concept is the Taylor series, which provides a polynomial approximation of functions around a point. Understanding these techniques is essential for solving complex problems in fields like physics and engineering. The interplay between theory and application makes advanced calculus a critical area of study.'
	},
	'4b5f39c3-b9b5-4a7d-b0f4-7f6ad9b3cfa2': {
		name: 'Chemical Reactions and Equilibria',
		text: 'Chemical reactions are processes in which substances transform into new substances with different properties. For example, the reaction between hydrogen and oxygen to form water is represented by the equation 2H₂ + O₂ → 2H₂O. Chemical equilibria occur when the rate of the forward reaction equals the rate of the reverse reaction, resulting in constant concentrations of reactants and products. The equilibrium constant (K) quantifies the position of equilibrium and is vital for predicting the behavior of reactions in various conditions.'
	},
	'8d6a49d4-c9c6-4e2f-8b5d-9e7b0e4db5e3': {
		name: 'Exploring Modern Literature',
		text: "Modern literature often reflects contemporary issues and explores diverse perspectives. Authors like Haruki Murakami and Margaret Atwood use unique narrative styles and address themes such as identity, technology, and society. For example, Murakami's novel '1Q84' blends reality with fantasy in a story set in an alternate Tokyo. Literature from this era frequently incorporates elements like nonlinear storytelling and symbolic language to challenge readers and provoke thought. The rich tapestry of modern literature offers insights into the human condition and cultural shifts."
	},
	'9e7a59e5-db7f-4f3e-9b7e-0f8b1e5ec6f4': {
		name: 'World War II: Key Events',
		text: 'World War II, which lasted from 1939 to 1945, was marked by significant events and turning points. The invasion of Poland by Germany in September 1939 triggered the conflict. Key moments include the Battle of Stalingrad, which ended with a decisive Soviet victory, and the D-Day invasion of Normandy in June 1944, which marked the beginning of the end for Nazi Germany. The war concluded with the unconditional surrender of Germany in May 1945 and Japan in September 1945 after the atomic bombings of Hiroshima and Nagasaki. These events reshaped global geopolitics and led to the establishment of the United Nations.'
	}
}

function handleNotebooks() {
	const { subscribe, set, update } = writable<{ [id: string]: { name: string; text: string } }>(
		defaultNotebooks
	)

	function create({ name }: { name: string }) {
		update((notebooks) => ({ [uuidv4()]: { name, text: '' }, ...notebooks }))
	}

	function updateName({ id, name }: { id: string; name: string }) {
		const allNotebooks = { ...get(notebooks) }
		allNotebooks[id].name = name
		set(allNotebooks)
	}

	function updateText({ id, text }: { id: string; text: string }) {
		const allNotebooks = { ...get(notebooks) }
		allNotebooks[id].text = text
		set(allNotebooks)
	}

	function remove(notebookId: string) {
		const allNotebooks = { ...get(notebooks) }
		delete allNotebooks[notebookId]
		set(allNotebooks)
	}

	function findId(name: string | null) {
		if (!name) return

		const allNotebooks = { ...get(notebooks) }
		for (const n in allNotebooks) {
			if (allNotebooks[n].name === name) return n
		}
	}

	return {
		subscribe,
		set,
		update,
		create,
		updateName,
		updateText,
		remove,
		findId
	}
}

export const notebooks = handleNotebooks()
