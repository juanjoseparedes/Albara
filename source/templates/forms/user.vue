<form>
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-input class="col-sm-6" v-model="model.first_name" label="Nombre"></field-input>
				<field-input class="col-sm-6" v-model="model.last_name" label="Apellido"></field-input>
			</div>
			<div class="row">
				<field-input class="col-sm-6" v-model="model.email" label="Correo" type="email"></field-input>
				<field-input class="col-sm-6" v-model="model.password" label="Contraseña" type="password"></field-input>
			</div>
			<div class="row">
				<field-select class="col-sm-8" v-model="model.role" label="Role" :items="{administrator:'Administrador',operator:'Operador'}" show-first="true"></field-select>
				<field-select class="col-sm-4" v-model="model.state" label="Estado" :items="{active:'Activo', inactive:'Inactivo'}" show-first="true"></field-select>
			</div>
		</div>
	</div>
</form>