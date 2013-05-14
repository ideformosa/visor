/**
 * api: (define)
 * module = VisorIDEF
 * extends = gxp.Viewer
 */

/** api: constructor
 *  .. class:: VisorIDEF(config)
 *		Crea una nueva aplicacion visor IDEF.
 *
 *     Parameters:
 *     config - {Object} Optional application configuration properties.
 *
 *     Valid config properties:
 *     map - {Object} Map configuration object.
 *     sources - {Object} An object with properties whose values are WMS endpoint URLs
 *
 *     Valid map config properties:
 *         projection - {String} EPSG:xxxx
 *         units - {String} map units according to the projection
 *         maxResolution - {Number}
 *         layers - {Array} A list of layer configuration objects.
 *         center - {Array} A two item array with center coordinates.
 *         zoom - {Number} An initial zoom level.
 *
 *     Valid layer config properties (WMS):
 *     name - {String} Required WMS layer name.
 *     title - {String} Optional title to display for layer.
 */

var VisorIDEF = Ext.extend(gxp.Viewer, {

 	/** api: config[cookieParamName]
     *  ``String`` The name of the cookie parameter to use for storing the
     *  logged in user.
     */
    //cookieParamName: 'idef-user',

    loginText: "Login",
    logoutText: "Logout, {user}",
    loginErrorText: "Invalid username or password.",
    userFieldText: "User",
    passwordFieldText: "Password",

    logoutConfirmTitle: "Warning",
    logoutConfirmMessage: "Logging out will undo any unsaved changes, remove any layers you may have added, and reset the map composition. Do you want to save your composition first?",


    /** private: method[initPortal]
     * Create the various parts that compose the layout.
     */
    initPortal: function() {
        this.createTools();
        VisorIDEF.superclass.initPortal.apply(this, arguments);
    },

    /**
     * api: method[createTools]
     * Create the toolbar configuration for the main view.
     */
    createTools: function() {
        //VisorIDEF.superclass.createTools.apply(this, arguments);

        new Ext.Button({id: "loginbutton"});

        if (this.authorizedRoles) {
            // unauthorized, show login button
            if (this.authorizedRoles.length === 0) {
                this.showLogin();
            } else {
                var user = this.getCookieValue(this.cookieParamName);
                if (user === null) {
                    user = "unknown";
                }
                this.showLogout(user);
            }
        }
    },

    /**
     * private: property[mapPanel]
     * the :class:`GeoExt.MapPanel` instance for the main viewport
     */
    //mapPanel: null,

    constructor: function(config) {

    	// Starting with this.authorizedRoles being undefined, which means no
        // authentication service is available
        if (config.authStatus === 401) {
            // user has not authenticated or is not authorized
            this.authorizedRoles = [];
        } else if (config.authStatus !== 404) {
            // user has authenticated
            this.authorizedRoles = ["ROLE_ADMINISTRATOR"];
        }
        // should not be persisted or accessed again
        delete config.authStatus;

        VisorIDEF.superclass.constructor.apply(this, arguments);
    },

    /** private: method[setCookieValue]
     *  Set the value for a cookie parameter
     */
    setCookieValue: function(param, value) {
        document.cookie = param + '=' + escape(value);
    },

    /** private: method[clearCookieValue]
     *  Clear a certain cookie parameter.
     */
    clearCookieValue: function(param) {
        document.cookie = param + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/geoserver";
    },

    /** private: method[getCookieValue]
     *  Get the value of a certain cookie parameter. Returns null if not found.
     */
    getCookieValue: function(param) {
        var i, x, y, cookies = document.cookie.split(";");
        for (i=0; i < cookies.length; i++) {
            x = cookies[i].substr(0, cookies[i].indexOf("="));
            y = cookies[i].substr(cookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==param) {
                return unescape(y);
            }
        }
        return null;
    },

    /** private: method[logout]
     *  Log out the current user from the application.
     */
    logout: function() {
        var callback = function() {
            this.clearCookieValue("JSESSIONID");
            this.clearCookieValue(this.cookieParamName);
            this.setAuthorizedRoles([]);
            window.location.reload();
        };
        Ext.Msg.show({
            title: this.logoutConfirmTitle,
            msg: this.logoutConfirmMessage,
            buttons: Ext.Msg.YESNOCANCEL,
            icon: Ext.MessageBox.WARNING,
            fn: function(btn) {
                if (btn === 'yes') {
                    this.save(callback, this);
                } else if (btn === 'no') {
                    callback.call(this);
                }
            },
            scope: this
        });
    },

    /** private: method[authenticate]
     * Show the login dialog for the user to login.
     */
    authenticate: function() {
        var panel = new Ext.FormPanel({
            url: "http://localhost:8080/geoserver/j_spring_security_check?",
            frame: true,
            labelWidth: 60,
            defaultType: "textfield",
            errorReader: {
                read: function(response) {
                    var success = false;
                    var records = [];
                    if (response.status === 200) {
                        success = true;
                    } else {
                        records = [
                            {data: {id: "username", msg: this.loginErrorText}},
                            {data: {id: "password", msg: this.loginErrorText}}
                        ];
                    }
                    return {
                        success: success,
                        records: records
                    };
                }
            },
            items: [{
                fieldLabel: this.userFieldText,
                name: "username",
                width: 137,
                allowBlank: false,
                listeners: {
                    render: function() {
                        this.focus(true, 100);
                    }
                }
            }, {
                fieldLabel: this.passwordFieldText,
                name: "password",
                width: 137,
                inputType: "password",
                allowBlank: false
            }],
            buttons: [{
                text: this.loginText,
                formBind: true,
                handler: submitLogin,
                scope: this
            }],
            keys: [{
                key: [Ext.EventObject.ENTER],
                handler: submitLogin,
                scope: this
            }]
        });

        function submitLogin2() {
            login({
                user:"admin", //geoserver user
                password: "geoserver",
                server : "http://localhost:8080", //geoserver host
                success : function(){
                    alert("Login OK!");
                },
                failure : function(){
                    alert("Login fail!");
                }
            });
        }

        function login (options) {
            // url del servlet del geoserver
            var url = options.server + "/geoserver/j_spring_security_check";
            // parametros para el login
            params = "username=" + options["user"] + "&password="
                        + options["password"];

            var contentType = "application/x-www-form-urlencoded";
            //se inicializa la petición ajax
            var ajax = $.ajax({
                data : params,
                type : "POST",
                contentType : contentType,
                url : url
            });
            // se ejecuta cuando la peticion finaliza
            ajax.done(function() {

                if ($.cookie("JSESSIONID") != null && options && options.success) {
                    options.success();
                }
            });
            // si ocurrio un error al realizar la peticion
            ajax.fail(function(data) {
                if (options && options.failure) {
                    options.failure(data);
                }
            });
            // se ejecuta siempre al final de la petición, sin importar que esta
            // haya fallado
            ajax.always(function() {
                if (options && options.always) {
                    options.always();
                }
            });
        }
        
		function submitLogin() {

			var username = 'admin';
			var password = 'geoserver';
			//var tok = username + ':' + password;
			//var auth = "Basic "+ Base64.encode(tok);
			var url = 'http://localhost:8080/geoserver/j_spring_security_check?';

			panel.buttons[0].disable();

			/*Ext.Ajax.request({
				url : url,
				method : 'POST',
				headers : {
					'Authorization' : auth,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				params: {
					username: username+'',
					password: password+''
				},

				success: function(response){
					//console.log(response);
					//alert(response.responseText);

					this.setCookieValue(this.cookieParamName, username);
                    this.setAuthorizedRoles(["ROLE_ADMINISTRATOR"]);
                    this.showLogout(username);
                    win.un("beforedestroy", this.cancelAuthentication, this);
                    win.close();
				},

				failure: function(response) {
					//console.log(response);
					//alert("login incorrect");

					this.authorizedRoles = [];
                    panel.buttons[0].enable();
                    panel.markInvalid({
                        "username": this.loginErrorText,
                        "password": this.loginErrorText
                    });
				},
				scope: this
			}); */

			Ext.Ajax.request({
                async: false,
				url: url,
				method: 'POST',
				/*headers : {
					'Authorization' : auth//,
					//'Content-Type': 'application/x-www-form-urlencoded'
				},*/
				//scriptTag: true,
				params: {
					username: username,
					password: password
				},
				success: function(){
					alert ("ok");
				},
                failure: function(response, opts) {
                    alert('server-side failure with status code ' + response.status);
                }
			});
		}

        function submitLogin0() {
            panel.buttons[0].disable();
            panel.getForm().submit({
                success: function(form, action) {
                    /*Ext.getCmp('paneltbar').items.each(function(tool) {
                        if (tool.needsAuthorization === true) {
                            tool.enable();
                        }
                    });*/
                    var user = form.findField('username').getValue();
                    this.setCookieValue(this.cookieParamName, user);
                    this.setAuthorizedRoles(["ROLE_ADMINISTRATOR"]);
                    this.showLogout(user);
                    win.un("beforedestroy", this.cancelAuthentication, this);
                    win.close();
                },
                failure: function(form, action) {
                    this.authorizedRoles = [];
                    panel.buttons[0].enable();
                    form.markInvalid({
                        "username": this.loginErrorText,
                        "password": this.loginErrorText
                    });
                },
                scope: this
            });
        }
                
        var win = new Ext.Window({
            title: this.loginText,
            layout: "fit",
            width: 235,
            height: 130,
            plain: true,
            border: false,
            modal: true,
            items: [panel],
            listeners: {
                beforedestroy: this.cancelAuthentication,
                scope: this
            }
        });
        win.show();
    },

    /**
     * private: method[applyLoginState]
     * Attach a handler to the login button and set its text.
     */
    applyLoginState: function(iconCls, text, handler, scope) {
        var loginButton = Ext.getCmp("loginbutton");
        loginButton.setIconClass(iconCls);
        loginButton.setText(text);
        loginButton.setHandler(handler, scope);
    },

    /** private: method[showLogin]
     *  Show the login button.
     */
    showLogin: function() {
        var text = this.loginText;
        var handler = this.authenticate;
        this.applyLoginState('login', text, handler, this);
    },

    /** private: method[showLogout]
     *  Show the logout button.
     */
    showLogout: function(user) {
        var text = new Ext.Template(this.logoutText).applyTemplate({user: user});
        var handler = this.logout;
        this.applyLoginState('logout', text, handler, this);
    }

    
 });