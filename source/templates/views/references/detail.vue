<div>
	<div class="app-page-form" v-if="reference">
		<form>
			<div class="row">
				<field-input class="col-sm-12" v-model="$parent.selected.name" label="Nombre"></field-input>
			</div>
			<div class="row" v-if="$parent.selected.meta" v-for="field in $parent.selected.meta">
				<field-input class="col-sm-6" v-model="field.value" :type="field.type" :label="field.label"></field-input>
			</div>
		</form>
	</div>

	<div class="app-buttons-right">
		<button v-on:click="$parent.save($parent.selected)" class="btn primary" type="button">Guardar</button>
	</div>
</div>