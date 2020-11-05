<div class="padding" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<grid v-if="tenants" :source="tenants" :paging="14" :filter="filter" :empty-options="{label:'No hay afiliados registrados', icon:'fas fa-user', caption:'crear nuevo', action:add}">
		<template v-slot:tools="{options}">
			<field-select v-on:change="options.refresh()" v-model="state" label="Estado" style="width: 120px" :items="filters.states"></field-select>
		</template>
		<template v-slot:filters="{options}">
			<field-input v-on:keyup="options.refresh()" v-model="search" label="Búsqueda" style="width: 300px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th class="app-grid-icon-cell">
				</th>
				<th style="width: 120px">
					<span v-on:click="options.sort('state')">Estado</span>
				</th>
				<th>
					<span v-on:click="options.sort('name')">Afiliado</span>
				</th>
				<th style="width: 150px">
					<span v-on:click="options.sort('identity.number')">Indentidad</span>
				</th>
				<th>
					<span v-on:click="options.sort('administrator.first_name')">Contacto</span>
				</th>
				<th class="app-grid-icon-cell">
				</th>
			</tr>
		</template>
		<template v-slot:rows="{row}">
			<tr v-on:click="$root.navigate('/tenants/'+row.id+'/detail/users')" class="app-grid-selectable">
				<td class="app-grid-icon-cell">
					<i class="fas fa-user" v-bind:style="{color:enums.states_color[row.state]}"></i>
				</td>
				<td>
					<span v-bind:style="{color:enums.states_color[row.state]}">${enums.states[row.state]}</span>
				</td>
				<td>
					${row.name} (${row.alias})
				</td>
				<td>
					${enums.identity_types[row.identity.type]} ${row.identity.number}
				</td>
				<td>
					${row.administrator.first_name} ${row.administrator.last_name}
					<a>(${row.administrator.email})</a>
				</td>
				<td class="app-grid-icon-cell">
					<i class="fas fa-chevron-right"></i>
				</td>
			</tr>
		</template>
	</grid>
</div>