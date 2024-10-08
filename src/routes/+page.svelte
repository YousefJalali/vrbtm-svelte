<script lang="ts">
	import { goto } from '$app/navigation'
	import { notebooks } from '$lib/stores'
	import Logo from '$lib/ui/Logo.svelte'
	import { onMount } from 'svelte'

	// onMount(() => {
	// 	goto(`/n/${Object.keys($notebooks)[0]}`)
	// })
</script>

<header class="text-neutral/70 body-font border-b border-base-200">
	<div class="container mx-auto flex p-5 flex-row items-center justify-between">
		<a class="flex title-font font-medium items-center text-neutral h-10" href="/">
			<Logo />
			<!-- <span class="ml-3 text-xl">VERBATIM</span> -->
		</a>
		<nav class="hidden md:flex ml-auto flex-wrap items-center text-base justify-center">
			<a href="/login" class="link mr-6">Login</a>
		</nav>
		<a href="/n" class="btn btn-primary btn-sm"
			>Get Started
			<svg
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				class="w-4 h-4 ml-1"
				viewBox="0 0 24 24"
			>
				<path d="M5 12h14M12 5l7 7-7 7"></path>
			</svg>
		</a>
	</div>
</header>

<section class="text-neutral/70 body-font">
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
		<div
			class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
		>
			<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-neutral">
				Before they sold out
				<br class="hidden lg:inline-block" />readymade gluten
			</h1>
			<p class="mb-8 leading-relaxed">
				Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos
				poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic
				tumeric truffaut hexagon try-hard chambray.
			</p>
			<div class="flex justify-center">
				<a href="/n" class="btn btn-primary">Get Started</a>
				<button class="ml-4 btn">Learn More</button>
			</div>
		</div>
		<div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
			<img
				class="object-cover object-center rounded"
				alt="hero"
				src="https://dummyimage.com/720x600/edf2f7/a5afbd"
			/>
		</div>
	</div>
</section>

<section class="text-neutral/70 body-font border-t border-base-200">
	<div class="container px-5 py-24 mx-auto">
		<div class="flex flex-col text-center w-full mb-20">
			<h2 class="text-xs text-primary tracking-widest font-medium title-font mb-1">
				BOOST YOUR LEARNING
			</h2>
			<h1 class="sm:text-3xl text-2xl font-medium title-font text-neutral">
				AI-Powered Memorization for Students
			</h1>
		</div>
		<div class="flex flex-wrap -m-4">
			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-base-200/30 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-primary text-white flex-shrink-0"
						>
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-5 h-5"
								viewBox="0 0 24 24"
							>
								<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
							</svg>
						</div>
						<h2 class="text-neutral text-lg title-font font-medium">Flashcards</h2>
					</div>
					<div class="flex-grow">
						<p class="leading-relaxed text-base">
							Effortlessly create custom flashcards to review key concepts and definitions, ensuring
							retention through active recall.
						</p>
						<a href={null} class="mt-3 text-primary inline-flex items-center"
							>Learn More
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 ml-2"
								viewBox="0 0 24 24"
							>
								<path d="M5 12h14M12 5l7 7-7 7"></path>
							</svg>
						</a>
					</div>
				</div>
			</div>
			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-base-200/30 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-primary text-white flex-shrink-0"
						>
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-5 h-5"
								viewBox="0 0 24 24"
							>
								<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</svg>
						</div>
						<h2 class="text-neutral text-lg title-font font-medium">Notebooks</h2>
					</div>
					<div class="flex-grow">
						<p class="leading-relaxed text-base">
							Organize your study materials and notes in personalized AI-generated notebooks,
							designed to help you study smarter.
						</p>
						<a href={null} class="mt-3 text-primary inline-flex items-center"
							>Learn More
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 ml-2"
								viewBox="0 0 24 24"
							>
								<path d="M5 12h14M12 5l7 7-7 7"></path>
							</svg>
						</a>
					</div>
				</div>
			</div>
			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-base-200/30 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-primary text-white flex-shrink-0"
						>
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-5 h-5"
								viewBox="0 0 24 24"
							>
								<circle cx="6" cy="6" r="3"></circle>
								<circle cx="6" cy="18" r="3"></circle>
								<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
							</svg>
						</div>
						<h2 class="text-neutral text-lg title-font font-medium">Quizzes</h2>
					</div>
					<div class="flex-grow">
						<p class="leading-relaxed text-base">
							Test your knowledge with personalized quizzes that challenge your understanding and
							help reinforce memory retention.
						</p>
						<a href={null} class="mt-3 text-primary inline-flex items-center"
							>Learn More
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								class="w-4 h-4 ml-2"
								viewBox="0 0 24 24"
							>
								<path d="M5 12h14M12 5l7 7-7 7"></path>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="text-neutral/70 body-font border-t border-base-200">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
		<div class="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
			<img
				alt="feature"
				class="object-cover object-center h-full w-full"
				src="https://dummyimage.com/600x600/edf2f7/a5afbd"
			/>
		</div>
		<div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
			<div class="flex flex-col mb-10 lg:items-start items-center">
				<div
					class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-5"
				>
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						class="w-6 h-6"
						viewBox="0 0 24 24"
					>
						<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
					</svg>
				</div>
				<div class="flex-grow">
					<h2 class="text-neutral text-lg title-font font-medium mb-3">AI-Powered Learning</h2>
					<p class="leading-relaxed text-base">
						Verbatim helps students boost memory retention by using AI to create personalized study
						material like flashcards and quizzes.
					</p>
					<a href={null} class="mt-3 text-primary inline-flex items-center"
						>Learn More
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-4 h-4 ml-2"
							viewBox="0 0 24 24"
						>
							<path d="M5 12h14M12 5l7 7-7 7"></path>
						</svg>
					</a>
				</div>
			</div>
			<div class="flex flex-col mb-10 lg:items-start items-center">
				<div
					class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-5"
				>
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						class="w-6 h-6"
						viewBox="0 0 24 24"
					>
						<circle cx="6" cy="6" r="3"></circle>
						<circle cx="6" cy="18" r="3"></circle>
						<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
					</svg>
				</div>
				<div class="flex-grow">
					<h2 class="text-neutral text-lg title-font font-medium mb-3">Custom Flashcards</h2>
					<p class="leading-relaxed text-base">
						Automatically generate flashcards from your study material to focus on key concepts and
						reinforce learning efficiently.
					</p>
					<a href={null} class="mt-3 text-primary inline-flex items-center"
						>Learn More
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-4 h-4 ml-2"
							viewBox="0 0 24 24"
						>
							<path d="M5 12h14M12 5l7 7-7 7"></path>
						</svg>
					</a>
				</div>
			</div>
			<div class="flex flex-col mb-10 lg:items-start items-center">
				<div
					class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-5"
				>
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						class="w-6 h-6"
						viewBox="0 0 24 24"
					>
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
				</div>
				<div class="flex-grow">
					<h2 class="text-neutral text-lg title-font font-medium mb-3">Interactive Quizzes</h2>
					<p class="leading-relaxed text-base">
						Challenge yourself with quizzes generated from your study content to test your knowledge
						and track progress.
					</p>
					<a href={null} class="mt-3 text-primary inline-flex items-center"
						>Learn More
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-4 h-4 ml-2"
							viewBox="0 0 24 24"
						>
							<path d="M5 12h14M12 5l7 7-7 7"></path>
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="text-neutral/70 body-font border-t border-base-200">
	<div class="container px-5 py-24 mx-auto">
		<div class="flex flex-wrap w-full mb-20 flex-col items-center text-center">
			<h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-neutral">
				Verbatim: Your AI-Powered Study Companion
			</h1>
			<p class="lg:w-1/2 w-full leading-relaxed text-base">
				Master your subjects with Verbatim's intelligent study tools, designed to help you memorize
				faster, create personalized flashcards, quizzes, and organize your notes effortlessly.
			</p>
		</div>
		<div class="flex flex-wrap -m-4">
			<div class="xl:w-1/3 md:w-1/2 p-4">
				<div class="border border-gray-300 p-6 rounded-lg">
					<div
						class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-4"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-6 h-6"
							viewBox="0 0 24 24"
						>
							<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
						</svg>
					</div>
					<h2 class="text-lg text-neutral font-medium title-font mb-2">Smart Flashcards</h2>
					<p class="leading-relaxed text-base">
						Generate flashcards instantly to reinforce key concepts and study more effectively.
					</p>
				</div>
			</div>
			<div class="xl:w-1/3 md:w-1/2 p-4">
				<div class="border border-gray-300 p-6 rounded-lg">
					<div
						class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-4"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-6 h-6"
							viewBox="0 0 24 24"
						>
							<circle cx="6" cy="6" r="3"></circle>
							<circle cx="6" cy="18" r="3"></circle>
							<path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
						</svg>
					</div>
					<h2 class="text-lg text-neutral font-medium title-font mb-2">Customized Quizzes</h2>
					<p class="leading-relaxed text-base">
						Test your knowledge with quizzes tailored to your specific study material and track your
						progress.
					</p>
				</div>
			</div>
			<div class="xl:w-1/3 md:w-1/2 p-4">
				<div class="border border-gray-300 p-6 rounded-lg">
					<div
						class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-4"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-6 h-6"
							viewBox="0 0 24 24"
						>
							<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</div>
					<h2 class="text-lg text-neutral font-medium title-font mb-2">Personalized Notebooks</h2>
					<p class="leading-relaxed text-base">
						Organize your study notes seamlessly and keep everything you need in one place.
					</p>
				</div>
			</div>
			<div class="xl:w-1/3 md:w-1/2 p-4">
				<div class="border border-gray-300 p-6 rounded-lg">
					<div
						class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-4"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-6 h-6"
							viewBox="0 0 24 24"
						>
							<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path>
						</svg>
					</div>
					<h2 class="text-lg text-neutral font-medium title-font mb-2">Efficient Memorization</h2>
					<p class="leading-relaxed text-base">
						Leverage AI-powered techniques to omit and repeat key concepts, helping you memorize
						faster.
					</p>
				</div>
			</div>
			<div class="xl:w-1/3 md:w-1/2 p-4">
				<div class="border border-gray-300 p-6 rounded-lg">
					<div
						class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-4"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-6 h-6"
							viewBox="0 0 24 24"
						>
							<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
						</svg>
					</div>
					<h2 class="text-lg text-neutral font-medium title-font mb-2">Interactive Learning</h2>
					<p class="leading-relaxed text-base">
						Engage with your study material through interactive features designed to make learning
						enjoyable.
					</p>
				</div>
			</div>
			<div class="xl:w-1/3 md:w-1/2 p-4">
				<div class="border border-gray-300 p-6 rounded-lg">
					<div
						class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-primary mb-4"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-6 h-6"
							viewBox="0 0 24 24"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
						</svg>
					</div>
					<h2 class="text-lg text-neutral font-medium title-font mb-2">
						Comprehensive Study Tools
					</h2>
					<p class="leading-relaxed text-base">
						Access a full suite of study tools that adapt to your learning style and needs.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Pricing -->
<!-- <section class="text-neutral/70 body-font overflow-hidden border-t border-base-200">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
		<div class="lg:w-1/4 mt-48 hidden lg:block">
			<div
				class="mt-px border-t border-gray-300 border-b border-l rounded-tl-lg rounded-bl-lg overflow-hidden"
			>
				<p
					class="bg-base-200/30 text-neutral h-12 text-center px-4 flex items-center justify-start -mt-px"
				>
					Fingerstache disrupt
				</p>
				<p class="text-neutral h-12 text-center px-4 flex items-center justify-start">
					Franzen hashtag
				</p>
				<p class="bg-base-200/30 text-neutral h-12 text-center px-4 flex items-center justify-start">
					Tilde art party
				</p>
				<p class="text-neutral h-12 text-center px-4 flex items-center justify-start">
					Banh mi cornhole
				</p>
				<p class="bg-base-200/30 text-neutral h-12 text-center px-4 flex items-center justify-start">
					Waistcoat squid hexagon
				</p>
				<p class="text-neutral h-12 text-center px-4 flex items-center justify-start">
					Pinterest occupy authentic
				</p>
				<p class="bg-base-200/30 text-neutral h-12 text-center px-4 flex items-center justify-start">
					Brooklyn helvetica
				</p>
				<p class="text-neutral h-12 text-center px-4 flex items-center justify-start">
					Long Feature Two
				</p>
				<p class="bg-base-200/30 text-neutral h-12 text-center px-4 flex items-center justify-start">
					Feature One
				</p>
			</div>
		</div>
		<div class="flex lg:w-3/4 w-full flex-wrap lg:border border-gray-300 rounded-lg">
			<div
				class="lg:w-1/3 lg:mt-px w-full mb-10 lg:mb-0 border-2 border-gray-300 lg:border-none rounded-lg lg:rounded-none"
			>
				<div class="px-2 text-center h-48 flex flex-col items-center justify-center">
					<h3 class="tracking-widest">START</h3>
					<h2 class="text-5xl text-neutral font-medium leading-none mb-4 mt-2">Free</h2>
					<span class="text-sm text-gray-600">Next 3 months</span>
				</div>
				<p
					class="bg-base-200/30 text-gray-600 h-12 text-center px-2 flex items-center -mt-px justify-center border-t border-gray-300"
				>
					Schlitz single-origin
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p
					class="h-12 text-gray-600 px-6 text-center leading-relaxed flex items-center justify-center"
				>
					Feature
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<div class="border-t border-gray-300 p-6 text-center rounded-bl-lg">
					<button
						class="flex items-center mt-auto text-white bg-primary border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded"
						>Button
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-4 h-4 ml-auto"
							viewBox="0 0 24 24"
						>
							<path d="M5 12h14M12 5l7 7-7 7"></path>
						</svg>
					</button>
					<p class="text-xs text-neutral/40 mt-3">
						Literally you probably haven't heard of them jean shorts.
					</p>
				</div>
			</div>
			<div
				class="lg:w-1/3 lg:-mt-px w-full mb-10 lg:mb-0 border-2 rounded-lg border-primary relative"
			>
				<span
					class="bg-primary text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl"
					>POPULAR</span
				>
				<div class="px-2 text-center h-48 flex flex-col items-center justify-center">
					<h3 class="tracking-widest">PRO</h3>
					<h2
						class="text-5xl text-neutral font-medium flex items-center justify-center leading-none mb-4 mt-2"
					>
						$38
						<span class="text-gray-600 text-base ml-1">/mo</span>
					</h2>
					<span class="text-sm text-gray-600">Charging $456 per year</span>
				</div>
				<p
					class="bg-base-200/30 text-gray-600 h-12 text-center px-2 flex items-center -mt-px justify-center border-t border-gray-300"
				>
					Schlitz single-origin
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="h-12 text-gray-600 text-center leading-relaxed flex items-center justify-center">
					Feature
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<div class="p-6 text-center border-t border-gray-300">
					<button
						class="flex items-center mt-auto text-white bg-primary border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded"
						>Button
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-4 h-4 ml-auto"
							viewBox="0 0 24 24"
						>
							<path d="M5 12h14M12 5l7 7-7 7"></path>
						</svg>
					</button>
					<p class="text-xs text-neutral/40 mt-3">
						Literally you probably haven't heard of them jean shorts.
					</p>
				</div>
			</div>
			<div
				class="lg:w-1/3 w-full lg:mt-px border-2 border-gray-300 lg:border-none rounded-lg lg:rounded-none"
			>
				<div class="px-2 text-center h-48 flex flex-col items-center justify-center">
					<h3 class="tracking-widest">BUSINESS</h3>
					<h2
						class="text-5xl text-neutral font-medium flex items-center justify-center leading-none mb-4 mt-2"
					>
						$54
						<span class="text-gray-600 text-base ml-1">/mo</span>
					</h2>
					<span class="text-sm text-gray-600">Charging $648 per year</span>
				</div>
				<p
					class="bg-base-200/30 text-gray-600 h-12 text-center px-2 flex items-center -mt-px justify-center border-t border-gray-300"
				>
					Schlitz single-origin
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="h-12 text-gray-600 text-center leading-relaxed flex items-center justify-center">
					Feature
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<span
						class="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							class="w-3 h-3"
							viewBox="0 0 24 24"
						>
							<path d="M20 6L9 17l-5-5"></path>
						</svg>
					</span>
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<p class="bg-base-200/30 text-gray-600 text-center h-12 flex items-center justify-center">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.2"
						class="w-5 h-5 text-neutral/40"
						viewBox="0 0 24 24"
					>
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</p>
				<div class="p-6 text-center border-t border-gray-300">
					<button
						class="flex items-center mt-auto text-white bg-primary border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded"
						>Button
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							class="w-4 h-4 ml-auto"
							viewBox="0 0 24 24"
						>
							<path d="M5 12h14M12 5l7 7-7 7"></path>
						</svg>
					</button>
					<p class="text-xs text-neutral/40 mt-3">
						Literally you probably haven't heard of them jean shorts.
					</p>
				</div>
			</div>
		</div>
	</div>
</section> -->

<!-- Testimonial -->
<section class="text-neutral/70 body-font border-t border-base-200">
	<div class="container px-5 py-24 mx-auto">
		<div class="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				class="inline-block w-8 h-8 text-neutral/30 mb-8"
				viewBox="0 0 975.036 975.036"
			>
				<path
					d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"
				></path>
			</svg>
			<p class="leading-relaxed text-lg">
				Verbatim has completely transformed the way I study. The AI-driven flashcards, quizzes, and
				notebooks make reviewing material faster and more efficient. I especially love how it
				personalizes the quizzes to focus on areas I struggle with the most. My retention and
				understanding have improved drastically since using this app. It's like having a personal
				tutor available at all times!
			</p>
			<span class="inline-block h-1 w-10 rounded bg-primary mt-8 mb-6"></span>
			<h2 class="text-neutral font-medium title-font tracking-wider text-sm">JANE DOE</h2>
			<p class="text-neutral/40">University Student</p>
		</div>
	</div>
</section>

<footer class="text-neutral/70 body-font">
	<div class="border-t border-base-200">
		<div class="container px-5 py-8 flex flex-wrap mx-auto items-center">
			<div class="flex md:flex-no-wrap flex-wrap justify-center md:justify-start">
				<input class="input input-bordered mr-2" placeholder="Enter your email" type="text" />
				<button class="btn btn-primary">Subscribe</button>
				<!-- <p class="text-neutral/40 text-sm md:ml-6 md:mt-0 mt-2 sm:text-left text-center">
					Boost your learning with AI-powered tools.
					<br class="lg:block hidden" />Flashcards, quizzes, and study notebooks in one app.
				</p> -->
			</div>
			<span
				class="inline-flex lg:ml-auto lg:mt-0 mt-6 w-full justify-center md:justify-start md:w-auto"
			>
				<a href={null} class="text-neutral/40">
					<svg
						fill="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						class="w-5 h-5"
						viewBox="0 0 24 24"
					>
						<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
					</svg>
				</a>
				<a href={null} class="ml-3 text-neutral/40">
					<svg
						fill="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						class="w-5 h-5"
						viewBox="0 0 24 24"
					>
						<path
							d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
						></path>
					</svg>
				</a>
				<a href={null} class="ml-3 text-neutral/40">
					<svg
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						class="w-5 h-5"
						viewBox="0 0 24 24"
					>
						<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
						<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
					</svg>
				</a>
				<a href={null} class="ml-3 text-neutral/40">
					<svg
						fill="currentColor"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="0"
						class="w-5 h-5"
						viewBox="0 0 24 24"
					>
						<path
							stroke="none"
							d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
						></path>
						<circle cx="4" cy="4" r="2" stroke="none"></circle>
					</svg>
				</a>
			</span>
		</div>
	</div>
	<div class="bg-gray-200">
		<div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
			<p class="text-neutral/40 text-sm text-center sm:text-left">
				© 2024 Verbatim — Empowering students with AI
			</p>
			<span
				class="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-neutral/40 text-sm"
				>Study smarter, not harder.</span
			>
		</div>
	</div>
</footer>

<!-- <a
	href="https://github.com/mertJF/tailblocks"
	class="rounded-full w-12 h-12 bg-base-200/30 fixed bottom-0 right-0 flex items-center justify-center text-gray-800 mr-8 mb-8 shadow-sm border-gray-300 border"
	target="_blank"
	><svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path
			d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
		></path>
	</svg></a
> -->
