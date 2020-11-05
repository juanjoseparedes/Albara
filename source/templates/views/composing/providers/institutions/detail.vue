<div class="pos-rlt">
	<div class="app-session">
		<span v-if="$parent.$parent.selection.provider && $parent.$parent.selection.institution">Detalle de productos a suplir por <span style="color:mediumblue">${$parent.$parent.selection.provider.name}</span> a <span style="color:mediumblue">${$parent.$parent.selection.institution.name}</span></span>
		<span v-else>Cantidades por Producto</span>

		<span>en</span>
		&nbsp;
		<select v-model="$parent.$parent.selectedMonth">
			<option v-for="(month, index) in $parent.$parent.months" v-if="index > 0 && index <= $parent.$parent.currentMonth + 1" :value="month.index">${month.label}</option>
		</select>
		&nbsp;
		<span>del ${getYear()}</span>
	</div>
	<div class="app-session-container">
		<composer v-if="$parent.$parent.selection.provider" :references="$parent.$parent.selection.provider" :month="$parent.$parent.selectedMonth" :provider="$route.params.providerId" :institution="$route.params.institutionId" ref="composer"></composer>
	</div>
</div>