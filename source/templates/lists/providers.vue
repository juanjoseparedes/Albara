<div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<grid v-if="providers" :source="providers" :paging="20" :filter="filter" :list-type="listType" :empty-options="{label:'No existen proveedores registrados', icon:'fas fa-truck', caption:'registrar nuevo', action:add}">
		<template v-slot:filters="{options}" v-if="allowSearch === 'true'">
			<field-input v-on:keyup="options.refresh()" v-model="filters.search" label="Búsqueda" style="width: 300px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th class="app-grid-action">
				</th>
				<th style="width: 220px">
					<span v-on:click="options.sort('name')">Nombre</span>
				</th>
				<th style="width: 70px">
					<span>Centros</span>
				</th>
				<th>
					<span>Modalidades</span>
				</th>
				<th class="app-grid-action">
				</th>
				<th class="app-grid-action">
				</th>
			</tr>
		</template>
		<template v-slot:rows="{row}">
			<tr v-on:click.stop="edit(row)" class="app-grid-selectable">
				<td class="app-grid-icon-cell">
					<i class="fas fa-truck"></i>
				</td>
				<td style="white-space: nowrap">
					${row.name}
				</td>
				<td>
					${row.institutions.length}
				</td>
				<td class="app-grid-chips">
					<span style="color:black" v-for="id in getCategories(row)" class="app-chip">${categories[id]}</span>
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