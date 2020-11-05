<div class="pos-rlt">
	<div class="app-session">
		<span v-if="$parent.$parent.selection.provider && $parent.$parent.selection.institution">Facturas emitidas por <span style="color:mediumblue">${$parent.$parent.selection.provider.name}</span> a <span style="color:mediumblue">${$parent.$parent.selection.institution.name}</span></span>
		<span v-else>Cantidades por Producto</span>

		<span>en</span>
		&nbsp;
		<select v-model="$parent.$parent.selectedMonth">
			<option v-for="(month, index) in $parent.$parent.months" v-if="index > 0 && index <= $parent.$parent.currentMonth + 1" :value="month.index">${month.label}</option>
		</select>
		&nbsp;
		<span>del ${getYear()}</span>
	</div>
	<div class="app-session-container" v-if="$parent.$parent.selection.provider && $parent.$parent.selection.institution">
		<list-bills ref="bills" :provider="$parent.$parent.selection.provider.id" :institution="$parent.$parent.selection.institution.id" :month="$parent.$parent.selectedMonth"></list-bills>
	</div>
</div>