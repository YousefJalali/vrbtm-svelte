<script lang="ts">
	import { alerts } from '$lib/stores/alerts'
	import { Svg } from '$lib/ui'
	import { getErrorMessage } from '$lib/utils'
	import { createEventDispatcher } from 'svelte'

	export const setText = (txt: string) => (text = txt)

	let text = ''
	let uploadingImage = false
	let files: FileList | null

	const dispatch = createEventDispatcher()

	function onOmit() {
		dispatch('omit', { text })

		text = ''
	}

	$: if (files) {
		const file = files[0]
		const fileMb = file.size / 1024 ** 2

		if (fileMb >= 2) {
			alert('select a file less tan 2 MB')
		} else if (file.type.includes('image')) {
			uploadFile(file)
		}
	}

	async function uploadFile(file: File) {
		uploadingImage = true
		try {
			let base64 = await toBase64(file)

			let res = await readImage(base64)

			// if error
			if (res.message || res.choices[0].message.refusal) throw Error(res.message)

			const msg = res.choices[0].message

			text = msg.parsed || JSON.parse(msg.content).text

			files = null

			uploadingImage = false
		} catch (error) {
			uploadingImage = false

			alerts.add({
				type: 'error',
				message: getErrorMessage(error)
			})
		}
	}

	const toBase64 = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					resolve(reader.result)
				}
			}
			reader.onerror = reject
		})

	async function readImage(base64: string) {
		try {
			const res = await fetch('/api/notebook/omit/image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					base64
				})
			})

			const data = await res.json()

			return data
		} catch (error) {
			console.log('err', error)
			return 'something went wrong'
		}
	}

	$: textareaContainerText = text + '\n'
</script>

<div
	class="p-3 md:m-4 md:mt-2 md:bg-base-200/40 relative flex items-end md:grid md:grid-cols-2 md:gap-2 md:border-[1.5px] md:focus-within:border-primary md:rounded-box overflow-hidden"
>
	{#if uploadingImage}
		<div class="absolute inset-0 bg-base-100 flex justify-center items-center z-20">
			<span class="loading mr-2"></span>
			Extracting text from photo...
		</div>
	{/if}

	<div
		class="col-span-2 relative h-full w-full p-1 px-2 border md:border-none rounded-box overflow-hidden focus-within:border-primary"
	>
		<div
			bind:innerText={textareaContainerText}
			contenteditable
			class="flex h-fit w-full opacity-0 max-h-[calc(100vh*0.2)]"
		></div>
		<textarea
			style="field-sizing: content;"
			class="absolute bg-transparent inset-x-2 inset-y-1 resize-none md:active:outline-none focus:outline-none md:focus:ring-0 placeholder:text-sm placeholder:leading-6"
			bind:value={text}
			placeholder="Type here..."
		></textarea>
	</div>

	<div class="col-span-2 h-fit divider my-0 p-0 hidden md:flex"></div>

	<label for="image-input" class="btn btn-sm btn-ghost w-fit -order-1 md:order-none">
		<input class="hidden" id="image-input" bind:files type="file" accept="image/png, image/jpeg" />
		<Svg icon="photo" classes="md:size-5" />

		<span class="hidden md:inline-block">Photo</span>
	</label>

	<button class="btn btn-sm btn-primary w-fit justify-self-end ml-3" on:click={onOmit}>Omit</button>
</div>
