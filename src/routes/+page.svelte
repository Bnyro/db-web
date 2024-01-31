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

<div id="main-container">
	<h1>Find route</h1>
	<input class="address" type="text" bind:value={startLocationStr} placeholder="Start" />
	<input class="address" type="text" bind:value={endLocationStr} placeholder="End" />

	<button id="search" on:click={findJourneys}>Search</button>
	{#if locationResults}
		<div id="locations-container">
			{#each locationResults as location}
				<div
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
				</div>
				<hr />
			{/each}
		</div>
	{/if}
</div>

{#if journeyResults}
	<div id="journeys-container">
		{#each journeyResults as journeyResult}
			<Journey journey={journeyResult} />
		{/each}
	</div>
{/if}

<style>
	#main-container {
		position: relative;
		min-width: 40%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#search {
		margin-top: 1rem;
		width: min-content;
	}

	#locations-container {
		width: 100%;
		position: absolute;
		top: 14rem;
		left: 0;
		background: var(--background);
	}

	#locations-container > div {
		cursor: pointer;
		width: 100%;
	}

	.address {
		min-width: 100%;
	}

	#journeys-container {
		margin: 2rem 1rem 0rem 1rem;
	}
</style>
