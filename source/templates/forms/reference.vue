<form>
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-input class="col-sm-12" v-model="model.name" label="Nombre"></field-input>
			</div>
			<div class="row" v-if="model.meta" v-for="field in model.meta">
				<field-input class="col-sm-12" v-model="field.value" :type="field.type" :label="field.label"></field-input>
			</div>
		</div>
	</div>
</form>