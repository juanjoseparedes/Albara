<div class="app-fluid-title">
	<div class="app-page-title text-ellipsis app-page-title-small hidden-lg-up">
		<a data-toggle="modal" data-target="#aside" class="d-lg-none">
			<span class="fa fa-bars"></span>
		</a>
		<span class="app-page-title-text">${title}</span>
	</div>

	<div class="app-page-title app-page-title-large hidden-md-down">
		<span class="fa fas" :class="action ? (icon + ' app-top-action-icon') : icon" v-on:click="actionCall()"></span>
		<span class="app-page-title-text">${title}</span>
	</div>
</div>