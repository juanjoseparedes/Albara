'use strict';

anxeb.vue.include.scope('billing/preview', function (helpers, instance) {
	return {
		mounted  : function () {

		},
		created  : function () {
			var _self = this;

			_self.refresh();
		},
		watch    : {},
		methods  : {
			refresh(msg, billId, callback) {
				var _self = this;
				billId = billId || _self.billId || null;

				var loadSheets = function (callback) {
					helpers.api.get('/sheets', {
						params : {
							provider    : _self.providerId,
							institution : _self.institutionId,
							year        : _self.year,
							month       : _self.month,
							printed     : true
						}
					}).then(function (res) {
						var bsIds = _self.bill != null ? _self.bill.sheets.map(function (sheet) {
							return sheet.reference;
						}) : [];

						_self.sheets = res.data.map(function (sheet) {
							var billed = bsIds.includes(sheet.id);

							sheet.billed = billed;
							sheet.checked = billed;
							return sheet;
						});

						if (msg === true) {
							_self.log('Datos de factura recargados correctamente').information();
						} else {
							_self.page.idle();
						}

						if (callback) {
							callback();
						}
					}).catch(function (err) {
						_self.log(err).exception();
					});
				};

				if (billId) {
					_self.page.busy();
					helpers.api.get('/bills/' + billId).then(function (res) {
						_self.bill = res.data;
						_self.selection.provider = _self.bill.provider;
						_self.selection.institution = _self.bill.institution;

						if (!_self.$route.path.endsWith('/manange')) {
							helpers.root.navigate('/billing/' + billId + '/manage');
						}

						loadSheets(function () {
							_self.page.setup({
								title  : 'Factura B' + _self.bill.trace.number + ' - ' + _self.monthName + ' ' + _self.year,
								icon   : 'fa-arrow-left',
								action : function () {
									_self.close();
								}
							});

							_self.refreshPreview(callback);
						});

					}).catch(function (err) {
						_self.log(err).exception();
					});
				} else {
					helpers.api.get('/providers/' + _self.providerId).then(function (res) {
						_self.selection.provider = res.data;
						if (_self.institutionId != null) {
							_self.selection.institution = _self.selection.provider.institutions.filter(function (item) {
								return item.id === _self.institutionId;
							})[0];
						}

						loadSheets(function () {
							_self.page.setup({
								title  : 'Emitir Factura - ' + _self.monthName + ' ' + _self.year,
								icon   : 'fa-arrow-left',
								action : function () {
									_self.close();
								}
							});
							if (callback) {
								callback();
							}
						});

					}).catch(function (err) {
						_self.log(err).exception();
					});
				}
			},
			close            : function (force) {
				var _self = this;
				var navigate = function () {
					helpers.root.navigate('/billing/providers/' + _self.providerId + '/institutions/' + _self.institutionId + '/detail', {
						month : _self.$route.query.month
					});
				};

				if (force === true || _self.filteredSheets.length === 0) {
					navigate();
				} else {
					if (_self.bill == null) {
						_self.$parent.modal('¿Está seguro que quiere desestimar esta factura?').confirm(function () {
							navigate();
						});
					} else {
						navigate();
					}
				}
			},
			retrieveBill     : function (action, callback) {
				var _self = this;

				var complete = function (res) {
					_self.page.idle();
					if (callback) {
						callback(res.data, {
							id     : res.headers['bill-id'],
							totals : {
								excent  : res.headers['totals-excent'],
								graven  : res.headers['totals-graven'],
								taxsum  : res.headers['totals-taxsum'],
								general : res.headers['totals-total']
							}
						});
					}
				};

				if (_self.bill != null) {
					_self.page.busy();
					helpers.api.get('/billing/preview', {
						params : {
							bill   : _self.bill.id,
							action : action,
							sheets : _self.bill.dates.printed == null ? _self.checkedSheets.map(function (sheet) {
								return sheet.id;
							}) : null,
						}
					}).then(function (res) {
						complete(res);
					}).catch(function (err) {
						_self.log(err).exception();
					});
				} else {
					if (_self.checkedSheets.length > 0) {
						_self.page.busy();
						helpers.api.get('/billing/preview', {
							params : {
								provider    : _self.providerId,
								institution : _self.institutionId,
								year        : _self.year,
								month       : _self.month,
								sheets      : _self.checkedSheets.map(function (sheet) {
									return sheet.id;
								}),
								action      : action
							}
						}).then(function (res) {
							complete(res);
						}).catch(function (err) {
							_self.log(err).exception();
						});
					} else {
						if (callback) {
							callback(null, null);
						}
					}
				}
			},
			refreshPreview   : function (callback) {
				var _self = this;

				_self.retrieveBill('preview', function (report, data) {
					if (report) {
						_self.report = report;
						_self.totals = data.totals;
					} else {
						_self.report = null;
						_self.totals.excent = 0;
						_self.totals.graven = 0;
						_self.totals.taxsum = 0;
						_self.totals.general = 0;
					}
					if (callback) {
						callback(report, data);
					}
				});
			},
			checkAll         : function () {
				this.sheets.forEach(function (sheet) {
					sheet.checked = true;
				});
				this.refreshPreview();
			},
			checkSheet       : function (sheet) {
				if (this.printed) {
					this.openSheet(sheet);
				} else {
					sheet.checked = !sheet.checked;
					this.refreshPreview();
				}
			},
			print            : function () {
				if (this.bill && this.bill.dates.printed) {
					window.open('/api/billing/preview?bill=' + this.bill.id + '&action=print', '_blank');
				} else {
					this.log('Debe procesar la factura antes de imprimir').exception();
				}
			},
			download         : function () {
				if (this.bill && this.bill.dates.printed) {
					window.open('/api/billing/preview?bill=' + this.bill.id + '&action=download', '_blank');
				} else {
					this.log('Debe procesar la factura antes de descargar').exception();
				}
			},
			save             : function () {
				var _self = this;
				if (_self.checkedSheets.length > 0) {
					_self.retrieveBill('save', function (report, data) {
						_self.report = report;
						_self.totals = data.totals;
						if (data.id) {
							_self.refresh(false, data.id, function () {
								_self.log('Factura archivada exitosamente').information();
							});
						}
					});
				}
			},
			getDateFormatted : function () {
				return this.year + ' ' + this.monthName;
			},
			process          : function () {
				var _self = this;
				if (_self.bill != null) {
					_self.$parent.modal('¿Está seguro que quiere procesar la factura en pantalla?<br/><br/>' +
						'Fecha: <b>' + _self.getDateFormatted() + '</b><br/>' +
						'Centro: <b>' + _self.selection.institution.name + '</b><br/>' +
						'Proveedor: <b>' + _self.selection.provider.name + '</b><br><br>' +
						'<span class="text-danger">Luego de este paso no podrá alterar el contenido de esta factura.</span>'
					).confirm(function () {
						helpers.api.post('/bills/process/' + _self.bill.id).then(function (res) {
							_self.log('Factura procesada y completada exitosamente').information();
							_self.refresh();
						}).catch(function (err) {
							_self.log(err).exception();
						});
					});
				}
			},
			openSheet        : function (sheet) {
				if (sheet && sheet.dates.printed) {
					window.open('/api/sheets/' + sheet.id + '/report', '_blank');
				}
			}
		},
		computed : {
			printed        : function () {
				return this.bill != null && this.bill.dates.printed != null;
			},
			month          : function () {
				return this.bill ? this.bill.trace.month : Number(this.$route.query.month);
			},
			year           : function () {
				return this.bill ? this.bill.trace.year : Number(this.$route.query.year);
			},
			providerId     : function () {
				return this.bill ? this.bill.provider.id : this.$route.query.provider;
			},
			institutionId  : function () {
				return this.bill ? this.bill.institution.id : this.$route.query.institution;
			},
			billId         : function () {
				return this.$route.params.billId;
			},
			monthName      : function () {
				return this.enums.months[this.month].label;
			},
			categories     : function () {
				var _self = this;
				var included = [];
				var result = [{
					name : 'Todas',
					id   : 'all'
				}];
				for (var s = 0; s < _self.sheets.length; s++) {
					var category = _self.sheets[s].category;

					if (!included.includes(category.id)) {
						included.push(category.id);
						result.push(category);
					}
				}
				return result;
			},
			filteredSheets : function () {
				var _self = this;
				if (_self.filters.category === 'all') {
					return _self.sheets;
				}
				return this.sheets.filter(function (sheet) {
					return sheet.category.id === _self.filters.category;
				});
			},
			checkedSheets  : function () {
				return this.sheets.filter(function (sheet) {
					return sheet.checked === true;
				});
			}
		},
		data     : function () {
			return {
				hideLeftPannel : false,
				report         : null,
				bill           : null,
				selection      : {
					provider    : null,
					institution : null
				},
				filters        : {
					category : 'all'
				},
				sheets         : null,
				totals         : {
					excent  : 0,
					graven  : 0,
					taxsum  : 0,
					general : 0
				},
				enums          : {
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