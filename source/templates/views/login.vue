<div style="display: table-cell; vertical-align: middle; height: 100vh; width: 100vw" class="admin-login-page">
	<div class="center-block w-xxl w-auto-xs p-y-md" style="padding-bottom: 15vh!important">
		<div class="p-a-md r" style="padding:15px!important; padding-bottom: 10px!important; text-align: center">
			<img src="images/logo-flat.png" style="width: 95%">
		</div>
		<div class="p-a-md box-color r box-shadow-z1 text-color m-a admin-login-box">
			<form v-on:submit.prevent="login">
				<div class="md-form-group">
					<input type="email" id="txtEmail" class="md-input" required v-model="email" v-focus="email == null || email.length === 0">
					<label>Correo</label>
				</div>
				<div class="md-form-group">
					<input type="password" id="txtPassword" class="md-input" required autocomplete="true" v-model="password" v-focus="email != null && email.length > 0">
					<label>Contraseña</label>
				</div>
				<div class="m-b-md" style="padding-left: 13px;color: #878787">
					<label class="md-check">
						<input type="checkbox" v-model="remember"><i class="primary"></i> Recordar Contraseña
					</label>
				</div>
				<button type="submit" class="btn primary btn-block p-x-md" :disabled="!email || !email.length || !password || !password.length">
					<i class="fa fas fa-sign-in-alt"></i> Entrar
				</button>
			</form>
		</div>
		<div class="app-login-build">Build v${$root.app.version}</div>
		<div class="m-a text-center" style="height: 50px; padding-left: 10px; padding-right: 10px">
			<notifications class="admin-login-notifications" ref="notification" max="1" delay="1800" reversed="true"></notifications>
		</div>
	</div>
</div>
