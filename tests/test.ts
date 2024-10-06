import { expect, test } from '@playwright/test'

test('home page has expected h1', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByTitle('New notebook')).toHaveText(
		'  Nothing here yet Insert some text to be omitted. '
	)
})
