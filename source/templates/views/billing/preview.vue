<div class="row-col" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 48px; min-width: 48px" v-if="hideLeftPannel && (sheets && sheets.length > 0)">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div class="app-session" style="border: none">
				<i class="fas fa-chevron-right" v-on:click="hideLeftPannel = !hideLeftPannel"></i>
			</div>
		</div>
	</div>
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 20vw; min-width: 150px" v-if="!hideLeftPannel && (sheets && sheets.length > 0)">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div class="app-session">
				<span>Lista de conduces generados en ${monthName} ${year}</span>
				<i class="fas fa-chevron-left" v-on:click="hideLeftPannel = !hideLeftPannel"></i>
			</div>

			<div class="app-page-form">
				<form>
					<div class="row">
						<field-select class="col-sm-12" v-model="filters.category" label="Modalidad" :items="categories" key-bind="name" value-bind="id" show-first="true"></field-select>
					</div>
				</form>
			</div>

			<div class="app-session-container-plane">
				<label>Seleccione varios o <a class="app-link" v-on:click="checkAll()">todos</a> los conduces</label>
				<div class="list white">
					<div v-on:click.stop="checkSheet(sheet)" class="list-item b-l b-l-2x ng-scope app-tenant-list-item" v-for="sheet in filteredSheets">
						<div class="list-left app-list-item-icon">
							<div v-if="!printed" class="far" :class="[sheet.checked === true ? 'fa-check-circle' : 'fa-circle', sheet.checked === true ? 'text-primary' : 'text-black-lt']"></div>
							<div v-else class="far fa-file-alt"></div>
						</div>
						<div class="list-body">
							<div class="pull-right text-xs">
								<i class="fa fa-search ng-hide m-l-sm" v-on:click.stop="openSheet(sheet)"></i>
							</div>
							<div>
								<a class="_500 ng-binding"><b>Día ${sheet.timestamp.day < 9 ? '0' : ''}${sheet.timestamp.day}</b>: ${sheet.category.name}</a>
							</div>
							<div class="text-ellipsis text-muted text-sm ng-binding">
								<span> <b>No.${sheet.identities.provider}</b> / ${sheet.details.length} productos</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg">
		<div class="p-a pos-rlt app-scrollable">
			<div class="app-session">
				<span v-if="selection.institution">Vista preliminar de factura emitida por <span style="color:mediumblue">${selection.provider.name}</span> a <span style="color:mediumblue">${selection.institution.name}</span></span>
				<i class="fas fa-file" v-on:click="hideLeftPannel = !hideLeftPannel"></i>
			</div>
			<div class="app-session-container">
				<div class="app-report-container" v-bind:style="{height: $root.screen.height - 170 + 'px!important'}">
					<div v-if="report" class="app-report-preview" v-html="report">

					</div>
					<div v-else>
						<div class="app-grid-empty-container" v-if="filteredSheets && filteredSheets.length > 0">
							<div class="icon">
								<span class="fas fa-chevron-left text-white"></span>
							</div>
							<div class="message text-white">
								<div class="text text-white">Sin conduce seleccionado</div>
								<span class="text-white" style="opacity: 0.6">Seleccione almenos un conduce para continuar</span>
							</div>
						</div>

						<div v-else class="app-grid-empty-container">
							<div class="icon">
								<span class="fas fa-info-circle text-white"></span>
							</div>
							<div class="message text-white">
								<div class="text text-white">Este centro no tiene conduces emitidos</div>
								<a v-on:click="close()"  style="opacity: 0.6; color:white!important">Volver atrás</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg w-xxl dimmed lt bg-auto" style="width: 200px">
		<div class="p-a pos-rlt app-scrollable" v-bind:style="{height: $root.screen.height - 90 + 'px!important'}">
			<div class="app-session">
				<span>Opciones</span>
				<i class="fas fa-cog"></i>
			</div>
			<div class="app-session-buttons app-session-buttons-left" style="padding-bottom: 14px">
				<button v-on:click="save()" class="btn primary" type="button" :disabled="report == null || printed">
					<i class="fa fa-save"></i>Guardar
				</button>
				<button v-on:click="process()" class="btn blue-900" type="button" :disabled="bill == null || bill.dates.printed != null">
					<i class="fa fa-flag"></i>Procesar
				</button>
				<div class="space"></div>
				<button v-on:click="print()" class="btn primary" type="button" :disabled="bill == null || bill.dates.printed == null">
					<i class="fa fa-print"></i>Imprimir
				</button>
				<button v-on:click="download()" class="btn primary" type="button" :disabled="bill == null || bill.dates.printed == null">
					<i class="fa fa-download"></i>Descargar
				</button>
			</div>
			<div class="app-session">
				<span>Totales</span>
				<i class="fas fa-calculator"></i>
			</div>
			<div class="app-session-container">

				<table>
					<tr>
						<td class="app-session-table-title">Exentos</td>
						<td class="app-session-table-value">RD$ ${totals.excent}</td>
					</tr>
					<tr>
						<td class="app-session-table-title">Gravados</td>
						<td class="app-session-table-value">RD$ ${totals.graven}</td>
					</tr>
					<tr>
						<td class="app-session-table-title">ITBIS</td>
						<td class="app-session-table-value">RD$ ${totals.taxsum}</td>
					</tr>
					<tr>
						<td class="app-session-table-title">Total</td>
						<td class="app-session-table-value text-info">RD$ ${totals.general}</td>
					</tr>
				</table>

			</div>
		</div>
	</div>
</div>