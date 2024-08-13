<script lang="ts">
	import '../app.css'
</script>

<div>
	<header class="prose prose-sm lg:h-[100px] max-w-none flex items-center justify-center">
		<h1 class="py-6">VRBTM 💉</h1>
	</header>

	<div class="flex flex-col min-h-[calc(100vh-84px)] lg:min-h-[calc(100vh-100px)]">
		<slot />
	</div>
</div>
