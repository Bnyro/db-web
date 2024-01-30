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
</script>

<div>
	<div>
		Planned departure: {formatTime(journey.legs[0].departure)} from {journey.legs[0].destination
			.name}
	</div>
	<div>
		Planned arrival: {formatTime(journey.legs[journey.legs.length - 1].arrival)}
	</div>
	<div>
		Duration: {dateDiff(journey.legs[0].departure, journey.legs[journey.legs.length - 1].arrival)}
	</div>
	<div>
		Changes: {journey.legs.length - 1}
	</div>
	<br />
	{#each journey.legs as route}
		{#if !route.walking}
			<div>
				{formatTime(route.departure)}
				{route.origin.name} ({route.departurePlatform}) -> {route.destination.name} ({route.arrivalPlatform})
				{formatTime(route.arrival)}
				via {route.line.name.replace(' ', '')} to {route.direction}
			</div>
		{:else}
			Walking: {route.origin.name} -> {route.destination.name} ({route.distance}m)
		{/if}
	{/each}

	<hr />
</div>
