<div class="row-col" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 30vw; min-width: 400px">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div class="app-session">
				<span>Detalle del Proveedor</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-input class="col-sm-12" v-model="provider.name" label="Nombre Legal"></field-input>
					</div>
					<div class="row">
						<field-select class="col-sm-4" v-model="provider.identity.type" label="Tipo Documento" :items="enums.identity_types" show-first="true"></field-select>
						<field-input class="col-sm-4" v-model="provider.identity.number" :label="provider.identity.type ? enums.identity_types[provider.identity.type] : 'Número Documento'"></field-input>
						<field-input class="col-sm-4" v-model="provider.code" label="Código"></field-input>
					</div>
					<div class="row">
						<field-input class="col-sm-6" v-model="provider.email" type="email" label="Correo Institucional"></field-input>
						<field-input class="col-sm-6" v-model="provider.phone" label="Teléfono"></field-input>
					</div>
					<div class="row">
						<field-image ref="logo" :url="provider.id ? 'api/storage/providers/' + provider.id + '/logo/image' : null" height="130px" class="col-sm-12" v-model="provider.images.logo" label="Logotipo"></field-image>
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
						<field-input class="col-sm-6" v-model="provider.administrator.first_name" label="Nombre"></field-input>
						<field-input class="col-sm-6" v-model="provider.administrator.last_name" label="Apellido"></field-input>
					</div>
					<div class="row">
						<field-input class="col-sm-6" v-model="provider.administrator.email" type="email" label="Correo"></field-input>
						<field-input class="col-sm-6" v-model="provider.administrator.phone" label="Teléfono / Celular"></field-input>
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
						<field-categories class="col-sm-12" v-model="provider.location" label="Regional / Municipio / Ciudad" type="region" single="true" direction="up"></field-categories>
					</div>
					<div class="row">
						<field-input class="col-sm-12" v-model="provider.address" label="Dirección" rows="2" type="area"></field-input>
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
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div>
				<div class="b-b b-primary nav-active-primary hidden-md-down app-tabs-container">
					<ul class="nav nav-tabs">
						<li class="nav-item">
							<a class="active nav-link">Centros</a>
						</li>
					</ul>
				</div>
				<div class="tab-content m-b-md app-tab-content">
					<div class="app-tabs-tool-bar">
						<div v-on:click="addInstitution()">
							<i class="fas fa-plus"></i><span>Asociar Centro</span>
						</div>
					</div>
					<div>
						<grid v-if="institutions != null" :source="institutions" :paging="32" show-paging="false" :empty-options="{label:'Sin centros asociadas', caption:'asociar nuevo', action:addInstitution}">
							<template v-slot:header="{options}">
								<tr>
									<th class="app-grid-icon-cell">
									</th>
									<th style="width: 60px">
										<span v-on:click="options.sort('code')">Código</span>
									</th>
									<th style="width: 270px">
										<span v-on:click="options.sort('name')">Nombre</span>
									</th>
									<th style="width: 90px">
										<span v-on:click="options.sort('type')">Jornada</span>
									</th>
									<th style="width: 110px">
										<span v-on:click="options.sort('identity')">RNC</span>
									</th>
									<th>
										<span>Modalidades</span>
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
										${row.code}
									</td>
									<td>
										${row.name}
									</td>
									<td>
										${enums.types[row.type]}
									</td>
									<td>
										${row.identity.number}
									</td>
									<td class="app-grid-chips">
										<span style="color:black" v-for="category in row.categories" class="app-chip">${category.name}</span>
									</td>
									<td class="app-grid-action">
										<i v-on:click="removeInstitution(row)" class="fas fa-trash"></i>
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