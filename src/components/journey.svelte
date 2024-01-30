<script lang="ts">
	export let journey: any;
</script>

<div>
	{#each journey.legs as route}
		<div>{route.plannedDeparture}: {route.origin.name} -> {route.destination.name}</div>
	{/each}

	<hr />
</div>
