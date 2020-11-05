<form>
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-input class="col-sm-6" v-model="model.password" label="Contraseña Actual" type="password"></field-input>
				<field-input class="col-sm-6" v-model="model.email" label="Correo Nuevo" type="email"></field-input>
			</div>
			<div class="row">
				<field-input class="col-sm-6" v-model="model.password_new" label="Contraseña Nueva" type="password"></field-input>
				<field-input class="col-sm-6" v-model="model.password_rep" label="Repetir Contraseña" type="password"></field-input>
			</div>
		</div>
	</div>
</form>