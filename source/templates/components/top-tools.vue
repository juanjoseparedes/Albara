<div class="app-static-header">
	<div class="navbar navbar-toggleable-sm" style="padding-left: 0!important">
		<div class="nav app-navbar-nav app-right-navbar">
			<li class="app-top-menu-separator"></li>

			<li class="nav-item dropdown" v-for="(group, index) in groups">
				<router-link class="nav-link app-navigation-tools-icons" data-toggle="dropdown" :to="group.path || ''" v-bind:class="{'app-tool-active': group.active === true }">
					<i v-if="group.icon.class" v-bind:style="{color:group.icon.color + '!important'}" class="fa fas fa-fw text-muted app-tool-icon" :class="group.icon.class" v-on:mouseover="$parent.page.setHint(group)" v-on:click="group.action ? group.action() : null"></i>

					<div v-if="group.icon.image && !group.icon.class" class="avatar w-32" v-on:mouseover="$parent.page.setHint(group)" v-on:click="group.action ? group.action() : null">
						<div style="width: 32px; height: 32px" class="img-circle app-avatar-background" v-bind:style="{'background-image': 'url('+group.icon.image+'?t='+$root.profile.tick+'), url('+group.icon.alt+')'}"></div>
						<i class="on b-white bottom"></i>
					</div>

					<span v-if="group.label && group.label.enabled === true" v-bind:style="{backgroundColor:group.label.fill, color:group.label.color}" class="label label-sm up warn" v-on:mouseover="$parent.page.setHint(group)" v-on:click="group.action ? group.action() : null">${group.label.text}</span>
				</router-link>

				<div v-if="group.pages && group.pages.length && (!group.type || group.type === 'Menu')" class="dropdown-menu dropdown-menu-overlay animated fadeIn pull-right">
					<div v-for="(page, index) in group.pages" v-if="page.enabled !== false" v-on:click="page.action ? page.action() : null" v-on:mouseover="$parent.page.setHint(page)">
						<div class="dropdown-divider" v-if="page.divider === true && index > 0"></div>
						<router-link class="dropdown-item" :to="page.path || ''" v-bind:class="{'app-tool-active': page.active === true }">
							<i v-bind:style="{color:page.icon.color + '!important'}" class="fa fa-fw text-muted" :class="page.icon.class"></i>
							<span v-bind:style="{color:page.caption.color}">${page.caption.title}</span>
							<span class="pull-right" v-if="page.label && page.label.enabled !== false">
                                    <span v-bind:style="{backgroundColor:page.label.fill, color:page.label.color}" class="label rounded primary">${page.label.text}</span>
                                </span>
						</router-link>
					</div>
				</div>

				<div v-if="group.type === 'Boxed'" class="dropdown-menu dropdown-menu-overlay pull-right w-xl animated fadeIn no-bg no-border no-shadow">
					<div class="scrollable" style="max-height: 220px">
						<ul class="list-group list-group-gap m-0">
							<li class="list-group-item dark-white lt box-shadow-z0 b" v-for="(page, index) in group.pages">
                                    <span class="pull-left m-r" v-if="page.icon" v-on:click="page.action ? page.action() : null" v-on:mouseover="$parent.page.setHint(page)">
                                        <img v-if="page.icon && page.icon.image" :src="page.icon.image" alt="..." class="w-40 img-circle">
                                        <i v-if="page.icon && !page.icon.image && page.icon.class" v-bind:style="{color:page.icon.color + '!important'}" class="fa fa-fw text-muted app-boxed-tool-icon" :class="page.icon.class"></i>
                                    </span>
								<span class="clear block" v-on:click="page.action ? page.action() : null" v-on:mouseover="$parent.page.setHint(page)">
                                    ${page.caption.title} <router-link :to="page.path || ''" v-on:click="page.action ? page.action() : null" v-on:mouseover="$parent.page.setHint(page)" class="text-primary" v-if="page.caption.anchor">${page.anchor}</router-link>
									<br>
                                    <small v-if="page.caption.subtitle" class="text-muted">${page.caption.subtitle}</small>
                                </span>
							</li>
						</ul>
					</div>
				</div>
			</li>
		</div>
	</div>
</div>