import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

export const POST = async (event: RequestEvent) => {
	const requestBody = await event.request.json()
	const { texts, previousFlashcards } = requestBody

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: `"${texts.join(' ')}". generate a short flashcard of type {question:string, answer:string} from the provided text, the questions and answer should be from the context of the text. an array of previous generated flashcards may be provided so you wont make a duplicate ${previousFlashcards}, if its empty, please generate a new flashcard. return an object that can be parsed {question:string, answer:string}. in case you cant fulfill the request you should always return an object {success:false} that can be parsed`
			}
		],
		model: 'gpt-4o-mini'
	})

	return json(chatCompletion)
}
