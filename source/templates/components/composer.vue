<div class="app-composer">
	<div v-if="!anyRation" class="app-grid-empty-container">
		<div class="icon">
			<span class="fas fa-info-circle"></span>
		</div>
		<div class="message">
			<div class="text">Las raciones del centro no estan definidas para este proveedor</div>
			<span>Favor contactar un administrador</span>
		</div>
	</div>
	<div v-if="sheets != null && selection.provider != null && selection.institution != null && selection.categories != null && selection.categories.length > 0 && anyRation">

		<table class="app-composer-tables-contaiener" cellspacing="0" cellpadding="0" width="100%">
			<tr>
				<td style="width: 230px">
					<table class="app-composer-table app-composer-table-products">
						<tbody class="app-composer-category-group" v-for="(category,index) in selection.categories">
						<tr class="app-composer-top" v-if="anyArticle(category) && index === 0">
							<td class="app-composer-left-column">
								&nbsp;
							</td>
						</tr>
						<tr class="app-composer-category" v-if="anyArticle(category)">
							<td class="app-composer-left-column no-wrap">
								${category.name}
							</td>
						</tr>
						<tr class="app-composer-article" v-for="item in getArticles(category)" v-if="rations && rations[item.article.id]">
							<td class="app-composer-article-name app-composer-left-column" :class="{'app-composer-product-hover' : hoveredArticle === item.article.id}">
								<span class="no-wrap">${item.product.name}</span>
							</td>
						</tr>
						</tbody>
					</table>
				</td>
				<td style="max-width: 0; overflow-x: scroll">
					<table class="app-composer-table app-composer-table-quantities">
						<tbody class="app-composer-category-group" v-for="(category,index) in selection.categories">
						<tr class="app-composer-top" v-if="anyArticle(category) && index === 0">
							<td class="app-composer-category-day" :class="{'app-composer-day-hover' : hoveredDay === day, 'app-composer-day-free' : day.free || day.type.free}" v-for="day in calendar.days">
								<span>${day.type.simbol}</span>
							</td>
						</tr>
						<tr class="app-composer-category" v-if="anyArticle(category)">
							<td class="app-composer-category-day" v-for="day in calendar.days" :class="{'app-composer-day-hover' : hoveredDay === day, 'app-composer-day-free' : day.free || day.type.free,'app-composer-day-print' : !day.free && !day.type.free}" v-on:click="print(category, day)">
								<span class="day">${day.day}</span>
							</td>
						</tr>
						<tr class="app-composer-article" v-for="item in getArticles(category)" v-if="rations && rations[item.article.id]">
							<td :class="getSheetCellClasses(item, day)" v-for="day in calendar.days" v-on:mouseover="doHover(item.article.id, day)" v-on:mouseleave="clearHover" v-on:click.stop="edit(item, day)">
								<span v-html="getQuantity(item.article, day)"></span>
							</td>
						</tr>
						</tbody>
					</table>
				</td>
				<td style="width: 180px">
					<table class="app-composer-table app-composer-table-units">
						<tbody class="app-composer-category-group" v-for="(category,index) in selection.categories">
						<tr class="app-composer-top" v-if="anyArticle(category) && index === 0">
							<td class="">
								&nbsp;
							</td>
							<td class="">
								&nbsp;
							</td>
						</tr>
						<tr class="app-composer-category" v-if="anyArticle(category)">
							<td class="app-composer-total">
								<span class="no-wrap">Total Mes</span>
							</td>
							<td class="app-composer-unit app-composer-right-column">
								<span>Unidad</span>
							</td>
						</tr>
						<tr class="app-composer-article" v-for="item in getArticles(category)" v-if="rations && rations[item.article.id]">
							<td class="app-composer-total">
								<span>${getProductTotal(item)}</span>
							</td>
							<td class="app-composer-unit app-composer-right-column">
								${getProductUnit(item)}
							</td>
						</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</table>
	</div>

</div>