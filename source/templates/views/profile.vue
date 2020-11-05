<div class="padding">
	<div class="pull-left m-r-md" style="cursor:pointer" @click="picture">
        <span class="avatar w-128">
            <div style="width: 128px; height: 128px" class="avatar app-avatar-background" v-bind:style="{'background-image': 'url(/api/storage/profile/info/user/image?t=' + $root.profile.tick + '), url(/images/page/user-black.png)'}">
            <i class="on b-white app-dot-large"></i>
            </div>
        </span>
	</div>

	<div class="clear m-b">
		<h2 class="m-0 m-b-xs" style="border-bottom: solid 1px #c0c0c0; padding-bottom: 10px; padding-top: 12px">${$root.profile.full_name}
			<span style="color:#4c6b86"></span></h2>

		<div v-if="$root.profile.tenant" style="font-weight: normal; font-size: 20px; padding-bottom: 10px">
			${$root.profile.tenant.name}
		</div>

		<p style="font-size:1.2em; color: #4c6b86; padding-top: 4px">
		<span class="text-dark" style="padding-top: 10px">${enums.types[$root.profile.type]}</span> /
		<span class="m-r">${enums.roles[$root.profile.role]} / <span style="color:darkgreen">${enums.states[$root.profile.state]}</span></span><br>
		<span class="m-r text-secondary">${$root.profile.email}</span>
		</p>
	</div>
	<input id="_file_in" type="file" accept="image/jpeg;capture=user" style="display: none">
</div>