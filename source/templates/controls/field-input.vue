<div v-bind="$attrs" class="app-field-parent">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<input :readonly="readonly === 'true'" v-if="type !== 'area'" :type="type || 'text'" step="any" v-bind:autocomplete="type === 'password'" class="md-input" :value="post_value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus !== undefined" :maxlength="maxlength">
		<textarea v-if="type === 'area'" class="md-input" :value="value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus !== undefined" :rows="rows"></textarea>
		<label>${label}</label>
	</div>
</div>