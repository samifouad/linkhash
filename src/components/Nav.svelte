<script>
import { supabase } from '../lib/supabase'
import { onMount } from 'svelte'
import MenuIcons from './MenuIcons.svelte'
import SignInGithub from './SignInGithub.svelte'
import { isLoggedIn } from '../lib/store'

let user = {
	loggedIn: false,
	name: '',
	pfp: ''
};

onMount(async () => {
	try {
		const { data, error } = await supabase.auth.getUser()

		console.log(data)

		console.log(error)

		if (data.user && data.user.role == 'authenticated') {
			user.loggedIn = true
			user.pfp = data.user.user_metadata.avatar_url
			user.name = data.user.user_metadata.user_name
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
	<MenuIcons 
		userProfileImage={ user.pfp }
		userProfilePage={ user.name }
	/>
{:else}
	<SignInGithub />
{/if}