<form xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<div class="box">
		<div class="box-body">
			<div class="row m-b">
				<field-lookup class="col-sm-12" v-model="model.id" label="Modalidad" :source="{list: '/categories', item: '/categories'}" :binding="{caption:'description', preview:'name'}">
					<template v-slot:icon="{item}">
						<i class="fa fa-tags"></i>
					</template>
					<template v-slot:title="{item}">
						${item.name}
					</template>
				</field-lookup>
			</div>
		</div>
	</div>
</form>