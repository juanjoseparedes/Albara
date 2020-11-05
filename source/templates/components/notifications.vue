<div>
	<div v-for="notification in items" v-show="disabled == null || disabled === 'false' || disabled === false">
		<div class="app-alert-box" v-bind:class="{'app-alert-box-visible' : notification.visible, 'app-alert-box-hidden' : !notification.visible, 'app-alert-danger' : notification.type === 'exception', 'app-alert-info' : notification.type === 'information'}">
		    <span class="app-notification-content">
		        <i class="fas" v-bind:class="{'fa-exclamation-triangle' : notification.type === 'exception', 'fa-info-circle' : notification.type === 'information'}"></i>
			    <span>${notification.message}</span>
		    </span>
		</div>
	</div>
</div>