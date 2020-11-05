<div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<grid v-if="categories" :source="categories" :paging="20" :filter="filter" :empty-options="{label:'Sin modalidades registradas', icon:'fas fa-tags', caption:'registrar nueva', action:add}">
		<template v-slot:title v-if="showTitle === 'true'">
			Lista de Modalidades
		</template>
		<template v-slot:filters="{options}" v-if="allowSearch === 'true'">
			<field-input v-on:keyup="options.refresh()" v-model="filters.search" label="Búsqueda" style="width: 300px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th class="app-grid-icon-cell">
				</th>
				<th style="width: 60px">
					<span style="white-space: nowrap" v-on:click="options.sort('code')">Código</span>
				</th>
				<th style="width: 160px; white-space: nowrap">
					<span style="white-space: nowrap" v-on:click="options.sort('name')">Nombre</span>
				</th>
				<th>
					<span v-on:click="options.sort('name')">Grupos de Productos</span>
				</th>
				<th class="app-grid-icon-cell">
				</th>
				<th class="app-grid-icon-cell">
				</th>
			</tr>
		</template>
		<template v-slot:rows="{row}">
			<tr v-on:click.stop="edit(row)" class="app-grid-selectable">
				<td class="app-grid-icon-cell">
					<i class="fas fa-tag app-inline-action"></i>
				</td>
				<td>
					${row.code}
				</td>
				<td style="width: 160px; white-space: nowrap">
					${row.name}
				</td>
				<td class="app-grid-chips">
					<span style="color:black" v-for="group in row.groups" class="app-chip">${group.name} : ${group.articles.length}</span>
				</td>
				<td class="app-grid-action">
					<i v-on:click.stop="remove(row)" class="fas fa-trash"></i>
				</td>
				<td class="app-grid-action">
					<i v-on:click.stop="edit(row)" class="fas fa-edit"></i>
				</td>
			</tr>
		</template>
	</grid>
</div>