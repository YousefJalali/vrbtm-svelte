import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

export const POST = async (event: RequestEvent) => {
	const requestBody = await event.request.json()
	const { texts, previousFlashcards } = requestBody

	// console.log({ _message })

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: `"${texts}". generate a short and sweet flashcard from the provided array of texts. here is an array of previous generated flashcards by you so you wont duplicate ${previousFlashcards}. return an object that can be parsed {question:string, answer:string}. in case you cant fulfill the request return an object that can be parsed {success:false}`
			}
		],
		model: 'gpt-4o-mini'
	})

	return json(chatCompletion)
}
