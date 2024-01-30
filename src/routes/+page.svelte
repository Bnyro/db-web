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
	let latestLocationRequest: string = '';
	let skipNextLocationChange = false;

	function findLocations(query: string, currentDir: Direction) {
		if (query.length < 3) {
			locationResults = [];
			return;
		}

		if (skipNextLocationChange) {
			skipNextLocationChange = false;
			return;
		}

		currentTextField = currentDir;
		setTimeout(() => {
			if (currentTextField != currentDir || latestLocationRequest == query) return;
			if (currentDir == Direction.Start && query != startLocationStr) return;
			if (currentDir == Direction.End && query != endLocationStr) return;

			latestLocationRequest = query;
			getLocations(query).then((locations: any[]) => {
				locationResults = locations;
			});
		}, 300);
	}

	$: {
		findLocations(startLocationStr, Direction.Start);
		findLocations(endLocationStr, Direction.End);
	}

	function findJourneys() {
		if (!startLocation || !endLocation) return;
		locationResults = [];
		journeyResults = [];

		getJourneys({ startLocation, endLocation }).then((resp: any) => {
			journeyResults = resp.journeys;
		});
	}
</script>

<h1>DB-Web</h1>
<input type="text" bind:value={startLocationStr} placeholder="Start" />
<input type="text" bind:value={endLocationStr} placeholder="End" />
<button on:click={findJourneys}>Search</button>

{#each locationResults as location}
	<div
		class="cursor-pointer"
		on:click={() => {
			skipNextLocationChange = true;
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
