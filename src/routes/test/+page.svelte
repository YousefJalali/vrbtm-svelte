<script lang="ts">
	import { tick } from 'svelte'

	let scrolling = false

	let main: HTMLDivElement
	let sections: HTMLElement[] = []
	let currentSectionIndex = 0
	let lastScrollTop = 0
	let nextSection = 0
	let direction = 1

	let timeInterval: null | ReturnType<typeof setInterval> = null
	$: if (scrolling) {
		console.log('scrolling')

		let st = main.scrollTop
		if (st - lastScrollTop > Number.EPSILON) {
			console.log('down down')
			direction = 1
			incrementSectionIndex()
		} else if (st - lastScrollTop < Number.EPSILON) {
			console.log('up up')
			direction = -1
			decrementSectionIndex()
		}

		smoothScroll(main, sections[nextSection].offsetTop)

		timeInterval = setInterval(async () => {
			if (direction > 0 && main.scrollTop >= sections[nextSection].offsetTop) {
				console.log('reached bottom')
				await delay(490)
				endScroll()
			}

			if (direction < 0 && main.scrollTop <= sections[nextSection].offsetTop) {
				console.log('reached top')
				await delay(490)
				endScroll()
			}

			if (Math.abs(main.scrollHeight - (main.offsetHeight + main.scrollTop)) < 5) {
				console.log('reached doc end')
				await delay(490)
				endScroll()
			}
		}, 500)
	} else {
		if (timeInterval) {
			console.log('clear timer')
			clearInterval(timeInterval)
		}
	}

	function scrollHandler(e: UIEvent) {
		if (scrolling) return

		console.log('scrollHandler')

		scrolling = true
	}

	function delay(t: number) {
		return new Promise((resolve) => setTimeout(resolve, t))
	}

	function endScroll() {
		main.scrollTop = sections[nextSection].offsetTop
		lastScrollTop = sections[nextSection].offsetTop
		currentSectionIndex = nextSection
		scrolling = false
	}

	function smoothScroll(ele: HTMLDivElement, scrollTargetY: number) {
		let speed = 1000
		let currentTime = 0
		const scrollY = main.scrollTop
		const derivedSpeed = speed

		const time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / derivedSpeed, 0.8))

		const easeInOutCubic = (pos: number) => {
			if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3)
			return 0.5 * (Math.pow(pos - 2, 3) + 2)
		}

		function runAnimation() {
			currentTime += 1 / 60

			let p = currentTime / time
			let t = easeInOutCubic(p)

			if (p < 1) {
				requestAnimationFrame(runAnimation)

				ele.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t)
			} else {
				ele.scrollTo(0, scrollTargetY)
			}
		}

		runAnimation()
	}

	function incrementSectionIndex() {
		if (nextSection < sections.length - 1) {
			nextSection++
		}
	}
	function decrementSectionIndex() {
		if (nextSection > 0) {
			nextSection--
		}
	}
</script>

<div
	on:scroll={scrollHandler}
	bind:this={main}
	class="snap-mandatory snap-y overflow-y-scroll h-screen relative [&>section]:snap-always [&>section]:h-screen [&>section]:w-screen [&>section]:flex [&>section]:justify-center [&>section]:items-center"
	style={scrolling ? 'overflow: hidden;' : ''}
>
	<div class="fixed top-0">
		{scrolling}
		{direction}
		<button
			class="btn"
			on:click={() => {
				scrolling = false
				currentSectionIndex = 0
				sections[0].scrollIntoView({ behavior: 'instant', block: 'end' })
			}}>reset</button
		>
	</div>

	<section bind:this={sections[0]} class="bg-red-300 !h-[50vh]">1</section>
	<section bind:this={sections[1]} class="bg-yellow-300">2</section>
	<section bind:this={sections[2]} class="bg-green-300">3</section>
	<section bind:this={sections[3]} class="bg-blue-300 !h-[30vh]">4</section>
</div>
