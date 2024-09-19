import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

export const POST = async (event: RequestEvent) => {
	const requestBody = await event.request.json()
	const { text } = requestBody

	// console.log({ _message })

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: `"${text}". Find a very short title for this text, and return the title only. if you cant fulfill the request return "Untitled"`
			}
		],
		model: 'gpt-4o-mini'
	})

	return json(chatCompletion)
}
