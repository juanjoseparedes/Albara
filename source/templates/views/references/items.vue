<div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="app-tabs-tool-bar">
		<div v-on:click="$parent.add($parent.selected)">
			<i class="fas fa-plus"></i><span>Agregar ${$parent.route.child.caption}</span>
		</div>
		<div v-on:click="refresh(true)"><i class="fas fa-sync"></i><span>Refrescar</span></div>
		<div v-on:click="showSearch = !showSearch" v-bind:class="{active: showSearch}"><i class="fas fa-search"></i>
		</div>
	</div>

	<grid ref="grid" v-if="$parent.selected.childs" :source="$parent.selected.childs" :paging="15" :filter="filter" :empty-options="{label:'No hay elementos en esta categoría', caption:'agregar ' + $parent.route.child.caption.toLowerCase(), action:function() {
	  $parent.add($parent.selected)
	}}">

		<template v-slot:filters="{options}" v-if="showSearch">
			<field-input v-on:keyup="options.refresh()" v-model="filters.search" label="Búsqueda" style="width: 310px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th class="app-grid-action">
				</th>
				<th>
					<span v-on:click="options.sort('name')">Nombre</span>
				</th>
				<th v-if="$parent.selected.meta" v-for="meta in $parent.selected.meta">
					${meta.label}
				</th>
				<th class="app-grid-action">
				</th>
				<th class="app-grid-action">
				</th>
			</tr>
		</template>
		<template v-slot:rows="{row}">
			<tr v-on:click.stop="$parent.stepdown($parent.selected, row)" class="app-grid-selectable">
				<td class="app-grid-icon-cell">
					<i class="fas fa-chevron-right app-inline-action"></i>
				</td>
				<td>
					${row.name}
				</td>
				<td v-if="$parent.selected.meta" v-for="(meta, key) in $parent.selected.meta">
					${row.meta && row.meta[key] ? row.meta[key].value : ''}
				</td>
				<td class="app-grid-action" v-on:click.stop="$parent.remove(row, true)">
					<i class="fas fa-trash"></i>
				</td>
				<td class="app-grid-action" v-on:click.stop="$parent.edit(row)">
					<i class="fas fa-edit"></i>
				</td>
			</tr>
		</template>
	</grid>
</div>