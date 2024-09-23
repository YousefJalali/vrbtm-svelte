<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	let text = ''
	let uploadingImage = false
	let textareaContainer: HTMLDivElement
	let textarea: HTMLTextAreaElement

	const dispatch = createEventDispatcher()

	function onOmit() {
		dispatch('omit', { text })
		text = ''
	}

	let files: FileList | null

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

			const msg = res.choices[0].message

			console.log(msg)

			if (msg.refusal) {
				uploadingImage = false
				console.log(msg.refusal)
				return
			}

			text = msg.parsed || JSON.parse(msg.content).text

			files = null
			uploadingImage = false
		} catch (error) {
			uploadingImage = false
			console.log('upload', error)
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
	class="relative flex items-end md:grid md:grid-cols-2 md:gap-2 m-3 mt-1 md:border-[1.5px] md:focus-within:border-primary md:p-3 md:m-0 md:mx-4 md:rounded-box overflow-hidden"
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
			bind:this={textareaContainer}
			bind:innerText={textareaContainerText}
			contenteditable
			class="flex h-fit w-full opacity-0 max-h-[calc(100vh*0.2)]"
		></div>
		<textarea
			style="field-sizing: content;"
			class="absolute inset-x-2 inset-y-1 resize-none md:active:outline-none focus:outline-none md:focus:ring-0 placeholder:text-sm placeholder:leading-6"
			bind:value={text}
			bind:this={textarea}
			placeholder="Type here..."
		></textarea>
	</div>

	<div class="col-span-2 h-fit divider my-0 p-0 hidden md:flex"></div>

	<label for="image-input" class="btn btn-sm btn-ghost w-fit -order-1 md:order-none">
		<input class="hidden" id="image-input" bind:files type="file" accept="image/png, image/jpeg" />
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6 md:size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
			/>
		</svg>

		<span class="hidden md:inline-block">Photo</span>
	</label>

	<button class="btn btn-sm btn-primary w-fit justify-self-end ml-3" on:click={onOmit}>Omit</button>
</div>
