'use strict';

anxeb.vue.include.component('list-bills', function (helpers) {
	return {
		template : '/lists/bills.vue',
		props    : ['allow-search', 'show-title', 'provider', 'institution', 'year', 'month'],
		methods  : {
			edit     : function (row) {
				var _self = this;
				helpers.root.navigate('/billing/' + row.id + '/manage');
			},
			add      : function () {
				var _self = this;
				helpers.root.navigate('/billing/create', { provider : _self.provider, institution : _self.institution, year : _self.filters.year, month : _self.filters.month });
			},
			print    : function (bill) {
				if (bill.dates.printed != null) {
					window.open('/api/billing/preview?bill=' + bill.id + '&action=print', '_blank');
				}
			},
			download : function (bill) {
				if (bill.dates.printed != null) {
					window.open('/api/billing/preview?bill=' + bill.id + '&action=download', '_blank');
				}
			},
			filter   : function (row) {
				return (this.filters.search === '' || JSON.stringify(row).toLowerCase().search(this.filters.search.toLowerCase()) > -1);
			},
			refresh(msg) {
				var _self = this;
				_self.$root.page.busy();

				helpers.api.get('/bills', {
					params : {
						provider    : _self.provider,
						institution : _self.institution,
						year        : _self.year || moment().year(),
						month       : _self.filters.month
					}
				}).then(function (res) {
					_self.bills = res.data;
					if (msg === true) {
						_self.$parent.log('Facturas recargadas correctamente').information();
					} else {
						_self.$root.page.idle();
					}
				}).catch(function () {});
			}
		},
		created  : function () {
			this.refresh();
		},
		watch    : {
			month : function (value) {
				this.filters.month = value || (moment().month() + 1);
			},
			year  : function (value) {
				this.filters.year = value || moment().year();
			}
		},
		computed : {
			monthName : function () {
				return this.enums.months[this.filters.month].label;
			}
		},
		data     : function () {
			return {
				bills   : null,
				filters : {
					search : '',
					month  : this.month || (moment().month() + 1),
					year   : this.year || moment().year()
				},
				enums   : {
					months : [
						{},
						{ label : 'Enero', index : 1 },
						{ label : 'Febrero', index : 2 },
						{ label : 'Marzo', index : 3 },
						{ label : 'Abril', index : 4 },
						{ label : 'Mayo', index : 5 },
						{ label : 'Junio', index : 6 },
						{ label : 'Julio', index : 7 },
						{ label : 'Agosto', index : 8 },
						{ label : 'Septiembre', index : 9 },
						{ label : 'Octubre', index : 10 },
						{ label : 'Noviembre', index : 11 },
						{ label : 'Diciembre', index : 12 },
					]
				}
			};
		}
	}
});