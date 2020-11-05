<form xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-select v-if="!lockPeriod" class="col-sm-4" v-model="model.period" label="Período" :items="enums.periods" show-first="true" key-bind="label"></field-select>
				<field-select :class="[lockPeriod ? 'col-sm-6' : 'col-sm-4']" v-on:change="categoryChanged" v-model="model.category" label="Modalidad" :items="categories" show-first="true" key-bind="name" value-bind="id"></field-select>
				<field-select :class="[lockPeriod ? 'col-sm-6' : 'col-sm-4']" v-on:change="groupChanged" v-model="model.group" label="Grupo / Combo" :items="groups" show-first="true" key-bind="name" value-bind="id"></field-select>
			</div>
			<div class="row">
				<field-select class="col-sm-12" v-on:change="productChanged" v-model="model.article" label="Producto" :items="articles" show-first="true" key-bind="name" value-bind="id"></field-select>
			</div>
			<div class="row">
				<field-input type="number" class="col-sm-12" v-model="model.quantity" :label="selectedArticle != null && selectedArticle.product ? ('Cantidad de ' + (selectedUnit ?selectedUnit.meta.plural_caption.value :'')) : 'Cantidad'"></field-input>
			</div>
		</div>
	</div>
</form>