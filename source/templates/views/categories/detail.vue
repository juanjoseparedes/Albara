<div class="row-col" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 30vw; min-width: 400px">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}" v-if="category">
			<div class="app-session">
				<span>Detalle de Modalidad</span>
				<i class="fas fa-info-circle"></i>
			</div>
			<div class="app-page-form">
				<form>
					<div class="row">
						<field-input class="col-sm-8" v-model="category.name" label="Nombre"></field-input>
						<field-input class="col-sm-4" v-model="category.code" label="Código"></field-input>
					</div>
					<div class="row">
						<field-input class="col-sm-12" v-model="category.description" label="Descripción" type="area" rows="3"></field-input>
					</div>
				</form>
			</div>

			<div class="app-session">
				<span>Grupos de Productos</span>
				<i v-on:click="addGroup()" class="fas fa-plus"></i>
			</div>

			<div class="app-session-container app-page-form">
				<div class="list white">
					<div v-on:click="selectGroup(group, index)" class="list-item b-l b-l-2x ng-scope app-tenant-list-item" v-for="(group,index) in category.groups" :class="{'app-tenant-list-item-selected' : selectedGroup != null && selectedGroup === group}">
						<div class="list-left app-list-item-icon">
							<div class="fa fa-folder"></div>
						</div>
						<div class="list-body">
							<div class="pull-right text-xs">
								<i class="fa fa-edit ng-hide m-l-sm" v-on:click="editGroup(group, index)"></i>
								<i class="fa fa-trash ng-hide m-l-sm" v-on:click.stop="removeGroup(group, index)"></i>
							</div>
							<div>
								<a class="_500 ng-binding">${group.name}</a>
							</div>
							<div class="text-ellipsis text-muted text-sm ng-binding">
								<a v-on:click.stop="selectGroup(group, index)" class="app-label-link">Contiene ${group.articles.length} productos asociados</a>
							</div>
						</div>
					</div>

					<div v-on:click="addGroup()" class="list-item b-l b-l-2x ng-scope app-tenant-list-item">
						<div class="list-left app-list-item-icon">
							<div class="fa fa-plus"></div>
						</div>
						<div class="list-body">
							<a class="_500 ng-binding">Agregar Grupo</a>
							<div class="text-ellipsis text-muted text-sm ng-binding widget-subtitle">
								Crear nuevo grupo
							</div>
						</div>
					</div>
				</div>
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
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}" v-if="category">
			<div v-if="selectedGroup != null">
				<div class="b-b b-primary nav-active-primary hidden-md-down app-tabs-container">
					<ul class="nav nav-tabs">
						<li class="nav-item">
							<a class="active nav-link">${selectedGroup.name}</a>
						</li>
					</ul>
				</div>
				<div class="tab-content m-b-md app-tab-content">
					<div class="app-tabs-tool-bar">
						<div v-on:click="addArticle()">
							<i class="fas fa-plus"></i><span>Asociar Producto</span>
						</div>
					</div>
					<div>
						<grid v-if="articles != null" :source="articles" :paging="32" show-paging="false" :empty-options="{label:'Sin productos asociados', caption:'asociar nuevo', action:addArticle}">
							<template v-slot:header="{options}">
								<tr>
									<th class="app-grid-icon-cell">
									</th>
									<th>
										<span v-on:click="options.sort('name')">Producto</span>
									</th>
									<th>
										<span v-on:click="options.sort('unit.code')">Código</span>
									</th>
									<th>
										<span v-on:click="options.sort('unit.name')">Unidad</span>
									</th>
									<th>
										<span>Primaria</span>
									</th>
									<th>
										<span>Secundaria</span>
									</th>
									<th>
										<span>Mixta</span>
									</th>
									<th>
										<span v-on:click="options.sort('vat.name')">Impuesto</span>
									</th>
									<th class="app-grid-icon-cell">
									</th>
									<th class="app-grid-icon-cell">
									</th>
								</tr>
							</template>
							<template v-slot:rows="{row}">
								<tr v-on:click.stop="editArticle(getArticle(row.id))" class="app-grid-selectable">
									<td class="app-grid-icon-cell">
										<i class="fa fa-dot-circle app-inline-action"></i>
									</td>
									<td>
										${row.name}
									</td>
									<td>
										${row.code}
									</td>
									<td>
										${row.unit.root.name} / ${row.unit.value.name}
									</td>
									<td>
										RD$ ${getArticlePrice(row.id).primary}
									</td>
									<td>
										RD$ ${getArticlePrice(row.id).secundary}
									</td>
									<td>
										RD$ ${getArticlePrice(row.id).mixed}
									</td>
									<td>
										${row.vat.value.name}<span v-if="row.vat && row.vat.value.meta">&nbsp;/ ${row.vat.value.meta.vat.value}%</span>
									</td>
									<td class="app-grid-action">
										<i v-on:click.stop="removeArticle(row)" class="fas fa-trash"></i>
									</td>
									<td class="app-grid-action">
										<i v-on:click.stop="editArticle(getArticle(row.id))" class="fas fa-edit"></i>
									</td>
								</tr>
							</template>
						</grid>
					</div>
				</div>
			</div>
			<div v-else class="app-grid-empty-container">
				<div class="icon">
					<span class="fas fa-chevron-left"></span>
				</div>
				<div class="message">
					<div class="text">Seleccione un grupo de lista</div>
					<a v-on:click="addGroup()">Crear nuevo grupo</a>
				</div>
			</div>
		</div>
	</div>
</div>