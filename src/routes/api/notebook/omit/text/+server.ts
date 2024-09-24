import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import { error } from '@sveltejs/kit'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

const TextOmit = z.object({
	text: z.string()
})

export const POST = async (event: RequestEvent) => {
	try {
		const requestBody = await event.request.json()
		const { text } = requestBody

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'user',
					content: `"${text}". Find all the keywords and put them inside double backticks in place. and return the text without double quote. note: if you receive anything other than text, reply with something like Please insert a paragraph`
				}
			],
			response_format: zodResponseFormat(TextOmit, 'text_omit')
		})

		// throw Error('no way')

		return json(response)
	} catch (err) {
		console.log('api/omit/text', err)
		error(500, {
			message: 'Something went wrong!'
		})
	}
}
