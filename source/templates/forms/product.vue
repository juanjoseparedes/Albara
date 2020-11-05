<form>
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-input class="col-sm-12" v-model="model.name" label="Nombre"></field-input>
			</div>
			<div class="row">
				<field-input class="col-sm-12" v-model="model.description" label="Descripción" type="text"></field-input>
			</div>
			<div class="row">
				<field-input class="col-sm-6" v-model="model.code" label="Código"></field-input>
				<field-select class="col-sm-6" v-model="model.type" label="Tipo" :items="enums.types" show-first="true"></field-select>
			</div>
			<div class="row">
				<field-categories class="col-sm-6" v-model="model.unit" label="Unidad de Venta" type="unit" single="true"></field-categories>
				<field-categories class="col-sm-6" v-model="model.vat" label="Clase Impositiva" type="vat" single="true"></field-categories>
			</div>
		</div>
	</div>
</form>