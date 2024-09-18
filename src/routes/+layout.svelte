<script lang="ts">
	import '../app.css'
</script>

<div class="flex flex-col h-dvh max-h-screen">
	<header class="max-w-none border-b flex items-center justify-between lg:justify-center p-4">
		<label for="nav-drawer" class="btn btn-ghost btn-sm -ml-2 drawer-button md:hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
				/>
			</svg>
		</label>

		<h1 class="font-bold text-2xl lg:text-4xl">VRBTM 💉</h1>

		<label for="flashcards-drawer" class="btn btn-ghost btn-sm -mr-2 drawer-button lg:hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
				/>
			</svg>
		</label>
	</header>

	<div class="flex flex-1 h-0 pb-4 lg:p-6">
		<slot />
	</div>
</div>
