import { writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const def = [
	{
		id: 'World War II: Key Events',
		notebookName: 'Understanding Quantum Physics',
		question: 'What is the derivative of x²?',
		answer: 'The derivative of x² is 2x.'
	},
	{
		id: 'd7c8a7b1-1428-4f61-bb84-06b2f8e89df1',
		notebookName: 'Advanced Calculus Techniques',
		question: 'What is the capital of France?',
		answer: 'The capital of France is Paris.'
	},
	{
		id: 'fc1a07c6-d191-445e-a83e-43a87ebc8245',
		notebookName: 'Chemical Reactions and Equilibria',
		question: 'What is the powerhouse of the cell?',
		answer: 'The powerhouse of the cell is the mitochondrion.'
	},
	{
		id: '3f8ad2b7-6c1c-4b11-9174-9fbf6b169416',
		notebookName: 'Exploring Modern Literature',
		question: "Who wrote 'Romeo and Juliet'?",
		answer: "William Shakespeare wrote 'Romeo and Juliet'."
	},
	{
		id: 'c8a9e8be-83da-4b28-93a4-992fd0891e1c',
		notebookName: 'World War II: Key Events',
		question: 'What is the chemical symbol for water?',
		answer: 'The chemical symbol for water is H₂O.'
	},
	{
		id: '9f5d2ab1-0563-4741-b3a3-7bff1c9f7f82',
		notebookName: 'Understanding Quantum Physics',
		question: 'What is the largest planet in our solar system?',
		answer: 'The largest planet in our solar system is Jupiter.'
	},
	{
		id: 'd1e0ab82-4f5f-4208-a9a4-3b4d8abf2f89',
		notebookName: 'Advanced Calculus Techniques',
		question: 'What is the square root of 81?',
		answer: 'The square root of 81 is 9.'
	},
	{
		id: 'a8f527ab-6723-4825-907c-5b2ab1f6b768',
		notebookName: 'Chemical Reactions and Equilibria',
		question: 'In what year did the Titanic sink?',
		answer: 'The Titanic sank in 1912.'
	},
	{
		id: '5b4f9ea6-7d1f-4d6c-a3d5-12f5e68f4c35',
		notebookName: 'Exploring Modern Literature',
		question: "What is the most abundant gas in Earth's atmosphere?",
		answer: "The most abundant gas in Earth's atmosphere is nitrogen."
	},
	{
		id: 'a7b63d2f-9c2f-4a9f-b3d9-3c8a7e2f8f4c',
		notebookName: 'World War II: Key Events',
		question: 'Who painted the Mona Lisa?',
		answer: 'Leonardo da Vinci painted the Mona Lisa.'
	}
]

function handleFlashcards() {
	const { subscribe, set, update } =
		writable<{ id: string; notebookName: string; question: string; answer: string }[]>(def)

	function create({
		notebookName,
		question,
		answer
	}: {
		notebookName: string
		question: string
		answer: string
	}) {
		update((flashcards) => [{ id: uuidv4(), notebookName, question, answer }, ...flashcards])
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
		edit,
		remove
	}
}

export const flashcards = handleFlashcards()
