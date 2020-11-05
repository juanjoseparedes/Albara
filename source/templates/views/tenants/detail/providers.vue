<div>
	<div class="app-tabs-tool-bar">
		<div v-on:click="$refs.providers.add()"><i class="fas fa-plus"></i><span>Agregar Proveedor</span></div>
		<div v-on:click="$refs.providers.refresh(true)"><i class="fas fa-sync"></i><span>Refrescar</span></div>
		<!--<div v-on:click="listType = 'table'" v-bind:class="{active: listType === 'table'}"><i class="fas fa-th-list"></i></div>
		<div v-on:click="listType = 'widget'" v-bind:class="{active: listType === 'widget'}"><i class="fas fa-table"></i></div>-->
	</div>

	<list-providers ref="providers" :list-type="listType" :tenant="$route.params.tenantId"></list-providers>
</div>