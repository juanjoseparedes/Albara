<div v-bind="$attrs" class="app-field-parent">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<i class="pull-right fas app-field-custom-button" :class="[isSingle ? 'fa-caret-down' : 'fa-plus']" v-on:click="browse()" ref="browseButton"></i>
		<div v-if="anyValue" class="app-field-custom-container">
			<div v-if="isSingle" class="app-field-custom-single pointer" v-on:click="browse()">
				${value.root.name} : ${value.value.name}
			</div>
			<div v-else class="app-field-custom-chips">
				<span v-for="branch in branches" v-if="branch.value != null" class="app-chip">${branch.root.name} : ${branch.value.name}<i class="fas fa-times" v-on:click="remove(branch)"></i></span>
			</div>
		</div>
		<div v-else class="app-field-custom-container">
			<div class="app-field-custom-single pointer" v-on:click="browse()">
				- Seleccione -
			</div>
		</div>
		<input class="md-input" style="display: none">
		<div class="app-field-custom-browser" :class="{'app-field-custom-browser-up' : direction === 'up'}" v-show="canBrowse" ref="box">
			<div class="app-field-custom-top-label" v-if="direction === 'up'">
				${label}
			</div>
			<div class="list white">
				<div v-on:click="select(branch)" v-for="branch in branches" v-if="branch.count > 0">
					<div class="list-item b-l b-l-2x app-tenant-list-item" :class="{'app-tenant-list-item-selected' : selected != null && selected.id === branch.root.id}">
						<div class="list-left app-list-item-icon">
							<div class="fa fa-check-circle app-field-custom-selected-icon" v-if="branch.value"></div>
							<div class="far fa-circle app-field-custom-unselected-icon" v-else></div>
						</div>
						<div class="list-body">
							<div class="pull-right text-xs">
								<i v-if="selected === branch" class="fa fa-chevron-up ng-hide m-l-sm"></i>
								<i v-else class="fa fa-chevron-down ng-hide m-l-sm"></i>
							</div>
							<div class="app-field-custom-branch">
								<a class="_500 ng-binding">${branch.root.name}</a>
							</div>
							<div class="text-ellipsis text-muted text-sm ng-binding">
								<a class="app-label-link" v-if="branch.value != null">${branch.value.name}</a>
								<a class="app-label-link" v-else>Seleccionar</a>
							</div>
						</div>
					</div>
					<div v-if="selected === branch" class="app-field-custom-tree-container">
						<category-tree :reference="branch.root.id" :branch="branch" v-on:select="onSelected"></category-tree>
					</div>
				</div>
				<div class="app-field-custom-none">
					<a class="app-label-link" v-on:click="clear">Ninguno / Limpiar</a>
				</div>
			</div>
		</div>
		<label>${label}</label>
	</div>
</div>