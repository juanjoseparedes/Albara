<div>
	<div class="app-tabs-tool-bar">
		<div v-on:click="createAdministrator()"><i class="fas fa-user-shield"></i><span>Incluir Administrador</span></div>
		<div v-on:click="$refs.users.add()"><i class="fas fa-user-plus"></i><span>Agregar Usuario</span></div>
		<div v-on:click="$refs.users.refresh(true)"><i class="fas fa-sync"></i><span>Refrescar</span></div>
	</div>

	<list-users ref="users" :tenant="$route.params.tenantId"></list-users>
</div>