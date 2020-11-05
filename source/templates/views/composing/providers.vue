<div class="row-col" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 48px; min-width: 48px" v-if="hideLeftPannel && (providers && providers.length > 0)">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div class="app-session" style="border: none">
				<i class="fas fa-chevron-right" v-on:click="hideLeftPannel = !hideLeftPannel"></i>
			</div>
		</div>
	</div>
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 20vw; min-width: 200px" v-if="!hideLeftPannel && (providers && providers.length > 0)">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div class="app-session">
				<span>Centros asignados a proveedor</span>
				<i class="fas fa-chevron-left" v-on:click="hideLeftPannel = !hideLeftPannel"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-select class="col-sm-12" v-on:change="selectProvider" v-model="selectedProviderId" label="Almacén / Local" :items="providers" key-bind="name" value-bind="id" show-first="true"></field-select>
					</div>
				</form>
			</div>

			<div class="app-session-container" v-if="selection.provider != null">
				<div class="list white">
					<div v-on:click="selectInstitution(institution)" class="list-item b-l b-l-2x ng-scope app-tenant-list-item" v-for="institution in selection.provider.institutions" :class="{'app-tenant-list-item-selected' : selectedInstitutionId === institution.id}">
						<div class="list-left app-list-item-icon">
							<div class="fa fa-folder"></div>
						</div>
						<div class="list-body">
							<div>
								<a class="_500 ng-binding">${enums.types[institution.type]} / <b>${institution.code}</b></a>
							</div>
							<div class="text-ellipsis text-muted text-sm ng-binding">
								<a v-on:click.stop="selectInstitution(institution)" class="app-label-link">${institution.name}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg" v-if="providers && providers.length > 0">
		<div class="app-grid-empty-container" v-if="!selection.provider">
			<div class="icon">
				<span class="fas fa-chevron-left"></span>
			</div>
			<div class="message">
				<div class="text">Sin proveedor seleccionado</div>
				<span>Seleccione un proveedor para continuar</span>
			</div>
		</div>

		<div class="app-grid-empty-container" v-if="selection.provider && selection.provider.institutions.length === 0">
			<div class="icon">
				<span class="fas fa-info-circle"></span>
			</div>
			<div class="message">
				<div class="text">Proveedor <b>${selection.provider.name}</b> no tiene centros adjudicados</div>
				<span>Favor contactar un administrador</span>
			</div>
		</div>

		<div class="app-grid-empty-container" v-if="selection.provider && selection.provider.institutions.length > 0 && selection.institution == null">
			<div class="icon">
				<span class="fas fa-chevron-left"></span>
			</div>
			<div class="message">
				<div class="text">Seleccione un centro para continuar</div>
				<span>Proveedor <b>${selection.provider.name}</b> cuenta con ${selection.provider.institutions.length === 1 ? 'un centro' : selection.provider.institutions.length + ' centros'}</span>
			</div>
		</div>

		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<router-view></router-view>
		</div>
	</div>

	<div v-if="providers && providers.length === 0" class="app-grid-empty-container">
		<div class="icon">
			<span class="fas fa-info-circle"></span>
		</div>
		<div class="message">
			<div class="text">No tiene proveedores adjudicados</div>
			<span>Favor contactar un administrador</span>
		</div>
	</div>
</div>