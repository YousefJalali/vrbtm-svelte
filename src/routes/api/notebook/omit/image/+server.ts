import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

const TextExtraction = z.object({
	text: z.string()
})

export const POST = async (event: RequestEvent) => {
	const requestBody = await event.request.json()
	const { base64 } = requestBody

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'user',
					content: [
						{ type: 'text', text: 'Extract the text from the image' },
						{
							type: 'image_url',
							image_url: {
								url: base64
							}
						}
					]
				}
			],
			response_format: zodResponseFormat(TextExtraction, 'text_extraction')
		})

		return json(response)
	} catch (error) {
		console.log(error)
	}
}
