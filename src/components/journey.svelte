<script lang="ts">
	export let journey: any;

	function pad(num: number, size: number) {
		let numStr = num.toString();
		while (numStr.length < size) numStr = '0' + numStr;
		return numStr;
	}

	function dateDiff(date1: String, date2: String) {
		const diff = Math.abs(new Date(date2) - new Date(date1));
		const diffAsDate = new Date(diff - 1000 * 60 * 60);
		return formatTime(diffAsDate.toISOString());
	}

	function formatTime(time: string) {
		const date = new Date(time);
		return pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
	}

	function formatDelay(delaySeconds: string) {
		if (delaySeconds === undefined) return '';

		const delayMillis = Number(delaySeconds) * 1000;
		const date = new Date(delayMillis - 1000 * 60 * 60);
		return '(+' + (date.getHours() * 60 + date.getMinutes()) + ' min)';
	}
</script>

<div>
	<div id="header">
		<span class="info-card"
			>{formatTime(journey.legs[0].departure)} {journey.legs[0].origin.name}</span
		>
		<div class="route-arrow">
			<span>
				{dateDiff(journey.legs[0].departure, journey.legs[journey.legs.length - 1].arrival)}h
			</span>
			<span class="arrow-to">&#x2192;</span>
			<span>
				{journey.legs.length - 1} changes
			</span>
		</div>
		<span class="info-card"
			>{formatTime(journey.legs[journey.legs.length - 1].arrival)}
			{journey.legs[journey.legs.length - 1].destination.name}</span
		>
	</div>
	<br />
	{#each journey.legs as route}
		<br />
		<br />
		{#if !route.walking}
			<div class="info-card">{route.line.name.replace(' ', '')} to {route.direction}</div>
			<br />
			<details>
				<summary>
					<div>
						<strong
							>{formatTime(route.departure)}
							{route.origin.name} ({route.departurePlatform})</strong
						>
						&#x2192; {route.destination.name} ({route.arrivalPlatform})
						{formatTime(route.arrival)}
					</div>
				</summary>
				<div class="stops">
					{#each route.stopovers.slice(1, route.stopovers.length - 1) as station}
						<div>
							{formatTime(station.arrival)}
							{station.stop.name}
							{formatDelay(station.arrivalDelay)}
						</div>
					{/each}
					<div>
						<strong>
							{formatTime(route.arrival)}
							{route.destination.name}
							{formatDelay(route.arrivalDelay)}
						</strong>
					</div>
				</div>
			</details>
		{:else}
			<div class="info-card">Walking ({route.distance}m)</div>
			<br />
			<div>{route.origin.name} &#x2192; {route.destination.name}</div>
		{/if}
	{/each}

	<hr />
</div>

<style>
	#header {
		display: flex;
		align-items: center;
	}

	.route-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 1rem;
	}

	.arrow-to {
		font-size: 3rem;
	}

	details > summary {
		cursor: pointer;
		list-style: none;
	}

	details summary::-webkit-details-marker {
		display: none;
	}

	.stops {
		display: flex;
		flex-direction: column;
		margin-top: 0.5rem;
		gap: 0.5rem;
	}
</style>
