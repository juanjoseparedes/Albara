{{!< root}}

<div>
	<div id="aside" class="app-aside modal nav-dropdown">
		<div class="left navside dark dk" data-layout="column">
			<div class="navbar no-radius" style="padding-top: 11px; padding-left:18px;  padding-right:18px; padding-bottom: 10px; height: auto; background-color: rgba(0,0,0,0.22)">
				<img src="images/logo-white.png" style="width: 100%">
				<div v-if="$root.profile.tenant" style="text-align: left!important; border-top:solid 1px rgba(242,242,242,0.4); margin-top: 5px; padding-top: 3px; font-size:12px">
					${$root.profile.tenant.name}
				</div>
			</div>
			<navigator :init="navigation"></navigator>

			<div class="b-t">
				<div class="nav-fold" style="padding-bottom: 10px!important; padding-top: 9px; padding-left:13px; height: 57px; background-color: rgba(0,0,0,0.22)">
					<router-link to="/profile">
					<span class="pull-left">
						<div style="width: 40px; height: 40px" class="w-40 img-circle app-avatar-background" v-bind:style="{'background-image': 'url(/api/storage/profile/info/user/image?t=' + $root.profile.tick + '), url(/images/page/user-white.png)'}"></div>
					</span>
						<span class="clear hidden-folded" style="padding-left: 8px">
						<span class="block _500" v-bind:style="{color:$root.settings.theme.colors.foreground}">${$root.profile.full_name}</span>
						<small class="block text-success" style="opacity: 0.8"><i class="fa fa-circle text-success m-r-sm"></i>online</small>
					</span>
					</router-link>
				</div>
			</div>
		</div>
	</div>

	<div id="content" class="app-content box-shadow-z0" role="main">
		<div class="app-header white app-box-shadow">
			<div class="app-fluid-header">
				<top-header></top-header>

				<top-menu></top-menu>

				<top-tools :init="tooling"></top-tools>
			</div>
		</div>
		<div class="app-body">
			<div class="app-modal-busy" v-if="$root.flags.busy">
				<div><i class="fas fa-circle-notch fa-spin"></i></div>
			</div>
			<router-view></router-view>
		</div>
		<div class="app-footer">
			<notifications :disabled="modalIsActive"></notifications>
			<div class="white app-box-shadow app-footer-container">
				<status-bar :app-name="$root.app.name" :app-version="$root.app.version"></status-bar>
			</div>
		</div>
	</div>

	<modal ref="privateModal" v-on:state-change="modalIsActive = $event"></modal>
</div>