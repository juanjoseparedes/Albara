<div class="row-col" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 30vw; min-width: 400px">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}" v-if="institution">
			<div class="app-session">
				<span>Detalle de Centro</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-input class="col-sm-12" v-model="institution.name" label="Nombre Legal"></field-input>
					</div>
					<div class="row">
						<field-select class="col-sm-4" v-model="institution.type" label="Jornada" :items="enums.types" show-first="true"></field-select>
						<field-input class="col-sm-4" v-model="institution.identity.number" label="RNC"></field-input>
						<field-input class="col-sm-4" v-model="institution.code" label="Código"></field-input>
					</div>
					<div class="row">
						<field-input class="col-sm-6" v-model="institution.email" type="email" label="Correo Institucional"></field-input>
						<field-input class="col-sm-6" v-model="institution.phone" label="Teléfono"></field-input>
					</div>
				</form>
			</div>


			<div class="app-session">
				<span>Director / Representante</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-input class="col-sm-6" v-model="institution.director.first_name" label="Nombre"></field-input>
						<field-input class="col-sm-6" v-model="institution.director.last_name" label="Apellido"></field-input>
					</div>
					<div class="row">
						<field-input class="col-sm-6" v-model="institution.director.email" type="email" label="Correo"></field-input>
						<field-input class="col-sm-6" v-model="institution.director.phone" label="Teléfono / Celular"></field-input>
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
						<field-categories class="col-sm-12" v-model="institution.location" label="Regional / Municipio / Ciudad" type="region" single="true" direction="up"></field-categories>
					</div>
					<div class="row">
						<field-input class="col-sm-12" v-model="institution.address" label="Dirección" rows="2" type="area"></field-input>
					</div>
				</form>
			</div>

			<div class="app-buttons-left">
				<button v-on:click="saveAndBack()" class="btn accent" type="button">
					<i class="fa fa-chevron-left"></i>&nbsp;&nbsp;Guardar y Volver
				</button>
			</div>
			<div class="app-buttons-right">
				<button v-on:click="save()" class="btn primary" type="button">${isNew ? 'Guardar' : 'Actualizar'}</button>
				<button v-on:click="close()" class="btn primary" type="button">Cerrar</button>
			</div>
		</div>
	</div>
	<div class="col-lg">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}" v-if="institution">
			<div>
				<div class="b-b b-primary nav-active-primary hidden-md-down app-tabs-container">
					<ul class="nav nav-tabs">
						<li class="nav-item">
							<a class="active nav-link">Modalidades</a>
						</li>
					</ul>
				</div>
				<div class="tab-content m-b-md app-tab-content">
					<div class="app-tabs-tool-bar">
						<div v-on:click="addCategory()">
							<i class="fas fa-plus"></i><span>Asociar Modalidad</span>
						</div>
					</div>
					<div>
						<grid v-if="categories != null" :source="categories" :paging="32" show-paging="false" :empty-options="{label:'Sin modalidades asociadas', caption:'asociar nueva', action:addCategory}">
							<template v-slot:header="{options}">
								<tr>
									<th class="app-grid-icon-cell">
									</th>
									<th>
										<span v-on:click="options.sort('name')">Nombre</span>
									</th>
									<th class="app-grid-icon-cell">
									</th>
								</tr>
							</template>
							<template v-slot:rows="{row}">
								<tr>
									<td class="app-grid-icon-cell">
										<i class="fa fa-dot-circle app-inline-action"></i>
									</td>
									<td>
										${row.name}
									</td>
									<td class="app-grid-action">
										<i v-on:click="removeCategory(row)" class="fas fa-trash"></i>
									</td>
								</tr>
							</template>
						</grid>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>