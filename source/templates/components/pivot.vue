<div class="app-pivot">
	<div v-if="!showAll && !anyRation" class="app-grid-empty-container">
		<div class="icon">
			<span class="fas fa-exclamation-circle"></span>
		</div>
		<div class="message">
			<div class="text">Sin raciones definidas</div>
			<a v-on:click="add()">Crear nueva ración</a>
		</div>
	</div>

	<div v-if="selection.provider != null && selection.institution != null && selection.categories != null && selection.categories.length > 0">
		<table class="app-pivot-table">
			<tbody class="app-pivot-category-group" v-for="category in selection.categories">
			<tr class="app-pivot-category" v-if="showAll || anyArticle(category)">
				<td>

				</td>
				<td>
					${category.name}
				</td>
				<td class="app-pivot-category-total" :class="{'app-pivot-period-hover' : hoveredPeriod === period}" v-for="period in periods">
					<span>${period.label}</span> <i class="fas fa-plus" v-on:click="add(period, category)"></i>
				</td>
				<td class="app-pivot-total">
					<span>Total</span>
				</td>
				<td class="app-pivot-unit">
					<span>Unidad</span>
				</td>
			</tr>
			<tr class="app-pivot-article" v-for="item in getArticles(category)" v-if="showAll || rations && rations[item.article.id]">
				<td class="app-pivot-action">
					<i class="fas fa-trash" v-on:click="remove(item)"></i>
				</td>
				<td class="app-pivot-article-name">
					<span>${item.product.name}</span>
				</td>
				<td class="app-pivot-quantity" v-for="period in periods" v-on:mouseover="hoveredPeriod = period" v-on:mouseleave="hoveredPeriod = null">
					<span>${getQuantity(item.article, period)}</span>
					<i class="fa fa-edit" v-on:click="edit(item, period)"></i>
				</td>
				<td class="app-pivot-total">
					<span>${getProductTotal(item)}</span>
				</td>
				<td class="app-pivot-unit">
					${getProductUnit(item)}
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</div>