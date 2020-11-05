<div>
	<div :id="('mod' + id)" class="modal fade" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" :class="{'modal-lg' : large === true}">
			<div class="modal-content fade-out" v-show="loaded !== undefined && loaded === false">
				<div class="modal-body app-modal-loading">
					<i class="fas fa-spinner fa-spin"></i><br>
					<span>Cargando</span>
				</div>
			</div>
			<div class="modal-content" v-show="loaded === undefined || loaded === true">
				<div class="modal-header">
					<h5 class="modal-title">
						<i v-if="icon" class="fas fa app-modal-icon" :class="icon"></i>
						<span>${title}</span>
					</h5>
					<button v-if="onCancel" type="button" class="close" aria-label="Close" data-dismiss="modal" @click="cancel()">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body app-modal-body">
					<span v-if="message" v-html="message"></span>
					<div v-if="prompt" class="app-modal-prompt">
						<form v-on:submit.prevent>
							<field-input v-model="value" :label="promptLabel" :type="prompt.type || (prompt.rows === 1 ? 'text' : 'area')" :rows="prompt.rows || 5" ref="promptElement" v-on:keyup.enter="enter"></field-input>
						</form>
					</div>

					<component ref="component" v-if="component" v-bind:is="component.name" :key="key"></component>
					<notifications class="app-form-notification" ref="notifications"></notifications>
				</div>

				<div class="modal-footer">
					<button v-for="button in buttons" :disabled="button.prompted ? (value == null || value.length === 0 || value === '') : (button.disabled != null ? button.disabled : false)" class="btn btn" :class="button.class || 'primary'" type="button" @click="button.action()">${button.text}</button>
				</div>
				<input type="hidden" :id="('dis_' + id)" data-dismiss="modal" v-bind:data-target="('#mod' + id)">
			</div>
		</div>
	</div>
	<input type="hidden" :id="('tog_' + id)" data-toggle="modal" v-bind:data-target="('#mod' + id)">
</div>