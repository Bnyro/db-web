<script lang="ts">
	import { getLocations, getJourneys } from '$lib/db';
	import Journey from '../components/journey.svelte';

	enum Direction {
		Start,
		End
	}

	let currentTextField: Direction = Direction.Start;

	let startLocationStr = '';
	let startLocation: any = null;
	let endLocationStr = '';
	let endLocation: any = null;

	let locationResults: any[] = [];
	let journeyResults: any[] = [];

	function findLocations(query: string) {
		getLocations(query).then((locations: any[]) => {
			locationResults = locations;
		});
	}

	function findJourneys() {
		if (!startLocation || !endLocation) return;

		getJourneys(startLocation, endLocation).then((resp: any) => {
			journeyResults = resp.journeys;
			console.log(journeyResults);
		});
	}
</script>

<h1>DB-Web</h1>
<input
	type="text"
	bind:value={startLocationStr}
	placeholder="Start"
	on:change={() => {
		currentTextField = Direction.Start;
		findLocations(startLocationStr);
	}}
/>
<input
	type="text"
	bind:value={endLocationStr}
	placeholder="End"
	on:change={() => {
		currentTextField = Direction.End;
		findLocations(endLocationStr);
	}}
/>
<button on:click={findJourneys}>Search</button>

{#each locationResults as location}
	<div
		class="cursor-pointer"
		on:click={() => {
			if (currentTextField == Direction.Start) {
				startLocationStr = location.name ?? location.address;
				startLocation = location;
			} else {
				endLocationStr = location.name ?? location.address;
				endLocation = location;
			}
			locationResults = [];
		}}
	>
		<span>{location.name ?? location.address}</span>
		<hr />
	</div>
{/each}

{#each journeyResults as journeyResult}
	<Journey journey={journeyResult} />
{/each}
