<div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<grid v-if="products" :source="products" :paging="20" :filter="filter" :empty-options="{label:'Sin productos registrados', icon:'fas fa-tag', caption:'registrar nuevo', action:add}">
		<template v-slot:title v-if="showTitle === 'true'">
			Lista de Productos
		</template>
		<template v-slot:tools="{options}" v-if="allowSearch === 'true'">
			<field-select v-on:change="options.refresh()" v-model="filters.type" label="Tipo" style="width: 130px" :items="filters.types"></field-select>
		</template>
		<template v-slot:filters="{options}" v-if="allowSearch === 'true'">
			<field-input v-on:keyup="options.refresh()" v-model="filters.search" label="Búsqueda" style="width: 300px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th class="app-grid-icon-cell">
				</th>
				<th style="width: 80px">
					<span v-on:click="options.sort('code')">Código</span>
				</th>
				<th style="width: 100px">
					<span v-on:click="options.sort('type')">Tipo</span>
				</th>
				<th>
					<span v-on:click="options.sort('name')">Nombre</span>
				</th>
				<th style="width: 12%">
					<span>Unidad Venta</span>
				</th>
				<th style="width: 12%">
					<span>Clase Impositiva</span>
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
				<td>
					${enums.types[row.type]}
				</td>
				<td>
					${row.name}
				</td>
				<td>
					${row.unit.root.name} : ${row.unit.value.name}
				</td>
				<td>
					${row.vat.root.name} : ${row.vat.value.name}
				</td>
				<td class="app-grid-action">
					<i v-on:click.stop="remove(row)" class="fas fa-trash"></i>
				</td>
				<td class="app-grid-action">
					<i v-on:click.stop="edit(row)" class="fas fa-edit"></i>
				</td>
			</tr>
		</template>
		<template v-slot:widgets="{options, item}">
			<div class="app-grid-widget" style="width: 300px; height:200px; border: solid 1px #c9c9c9; padding: 10px">
				<span>${item.name}</span>
			</div>
		</template>
	</grid>
</div>