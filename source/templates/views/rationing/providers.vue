<div class="row-col" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 20vw; min-width: 200px">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div class="app-session">
				<span>Centros asignados a proveedor</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-lookup class="col-sm-12" v-model="selectedProviderId" label="Proveedor" :source="{list: '/providers', item: '/providers'}" v-on:change="selectProvider">
							<template v-slot:preview="{item}">
								<b>${item.code}</b> / ${item.name}
							</template>
							<template v-slot:icon="{item}">
								<i class="fa fa-building"></i>
							</template>
							<template v-slot:title="{item}">
								<b>${item.code}</b> / ${item.name}
							</template>
							<template v-slot:caption="{item}">
								${enums.identity_types[item.identity.type]} : ${item.identity.number}
							</template>
						</field-lookup>
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
	<div class="col-lg">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<router-view></router-view>
		</div>
	</div>
</div>