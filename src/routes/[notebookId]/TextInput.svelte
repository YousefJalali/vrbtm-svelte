<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	let text = ''
	let uploadingImage = false

	const dispatch = createEventDispatcher()

	function onOmit() {
		dispatch('omit', { text })
		text = ''
	}

	let files: FileList | null

	$: if (files) {
		uploadFile(files[0])
		// for (const file of files) {
		// 	console.log(file)
		// }
		// files = null
	}

	async function uploadFile(file: File) {
		try {
			uploadingImage = true

			let base64 = await toBase64(file)

			let res = await readImage(base64)

			const msg = res.choices[0].message

			if (msg.refusal) {
				uploadingImage = false
				console.log(msg.refusal)
				return
			}

			let txt
			if (msg.parsed) {
				txt = msg.parsed
			} else {
				txt = JSON.parse(msg.content).text
			}

			text = txt

			files = null
			uploadingImage = false
		} catch (error) {
			uploadingImage = false
			console.log('upload', error)
		}
	}

	const toBase64 = (file: File) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
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
</script>

<div
	class="relative border-[1.5px] focus-within:border-primary p-2 lg:p-3 lg:m-0 rounded-box overflow-hidden"
>
	{#if uploadingImage}
		<div class="absolute inset-0 bg-base-100 flex justify-center items-center">
			Reading Image...
		</div>
	{/if}

	<textarea
		style="field-sizing: content;"
		class="m-0 p-1 w-full h-fit max-h-[calc(100vh*0.2)] resize-none active:outline-none focus:outline-none focus:ring-0"
		bind:value={text}
		placeholder="Add Text..."
	></textarea>

	<div class="divider my-0 p-0"></div>

	<div class="flex justify-between items-center mt-1">
		<label for="image-input" class="btn btn-sm btn-ghost w-fit">
			<input class="hidden" id="image-input" bind:files type="file" accept="image/*" />
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
				/>
			</svg>

			Image</label
		>
		<button class="btn btn-sm btn-primary w-fit" on:click={onOmit}>Omit</button>
	</div>
</div>
