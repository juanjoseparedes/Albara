<div class="pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
	<div class="app-session">
		<span v-if="$parent.$parent.selection.provider && $parent.$parent.selection.institution">Raciones por producto suplidos por <span style="color:mediumblue">${$parent.$parent.selection.provider.name}</span> a <span style="color:mediumblue">${$parent.$parent.selection.institution.name}</span></span>
		<span v-else>Raciones por Producto</span>
		<i class="fas fa-plus-circle" v-on:click="$refs.pivot.add()"></i>
		<i class="fas fa-table" v-on:click="showAll = !showAll"></i>
	</div>
	<div class="app-session-container">
		<pivot v-if="$parent.$parent.selection.provider" :show-all="showAll" :references="$parent.$parent.selection.provider" :provider="$route.params.providerId" :institution="$route.params.institutionId" ref="pivot"></pivot>
	</div>
</div>