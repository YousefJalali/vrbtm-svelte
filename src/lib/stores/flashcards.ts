import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { notebooks } from './notebooks'

// const def = [
// 	{
// 		id: 'a069bc0b-bb9a-46de-8008-fc19f355c985',
// 		notebookId: 'ab5cba1a-ae9c-463d-96f7-17b6e74bd9c9',
// 		question: 'What is the derivative of x²?',
// 		answer: 'The derivative of x² is 2x.'
// 	},
// 	{
// 		id: 'd7c8a7b1-1428-4f61-bb84-06b2f8e89df1',
// 		notebookId: '6d9d30de-0c07-43b0-97df-1506caa33431',
// 		question: 'What is the capital of France?',
// 		answer: 'The capital of France is Paris.'
// 	},
// 	{
// 		id: 'fc1a07c6-d191-445e-a83e-43a87ebc8245',
// 		notebookId: 'a484e566-5acc-4113-9140-f17d87562dbe',
// 		question: 'What is the powerhouse of the cell?',
// 		answer: 'The powerhouse of the cell is the mitochondrion.'
// 	},
// 	{
// 		id: '3f8ad2b7-6c1c-4b11-9174-9fbf6b169416',
// 		notebookId: 'fa9de3d6-0478-401f-b2c0-aa9b72bc4b6d',
// 		question: "Who wrote 'Romeo and Juliet'?",
// 		answer: "William Shakespeare wrote 'Romeo and Juliet'."
// 	},
// 	{
// 		id: 'c8a9e8be-83da-4b28-93a4-992fd0891e1c',
// 		notebookId: 'a069bc0b-bb9a-46de-8008-fc19f355c985',
// 		question: 'What is the chemical symbol for water?',
// 		answer: 'The chemical symbol for water is H₂O.'
// 	},
// 	{
// 		id: '9f5d2ab1-0563-4741-b3a3-7bff1c9f7f82',
// 		notebookId: 'ab5cba1a-ae9c-463d-96f7-17b6e74bd9c9',
// 		question: 'What is the largest planet in our solar system?',
// 		answer: 'The largest planet in our solar system is Jupiter.'
// 	},
// 	{
// 		id: 'd1e0ab82-4f5f-4208-a9a4-3b4d8abf2f89',
// 		notebookId: '6d9d30de-0c07-43b0-97df-1506caa33431',
// 		question: 'What is the square root of 81?',
// 		answer: 'The square root of 81 is 9.'
// 	},
// 	{
// 		id: 'a8f527ab-6723-4825-907c-5b2ab1f6b768',
// 		notebookId: 'a484e566-5acc-4113-9140-f17d87562dbe',
// 		question: 'In what year did the Titanic sink?',
// 		answer: 'The Titanic sank in 1912.'
// 	},
// 	{
// 		id: '5b4f9ea6-7d1f-4d6c-a3d5-12f5e68f4c35',
// 		notebookId: 'fa9de3d6-0478-401f-b2c0-aa9b72bc4b6d',
// 		question: "What is the most abundant gas in Earth's atmosphere?",
// 		answer: "The most abundant gas in Earth's atmosphere is nitrogen."
// 	},
// 	{
// 		id: 'a7b63d2f-9c2f-4a9f-b3d9-3c8a7e2f8f4c',
// 		notebookId: 'a069bc0b-bb9a-46de-8008-fc19f355c985',
// 		question: 'Who painted the Mona Lisa?',
// 		answer: 'Leonardo da Vinci painted the Mona Lisa.'
// 	}
// ]

async function generateFlashcard(
	texts: string[],
	previousFlashcards: { question: string; answer: string }[]
) {
	try {
		const res = await fetch('/api/flashcard', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				texts,
				previousFlashcards: JSON.stringify(previousFlashcards)
			})
		})

		const data = await res.json()

		return data
	} catch (error) {
		console.log('err', error)
		return 'something went wrong'
	}
}

function handleFlashcards() {
	const { subscribe, set, update } = writable<
		{ id: string; notebookId: string; question: string; answer: string }[]
	>([])

	function create({
		notebookId,
		question,
		answer
	}: {
		notebookId: string
		question: string
		answer: string
	}) {
		update((flashcards) => [{ id: uuidv4(), notebookId, question, answer }, ...flashcards])
	}

	async function generate({ notebookId }: { notebookId: string }) {
		const cards = get(flashcards)

		const nbs = { ...get(notebooks) }
		const texts = nbs[notebookId].text.map((t) => t.original)

		const generated = await generateFlashcard(texts, cards)

		const res = generated.choices[0].message

		if (res.refusal) return

		update((flashcards) => [
			{ id: uuidv4(), notebookId, ...JSON.parse(res.content) },
			...flashcards
		])
	}

	function edit({ id, question, answer }: { id: string; question: string; answer: string }) {
		update((flashcards) => flashcards.map((f) => (f.id === id ? { ...f, question, answer } : f)))
	}

	function remove(flashcardId: string) {
		update((flashcards) => flashcards.filter((f) => f.id !== flashcardId))
	}

	return {
		subscribe,
		set,
		update,
		create,
		generate,
		edit,
		remove
	}
}

export const flashcards = handleFlashcards()
