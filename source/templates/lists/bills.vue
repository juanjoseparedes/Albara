<div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<grid v-if="bills" :source="bills" :paging="20" :filter="filter" :empty-options="{label:'Sin facturas registradas en ' + monthName, icon:'fas fa-file-invoice', caption:'registrar nueva', action:add}">
		<template v-slot:title v-if="showTitle === 'true'">
			Lista de Facturas
		</template>
		<template v-slot:filters="{options}" v-if="allowSearch === 'true'">
			<field-input v-on:keyup="options.refresh()" v-model="filters.search" label="Búsqueda" style="width: 300px"></field-input>
		</template>
		<template v-slot:header="{options}">
			<tr>
				<th class="app-grid-icon-cell">
				</th>
				<th>
					<span v-on:click="options.sort('dates.updated')">Modificado</span>
				</th>
				<th>
					<span v-on:click="options.sort('dates.printed')">Fecha Impresión</span>
				</th>
				<th>
					<span v-on:click="options.sort('trace.number')">NCF</span>
				</th>
				<th style="width: 130px;text-align: right; white-space: nowrap">
					<span v-on:click="options.sort('totals.excent')">Productos Excentos</span>
				</th>
				<th style="width: 90px;text-align: right">
					<span v-on:click="options.sort('totals.graven')">Gravados</span>
				</th>
				<th style="width: 90px;text-align: right">
					<span v-on:click="options.sort('totals.taxsum')">ITBIS</span>
				</th>
				<th style="width: 90px;text-align: right">
					<span v-on:click="options.sort('totals.total')">Total</span>
				</th>
				<th class="app-grid-icon-cell">
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
					<i class="fas fa-file-alt app-inline-action"></i>
				</td>
				<td>
					${row.dates.updated | date}
				</td>
				<td>
					<span v-if="row.dates.printed">${row.dates.printed | date}</span>
					<span v-else>(sin procesar)</span>
				</td>
				<td>
					<span v-if="row.trace.number === 15000000">(sin procesar)</span>
					<span v-else>B${row.trace.number}</span>
				</td>
				<td style="text-align: right">
					${row.totals.excent}
				</td>
				<td style="text-align: right">
					${row.totals.graven}
				</td>
				<td style="text-align: right">
					${row.totals.taxsum}
				</td>
				<td style="text-align: right">
					${row.totals.total}
				</td>
				<td class="app-grid-action">
					<i :disabled="row.dates.printed == null" v-on:click.stop="download(row)" class="fas fa-download"></i>
				</td>
				<td class="app-grid-action">
					<i :disabled="row.dates.printed == null" v-on:click.stop="print(row)" class="fas fa-print"></i>
				</td>
				<td class="app-grid-action">
					<i v-on:click.stop="edit(row)" class="fas fa-edit"></i>
				</td>
			</tr>
		</template>
	</grid>
</div>