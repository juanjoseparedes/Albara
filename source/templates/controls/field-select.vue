<div v-bind="$attrs" class="app-field-parent">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<select class="md-input" :value="value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus !== undefined">
			<option v-if="showFirst === 'true'" disabled :selected="value == null || value === ''" value>- Seleccione -</option>
			<option v-for="(item, ivalue) in items" :selected="value === (item[valueBind || 'key'] || ivalue)" :value="item[valueBind || 'key'] || ivalue">${item[keyBind || 'caption'] || item}</option>
		</select>
		<label>${label}</label>
	</div>
</div>