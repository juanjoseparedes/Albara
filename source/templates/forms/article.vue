<form xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-lookup class="col-sm-12" v-model="model.product" label="Producto" v-on:change="setVat" :source="{list: '/products', item: '/products'}" :binding="{caption:'description', preview:'name'}">
					<template v-slot:icon="{item}">
						<i class="fa fa-tag"></i>
					</template>
					<template v-slot:title="{item}">
						<b>${item.code}</b> / ${item.name}
					</template>
				</field-lookup>
			</div>
			<div class="row" v-for="(price, key) in model.prices">
				<field-input class="col-sm-6" v-model="model.prices[key]" :field-name="'model.prices.' + key" :label="enums.prices[key]" type="number"></field-input>
				<field-input class="col-sm-6" v-model="total(price)" :label="'Valor con ' + vatValue + '% ' + vatLabel" readonly="true" decimals="2" prefix="$" comma="true"></field-input>
			</div>
		</div>
	</div>
</form>