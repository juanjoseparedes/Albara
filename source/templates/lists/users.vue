<div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<grid v-if="users" :source="users" :paging="20" :filter="filter" :empty-options="{label:'No existen usuarios registrados', icon:'fas fa-user', caption:'registrar nuevo', action:add}">
		<template v-slot:title v-if="showTitle === 'true'">
			Lista de Usuarios
		</template>
		<template v-slot:tools="{options}" v-if="allowSearch === 'true'">
			<field-select v-on:change="options.refresh()" v-model="filters.state" label="Estado" style="width: 130px" :items="enums.states"></field-select>
		</template>
		<template v-slot:filters="{options}" v-if="allowSearch === 'true'">
			<field-input v-on:keyup="options.refresh()" v-model="filters.search" label="Búsqueda" style="width: 300px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th>
				</th>
				<th style="width: 120px" v-if="showType == null || showType === true">
					<span v-on:click="options.sort('type')">Tipo</span>
				</th>
				<th style="width: 120px">
					<span v-on:click="options.sort('state')">Estado</span>
				</th>
				<th style="width: 130px">
					<span v-on:click="options.sort('first_name')">Nombre</span>
				</th>
				<th style="width: 130px">
					<span v-on:click="options.sort('last_name')">Apellido</span>
				</th>
				<th style="width: 130px">
					<span v-on:click="options.sort('role')">Rol</span>
				</th>
				<th>
					<span v-on:click="options.sort('email')">Correo</span>
				</th>
				<th>
				</th>
				<th>
				</th>
			</tr>
		</template>
		<template v-slot:rows="{row}">
			<tr v-on:click.stop="edit(row)" class="app-grid-selectable">
				<td class="app-grid-icon-cell">
					<i class="fas fa-user app-inline-action"></i>
				</td>
				<td v-if="showType == null || showType === true">
					${enums.alltypes[row.type]}
				</td>
				<td>
					${enums.states[row.state]}
				</td>
				<td>
					${row.first_name}
				</td>
				<td>
					${row.last_name}
				</td>
				<td>
					${enums.roles[row.role]}
				</td>
				<td>
					${row.email}
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
				<span>${item.first_name}</span>
			</div>
		</template>
	</grid>
</div>