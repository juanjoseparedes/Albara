<div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<grid v-if="institutions" :source="institutions" :paging="20" :filter="filter" :empty-options="{label:'Sin centros registrados', icon:'fas fa-building', caption:'registrar nuevo', action:add}">
		<template v-slot:title v-if="showTitle === 'true'">
			Lista de Centros
		</template>
		<template v-slot:filters="{options}" v-if="allowSearch === 'true'">
			<field-input v-on:keyup="options.refresh()" v-model="filters.search" label="Búsqueda" style="width: 300px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th class="app-grid-icon-cell">
				</th>
				<th style="width: 60px">
					<span v-on:click="options.sort('code')">Código</span>
				</th>
				<th style="width: 270px">
					<span style="white-space: nowrap" v-on:click="options.sort('name')">Nombre</span>
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
				<td style="white-space: nowrap">
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
					<i v-on:click.stop="remove(row)" class="fas fa-trash"></i>
				</td>
				<td class="app-grid-action">
					<i v-on:click.stop="edit(row)" class="fas fa-edit"></i>
				</td>
			</tr>
		</template>
	</grid>
</div>