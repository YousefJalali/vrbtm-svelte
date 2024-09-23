import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

const GenerateFlashcard = z.object({
	question: z.string(),
	answer: z.string()
})

export const POST = async (event: RequestEvent) => {
	const requestBody = await event.request.json()
	const { texts, previousFlashcards } = requestBody

	try {
		const chatCompletion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'user',
					content: `"${texts.join(' ')}". generate a short flashcard from the provided text, the question and answer should be from the context of the text. an array of previous generated flashcards may be provided so you wont make a duplicate ${previousFlashcards}, if the array is empty, please generate a new flashcard`
				}
			],
			response_format: zodResponseFormat(GenerateFlashcard, 'generate_flashcard')
		})

		console.log(chatCompletion.choices[0].message)

		return json(chatCompletion)
	} catch (error) {
		console.log('API Flashcard', error)
	}
}
