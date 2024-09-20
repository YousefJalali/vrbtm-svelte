import OpenAI from 'openai'
import { OPENAI_API_SECRET_KEY } from '$env/static/private'
import { json, type RequestEvent } from '@sveltejs/kit'

const openai = new OpenAI({
	apiKey: OPENAI_API_SECRET_KEY
})

export const POST = async (event: RequestEvent) => {
	const requestBody = await event.request.json()
	const { message: _message } = requestBody

	// console.log({ _message })

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: `"${_message}". Find all the keywords and put them inside double backticks in place. and return the text without double quote. note: if you receive anything other than text, reply with something like Please insert a paragraph`
			}
		],
		model: 'gpt-4o-mini'
	})

	// const myAssistant = await openai.beta.assistants.create({
	//   instructions:
	//     "You are a teacher that helps students memorize texts by omitting keywords. When provided a text, find and put keywords inside double backticks in place to answer the question.",
	//   name: "Memo Teacher",
	//   tools: [{ type: "code_interpreter" }],
	//   model: 'gpt-4o-mini',
	// });

	// console.log({ myAssistant })

	return json(chatCompletion)
}

// export const POST = async (event: RequestEvent) => {
// 	const requestBody = await event.request.json()
// 	const { message: _message } = requestBody
// 	/**
// 	 * Request config
// 	 */
// 	const completionHeaders = {
// 		'Content-Type': 'application/json',
// 		Authorization: `Bearer ${OPENAI_API_SECRET_KEY}`
// 	}
// 	const messages = [
// 		{
// 			role: 'system',
// 			content: 'You are a Alfred, a most helpful and loyal fictional butler to Batman.'
// 		}
// 		// { role: 'user', content: 'Alfred, where did I leave my batmobile?' },
// 		// {
// 		// 	role: 'assistant',
// 		// 	content:
// 		// 		'Sir, you left the Batmobile in the Batcave, where it is normally parked. Shall I have it brought to you?'
// 		// }
// 	]
// 	const completionBody = {
// 		model: 'gpt-3.5-turbo',
// 		messages
// 	}
// 	/**
// 	 * API call
// 	 */
// 	console.log('called')
// 	try {
// 		const res = await fetch('https://api.openai.com/v1/chat/completions', {
// 			method: 'POST',
// 			headers: completionHeaders,
// 			body: JSON.stringify(completionBody)
// 		})

// 		if (!res.ok) {
// 			throw new Error(res.statusText)
// 		}

// 		const data = await res.json()

// 		console.log(data)

// 		const message = data?.choices?.[0]?.message?.content || ''
// 		// return Response(String(message));
// 		return json(message)
// 	} catch (error) {
// 		console.log('err2', error)
// 	}
// }
