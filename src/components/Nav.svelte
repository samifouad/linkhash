<script>
import { supabase } from '../lib/supabase'
import { onMount } from 'svelte'
import MenuIcon from './MenuIcon.svelte'
import SignInGithub from './SignInGithub.svelte'
import { isLoggedIn } from '../lib/store'

let user = { loggedIn: false };

onMount(async () => {
	try {
		const { data, error } = await supabase.auth.getUser()

		console.log(data)

		console.log(error)

		if (data.user && data.user.role == 'authenticated') {
			user.loggedIn = true
		} else {
			user.loggedIn = false
		}
	} catch (e) {
		// user logged out
		// don't need special handling here
	}
});
</script>

<style>
	
</style>

{#if user.loggedIn}
	<MenuIcon />
{:else}
	<SignInGithub />
{/if}