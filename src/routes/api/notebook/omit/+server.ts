import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

export const POST = async (event: RequestEvent) => {
	const requestBody = await event.request.json()
	const { message: _message } = requestBody

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: `"${_message}". Find all the keywords and put them inside double backticks in place. and return the text without double quote. note: if you receive anything other than text, reply with something like Please insert a paragraph`
			}
		],
		model: 'gpt-4o-mini'
	})

	return json(chatCompletion)
}
