<div class="row-col">
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 30vw; min-width: 400px">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}" v-if="tenant">
			<div class="app-session">
				<span>Perfil de Cuenta</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-input class="col-sm-6" v-model="tenant.name" label="Nombre"></field-input>
						<field-input class="col-sm-6" v-model="tenant.alias" label="Alias"></field-input>
					</div>
					<div class="row">
						<field-select class="col-sm-6" v-model="tenant.identity.type" label="Tipo" :items="enums.identity_types" show-first="true"></field-select>
						<field-input class="col-sm-6" v-model="tenant.identity.number" :label="tenant.identity.type ? enums.identity_types[tenant.identity.type] : 'Número Documento'"></field-input>
					</div>
				</form>
			</div>
			<div class="app-session">
				<span>Administrador / Representante</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-input class="col-sm-4" v-model="tenant.administrator.first_name" label="Nombre"></field-input>
						<field-input class="col-sm-4" v-model="tenant.administrator.last_name" label="Apellido"></field-input>
						<field-input class="col-sm-4" v-model="tenant.administrator.phone" label="Teléfono"></field-input>
					</div>
					<div class="row">
						<field-input class="col-sm-12" v-model="tenant.administrator.email" label="Correo" type="email"></field-input>
					</div>
				</form>
			</div>

			<div class="app-session">
				<span>Localidad</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-categories class="col-sm-12" v-model="tenant.location" label="Regional / Municipio / Ciudad" type="region" single="true" direction="up"></field-categories>
					</div>
					<div class="row">
						<field-input class="col-sm-12" v-model="tenant.address" label="Dirección" rows="2" type="area"></field-input>
					</div>
				</form>
			</div>

			<div class="app-buttons-left">
				<button v-on:click="saveAndBack()" class="btn accent" type="button">
					<i class="fa fa-chevron-left"></i>&nbsp;&nbsp;Guardar y Volver
				</button>
			</div>
			<div class="app-buttons-right">
				<button v-on:click="inactivate()" class="btn danger" type="button" v-if="tenant.state === 'active'">Desactivar</button>
				<button v-on:click="activate()" class="btn accent" type="button" v-if="tenant.state !== 'active'">Activar</button>
				<button v-on:click="save()" class="btn primary" type="button">${isNew ? 'Guardar' : 'Actualizar'}</button>
				<button v-on:click="close()" class="btn primary" type="button">Cerrar</button>
			</div>
		</div>
	</div>
	<div class="col-lg">
		<div class="p-a pos-rlt">
			<div class="b-b b-primary nav-active-primary hidden-md-down app-tabs-container">
				<ul class="nav nav-tabs">
					<li class="nav-item">
						<a :class="{ active:_self.$router.currentRoute.path.endsWith('/users') }" v-on:click="$root.navigate('users')" class="nav-link">Usuarios</a>
					</li>
					<li class="nav-item">
						<a :class="{ active:_self.$router.currentRoute.path.endsWith('/providers') }" v-on:click="$root.navigate('providers')" class="nav-link">Proveedores</a>
					</li>
				</ul>
			</div>
			<div class="tab-content m-b-md app-tab-content">
				<router-view></router-view>
			</div>
		</div>
	</div>
</div>
