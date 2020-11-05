<form>
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-input class="col-sm-5" v-model="model.name" label="Nombre Afiliado"></field-input>
				<field-input class="col-sm-7" v-model="model.alias" label="Alias"></field-input>
			</div>
			<div class="row">
				<field-categories class="col-sm-5" v-model="model.location" label="Regional / Municipio / Ciudad" type="region" single="true" direction="up"></field-categories>
				<field-input class="col-sm-7" v-model="model.address" label="Dirección"></field-input>
			</div>
			<div class="row">
				<field-select class="col-sm-5" v-model="model.identity.type" label="Tipo de Documento" :items="enums.identity_types" show-first="true"></field-select>
				<field-input class="col-sm-7" v-model="model.identity.number" label="Número Documento"></field-input>
			</div>
			<div class="row  app-form-group-title">
				Administrador / Representante
			</div>
			<div class="row">
				<field-input class="col-sm-3" v-model="model.administrator.first_name" label="Nombre"></field-input>
				<field-input class="col-sm-3" v-model="model.administrator.last_name" label="Apellido"></field-input>
				<field-input class="col-sm-3" v-model="model.administrator.phone" label="Teléfono"></field-input>
				<field-input class="col-sm-3" v-model="model.administrator.email" label="Correo" type="email"></field-input>
			</div>
		</div>
	</div>
</form>