<div v-bind="$attrs" class="app-field-parent">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<input :placeholder="binding && preview != null && binding.preview != null ? preview[binding.preview] : null" v-show="canBrowse" class="md-input app-field-lookup-input" type="text" ref="search" v-on:keyup="searchChanged" v-on:keyup.esc.prevent="cancel" v-on:keyup.enter.prevent="enter" v-on:keydown.down.prevent="down" v-on:keydown.up.prevent="up">
		<i v-if="!canBrowse" class="pull-right fas app-field-custom-button fa-search" v-on:click="browse()" ref="browseButton"></i>

		<div v-if="anyValue && !canBrowse" class="app-field-custom-container">
			<div class="app-field-custom-single pointer" v-on:click="browse()">
				<span v-if="binding && binding.preview">
					${preview[binding.preview]}
				</span>
				<span v-else>
					<slot name="preview" v-bind:item="preview"></slot>
				</span>
			</div>
		</div>

		<div v-if="!anyValue && !canBrowse" class="app-field-custom-container">
			<div v-if="busy.searching && busy.display" class="app-field-custom-single pointer app-field-lookup-busy">
				<i class="fas fa-circle-notch fa-spin"></i><span>Buscando...</span>
			</div>
			<div v-else class="app-field-custom-single pointer" v-on:click="browse()">
				- Buscar -
			</div>
		</div>

		<div class="app-field-custom-browser app-field-lookup" :class="{'app-field-custom-browser-up' : direction === 'up'}" v-show="canBrowse" ref="box">
			<div class="app-field-custom-top-label" v-if="direction === 'up'">
				${label}
			</div>

			<div class="list white">
				<div v-if="busy.searching && busy.display" class="app-field-lookup-busy">
					<i class="fas fa-circle-notch fa-spin"></i><span>Buscando...</span>
				</div>
				<div class="app-field-lookup-list" v-if="result != null && result.length > 0">
					<div v-on:click="select(item, true)" v-for="item in result">
						<div class="list-item b-l b-l-2x app-tenant-list-item" :class="{'app-tenant-list-item-selected' : selected != null && selected.id === item.id}">
							<div class="list-left app-list-item-icon">
								<div v-if="$scopedSlots.icon !== undefined">
									<slot name="icon" v-bind:item="item"></slot>
								</div>
								<div v-else class="fa fa-folder"></div>
							</div>
							<div class="list-body">
								<div class="app-field-custom-branch">
									<a class="_500 ng-binding" v-if="binding && binding.title">
										${item[binding.title]}
									</a>
									<a v-else class="_500 ng-binding">
										<slot name="title" v-bind:item="item"></slot>
									</a>
								</div>
								<div class="text-ellipsis text-muted text-sm ng-binding">
									<span v-if="binding && binding.caption">
										${item[binding.caption]}
									</span>
									<span v-else>
										<slot name="caption" v-bind:item="item"></slot>
									</span>
								</div>
							</div>
						</div>
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