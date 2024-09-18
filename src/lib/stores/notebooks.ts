// import { browser } from '$app/environment'
import { get, writable } from 'svelte/store'
import { v4 as uuid } from 'uuid'

const defaultNotebooks = {
	'Understanding Quantum Physics': {
		text: [
			{
				id: uuid(),
				original:
					'Quantum physics explores the behavior of particles at the atomic and subatomic levels. For example, particles can exist in multiple states simultaneously, a phenomenon known as superposition. Additionally, the uncertainty principle, formulated by Werner Heisenberg, states that one cannot simultaneously know both the position and momentum of a particle with absolute precision. This principle is crucial for understanding the complex nature of quantum mechanics. It is fascinating how such principles influence technologies like quantum computing and cryptography.',
				omitted: ''
			}
		],
		isOmitted: false,
		isOmittedWordsVisible: false
	},
	'Advanced Calculus Techniques': {
		text: [
			{
				id: uuid(),
				original:
					'Advanced calculus often involves techniques such as integration by parts, partial fractions, and contour integration. For instance, the integral of e^x from 0 to 1 is e - 1, which is approximately 1.718. Another key concept is the Taylor series, which provides a polynomial approximation of functions around a point. Understanding these techniques is essential for solving complex problems in fields like physics and engineering. The interplay between theory and application makes advanced calculus a critical area of study.',
				omitted: ''
			}
		],
		isOmitted: false,
		isOmittedWordsVisible: false
	},
	'Chemical Reactions and Equilibria': {
		text: [
			{
				id: uuid(),
				original:
					'Chemical reactions are processes in which substances transform into new substances with different properties. For example, the reaction between hydrogen and oxygen to form water is represented by the equation 2H₂ + O₂ → 2H₂O. Chemical equilibria occur when the rate of the forward reaction equals the rate of the reverse reaction, resulting in constant concentrations of reactants and products. The equilibrium constant (K) quantifies the position of equilibrium and is vital for predicting the behavior of reactions in various conditions.',
				omitted: ''
			}
		],
		isOmitted: false,
		isOmittedWordsVisible: false
	},
	'Exploring Modern Literature': {
		text: [
			{
				id: uuid(),
				original:
					"Modern literature often reflects contemporary issues and explores diverse perspectives. Authors like Haruki Murakami and Margaret Atwood use unique narrative styles and address themes such as identity, technology, and society. For example, Murakami's novel '1Q84' blends reality with fantasy in a story set in an alternate Tokyo. Literature from this era frequently incorporates elements like nonlinear storytelling and symbolic language to challenge readers and provoke thought. The rich tapestry of modern literature offers insights into the human condition and cultural shifts.",
				omitted: ''
			}
		],
		isOmitted: false,
		isOmittedWordsVisible: false
	},
	'World War II: Key Events': {
		text: [
			{
				id: uuid(),
				original:
					'World War II, which lasted from 1939 to 1945, was marked by significant events and turning points. The invasion of Poland by Germany in September 1939 triggered the conflict. Key moments include the Battle of Stalingrad, which ended with a decisive Soviet victory, and the D-Day invasion of Normandy in June 1944, which marked the beginning of the end for Nazi Germany. The war concluded with the unconditional surrender of Germany in May 1945 and Japan in September 1945 after the atomic bombings of Hiroshima and Nagasaki. These events reshaped global geopolitics and led to the establishment of the United Nations.',
				omitted: ''
			}
		],
		isOmitted: false,
		isOmittedWordsVisible: false
	}
}

function fetchNotebooks() {
	// if (browser) {
	// 	const storedNotebooks = localStorage.getItem('notebooks')

	// 	if (typeof storedNotebooks === 'string' && Object.keys(JSON.parse(storedNotebooks)).length)
	// 		return JSON.parse(storedNotebooks)
	// }

	return defaultNotebooks

	// return {
	// 	sample: ''
	// }
}

async function fetchOmittedText(text: string) {
	try {
		const res = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: text
			})
		})

		const data = await res.json()

		return data
	} catch (error) {
		console.log('err', error)
		return 'something went wrong'
	}
}

const sampleNotebook = {
	text: [
		{
			id: uuid(),
			original: '',
			omitted: ''
		}
	],
	isOmitted: false,
	isOmittedWordsVisible: false
}

function handleNotebooks() {
	const { subscribe, set, update } = writable<{
		[notebookId: string]: {
			text: { id: string; original: string; omitted: string }[]
			isOmitted: boolean
			isOmittedWordsVisible: boolean
		}
	}>(fetchNotebooks())

	function create({ name }: { name: string }) {
		const newNotebook = {
			[name]: sampleNotebook
		}
		update((notebooks) => ({ ...newNotebook, ...notebooks }))

		// const storedNotebooks = localStorage.getItem('notebooks') || {}
		// localStorage.setItem('notebooks', JSON.stringify({ ...newNotebook, ...storedNotebooks }))
	}

	function updateName({ oldName, newName }: { oldName: string; newName: string }) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[oldName]) return
		delete Object.assign(allNotebooks, { [newName]: allNotebooks[oldName] })[oldName]
		// let newNotebook = {
		// 	[name]: allNotebooks[name]
		// }

		// delete allNotebooks[name]
		set({ ...allNotebooks })
	}

	function updateText({
		name,
		text,
		textIndex
	}: {
		name: string
		text: string
		textIndex: number
	}) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[name]) return

		allNotebooks[name].text[textIndex].original = text
		set(allNotebooks)

		// localStorage.setItem('notebooks', JSON.stringify(allNotebooks))
	}

	function addText({ name, text }: { name: string; text: string }) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[name]) return

		allNotebooks[name].text = [
			{ id: uuid(), original: text, omitted: '' },
			...allNotebooks[name].text
		]

		set(allNotebooks)
	}

	function remove(name: string) {
		let allNotebooks = { ...get(notebooks) }
		delete allNotebooks[name]

		if (!Object.keys(allNotebooks).length)
			allNotebooks = {
				sample: sampleNotebook
			}

		set(allNotebooks)

		// localStorage.setItem('notebooks', JSON.stringify(allNotebooks))
	}

	// function clearOmit({ name, textIndex }: { name: string; textIndex: number }) {
	// 	const allNotebooks = { ...get(notebooks) }
	// 	const notebook = allNotebooks[name]

	// 	if (!notebook) return

	// 	if (notebook.text.length) {
	// 		notebook.text[textIndex] = notebook.text[textIndex].replaceAll('`', '')
	// 	}
	// 	notebook.isOmitted = false
	// 	notebook.isOmittedWordsVisible = false

	// 	allNotebooks[name] = notebook

	// 	set(allNotebooks)
	// }

	function showOmittedWords({ name }: { name: string }) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[name]) return

		allNotebooks[name].isOmittedWordsVisible = true
		set(allNotebooks)
	}

	function hideOmittedWords({ name }: { name: string }) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[name]) return

		allNotebooks[name].isOmittedWordsVisible = false
		set(allNotebooks)
	}

	async function omit({ name, textIndex }: { name: string; textIndex: number }) {
		const allNotebooks = { ...get(notebooks) }
		const notebook = allNotebooks[name]

		if (!notebook || !notebook.text.length || textIndex < 0) return { success: false }

		const index = Math.min(textIndex, notebook.text.length - 1)

		const omitted = await fetchOmittedText(notebook.text[index].original)

		if (typeof omitted === 'string') return { success: false }

		notebook.text[index].omitted = omitted.choices[0].message.content
		notebook.isOmitted = true
		notebook.isOmittedWordsVisible = false

		allNotebooks[name] = notebook

		set(allNotebooks)

		return { success: true }
	}

	return {
		subscribe,
		set,
		update,
		create,
		updateName,
		updateText,
		addText,
		remove,
		// clearOmit,
		showOmittedWords,
		hideOmittedWords,
		omit
	}
}

export const notebooks = handleNotebooks()
