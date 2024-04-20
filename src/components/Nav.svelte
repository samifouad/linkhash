<script>
import { supabase } from '../lib/supabase'
import { onMount } from 'svelte'
import MenuIcon from './MenuIcon.svelte'
import SignInGithub from './SignInGithub.svelte'
import { isOpen, isLoggedIn } from '../lib/store'

let user = { loggedIn: false };

onMount(async () => {
	try {
		const { data, error } = await supabase.auth.Session()

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

// Set the store to true when the button is clicked
function openMenu() {
	//console.log('button clicked') // DEBUG
	isOpen.set(!isOpen.get());
}

if ( user.loggedIn == false ) {
	// Add an event listener to the button
	document.getElementById('menuButton').addEventListener('click', openMenu)
}

isOpen.subscribe(open => {
	if (open) {
		document.getElementById('drawerMenu').style.display = 'block';
		document.getElementById('drawerMenu').classList.add('fade-in');
		//console.log('menu open') // DEBUG
	} else {
		document.getElementById('drawerMenu').classList.remove('fade-in');
		document.getElementById('drawerMenu').style.display = 'none';
		//console.log('menu closed') // DEBUG
	}
})
</script>

<style>
	
</style>

{#if user.loggedIn}
	<MenuIcon />
{:else}
	<SignInGithub />
{/if}