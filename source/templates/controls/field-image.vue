<div v-bind="$attrs" class="app-field-parent">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<div v-if="readonly == null || readonly === false" class="app-field-image-container" v-on:click="browse()" v-bind:style="{'background-image': current_image, height:height, width:width}"></div>
		<div v-else class="app-field-image-container" v-bind:style="{'background-image': current_image, height:height, width:width, cursor: 'default!important'}"></div>
		<input class="md-input" style="display: none">
		<label>${label}</label>
	</div>
</div>