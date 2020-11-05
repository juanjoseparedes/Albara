<div class="navbar navbar-toggleable-sm hidden-xs-down">
	<ul class="nav mr-auto">
		<li class="nav-item dropdown app-main-menu" v-for="group in groups">
			<router-link class="nav-link" data-toggle="dropdown" :to="group.path || ''" v-if="group.visible !== false" v-bind:class="{'app-menu-active': group.active === true }">
				<div v-on:mouseover="$parent.page.setHint(group)" v-on:click="group.action ? group.action() : null">
					<i v-bind:style="{color: group.icon && group.icon.color ? group.icon.color + '!important' : undefined}" class="fa fa-fw text-muted" :class="group.icon ? group.icon.class : undefined"></i>
					<span v-if="group.caption" v-bind:style="{color:group.caption && group.caption.color ? group.caption.color + '!important' : undefined}">${group.caption.title}</span>
				</div>
			</router-link>
			<div class="dropdown-menu" v-if="group.pages && group.pages.length">
				<div v-for="(page, index) in group.pages" v-if="page.visible !== false" v-on:click="page.action ? page.action() : null" v-on:mouseover="$parent.page.setHint(page)">
					<div class="dropdown-divider" v-if="page.divider && index"></div>
					<router-link class="dropdown-item" :to="page.path || ''" v-bind:class="{'app-menu-active': page.active === true }">
						<i v-bind:style="{color: page.icon ? page.icon.color + '!important' : ''}" class="fa fa-fw text-muted" :class="page.icon ? page.icon.class : null"></i>
						<span v-bind:style="{color:page.caption.color}">${page.caption.title}</span>
						<span class="pull-right" v-if="page.label && page.label.visible !== false">
							<span v-if="page.label" v-bind:style="{backgroundColor:page.label.fill, color:page.label.color}" class="label rounded primary">${page.label.text}</span>
                        </span>
					</router-link>
				</div>
			</div>
		</li>
	</ul>
</div>