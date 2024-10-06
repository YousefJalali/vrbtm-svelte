// import { browser } from '$app/environment'
import { notebooksData } from '$lib/constants/data'
import { get, writable } from 'svelte/store'
import { v4 as uuid } from 'uuid'

function fetchNotebooks() {
	// if (browser) {
	// 	const storedNotebooks = localStorage.getItem('notebooks')

	// 	if (typeof storedNotebooks === 'string' && Object.keys(JSON.parse(storedNotebooks)).length)
	// 		return JSON.parse(storedNotebooks)
	// }

	return { ...sampleNotebook() }
	return notebooksData

	// return {
	// 	sample: ''
	// }
}

async function fetchOmittedText(text: string) {
	try {
		const res = await fetch('/api/notebook/omit/text', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text
			})
		})

		const data = await res.json()

		return data
	} catch (error) {
		console.log('err', error)
		return 'something went wrong'
	}
}

async function fetchTitle(text: string) {
	try {
		const res = await fetch('/api/notebook/title', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text
			})
		})

		const data = await res.json()

		return data
	} catch (error) {
		console.log('err', error)
		return 'something went wrong'
	}
}

const sampleNotebook = () => ({
	[uuid()]: {
		title: 'New notebook',
		text: [],
		archived: false,
		flashcards: [],
		pinned: false
	}
})

function handleNotebooks() {
	const { subscribe, set, update } = writable<{
		[notebookId: string]: {
			title: string
			text: { id: string; original: string; omitted: string; keywords: string[] }[]
			archived: boolean
			pinned: boolean
			flashcards: string[]
		}
	}>(fetchNotebooks())

	function create() {
		let allNotebooks = { ...get(notebooks) }
		const firstNotebook = Object.values(allNotebooks)[0]
		if (
			firstNotebook.title === 'New notebook' &&
			!firstNotebook.text.length &&
			!firstNotebook.flashcards.length
		)
			throw Error('Already a new notebook')

		allNotebooks = { ...sampleNotebook(), ...allNotebooks }
		set(allNotebooks)

		// const storedNotebooks = localStorage.getItem('notebooks') || {}
		// localStorage.setItem('notebooks', JSON.stringify({ ...newNotebook, ...storedNotebooks }))
	}

	function updateTitle({ id, newTitle }: { id: string; newTitle: string }) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[id]) return
		allNotebooks[id].title = newTitle

		// delete allNotebooks[name]
		set({ ...allNotebooks })
	}

	function updateText({
		id,
		newText,
		textIndex
	}: {
		id: string
		newText: string
		textIndex: number
	}) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[id]) return

		allNotebooks[id].text[textIndex].original = newText
		set(allNotebooks)

		// localStorage.setItem('notebooks', JSON.stringify(allNotebooks))
	}

	function addText({ id, text }: { id: string; text: string }) {
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[id]) return

		const textId = uuid()

		allNotebooks[id].text = [
			{ id: textId, original: text, omitted: '', keywords: [] },
			...allNotebooks[id].text
		]

		set(allNotebooks)

		return textId
	}

	function removeText({ id, textId }: { id: string | null; textId: string }) {
		if (!id) return
		const allNotebooks = { ...get(notebooks) }
		if (!allNotebooks[id]) return

		allNotebooks[id].text = allNotebooks[id].text.filter((t) => t.id !== textId)

		set(allNotebooks)
	}

	function remove({ id }: { id: string | null }) {
		if (!id) return

		const allNotebooks = { ...get(notebooks) }
		delete allNotebooks[id]

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

	// function showOmittedWords({ id }: { id: string }) {
	// 	const allNotebooks = { ...get(notebooks) }
	// 	if (!allNotebooks[id]) return

	// 	allNotebooks[id].isOmittedWordsVisible = true
	// 	set(allNotebooks)
	// }

	// function hideOmittedWords({ id }: { id: string }) {
	// 	const allNotebooks = { ...get(notebooks) }
	// 	if (!allNotebooks[id]) return

	// 	allNotebooks[id].isOmittedWordsVisible = false
	// 	set(allNotebooks)
	// }

	async function omit({ id, textIndex }: { id: string; textIndex: number }) {
		const allNotebooks = { ...get(notebooks) }
		const notebook = allNotebooks[id]

		if (!notebook || !notebook.text.length || textIndex < 0) return

		const index = Math.min(textIndex, notebook.text.length - 1)

		const omitted = await fetchOmittedText(notebook.text[index].original)

		//if error
		if (omitted.message) throw Error(omitted.message)

		const res = omitted.choices[0].message

		//Ai refused to respond
		if (res.refusal) throw Error(omitted.message)

		const content = res.parsed || JSON.parse(res.content)

		console.log(content)

		notebook.text[index].omitted = content.text
		notebook.text[index].keywords = content.omittedKeywords

		allNotebooks[id] = notebook

		set(allNotebooks)
	}

	async function generateTitle({ id }: { id: string }) {
		const allNotebooks = { ...get(notebooks) }
		const notebook = allNotebooks[id]

		if (notebook.title !== 'New notebook') return

		const res = await fetchTitle(notebook.text[0].original)

		if (res.message || res.choices[0].message.refusal) throw Error(res.message)

		notebook.title = res.choices[0].message.content

		set(allNotebooks)
	}

	function toggleArchive({ id }: { id: string | null }) {
		if (!id) return
		const allNotebooks = { ...get(notebooks) }

		if (!allNotebooks[id]) return

		allNotebooks[id].archived = !allNotebooks[id].archived

		set(allNotebooks)
	}

	function togglePin({ id }: { id: string | null }) {
		if (!id) return
		const allNotebooks = { ...get(notebooks) }

		if (!allNotebooks[id]) return

		allNotebooks[id].pinned = !allNotebooks[id].pinned

		set(allNotebooks)
	}

	function addFlashcard({ notebookId, flashcardId }: { notebookId: string; flashcardId: string }) {
		const allNotebooks = { ...get(notebooks) }

		if (!allNotebooks[notebookId]) return
		allNotebooks[notebookId].flashcards.push(flashcardId)

		set(allNotebooks)
	}

	function removeFlashcard({
		notebookId,
		flashcardId
	}: {
		notebookId: string
		flashcardId: string
	}) {
		const allNotebooks = { ...get(notebooks) }

		if (!allNotebooks[notebookId]) return
		allNotebooks[notebookId].flashcards = allNotebooks[notebookId].flashcards.filter(
			(f) => f !== flashcardId
		)

		set(allNotebooks)
	}

	function getText({ notebookId, textId }: { notebookId: string; textId: string }) {
		const allNotebooks = { ...get(notebooks) }

		for (const t of allNotebooks[notebookId].text) {
			if (t.id === textId) return t
		}
	}

	return {
		subscribe,
		set,
		update,
		create,
		updateTitle,
		updateText,
		addText,
		removeText,
		remove,
		generateTitle,
		omit,
		toggleArchive,
		togglePin,
		addFlashcard,
		removeFlashcard,
		getText
	}
}

export const notebooks = handleNotebooks()
