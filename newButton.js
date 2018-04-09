(function () {
  let appSpinalforgePlugin = angular.module('app.spinalforge.plugin');
  appSpinalforgePlugin.run(["$rootScope", "$compile", "$templateCache", "$http", "spinalRegisterViewerPlugin",
    function ($rootScope, $compile, $templateCache, $http, spinalRegisterViewerPlugin) {
      spinalRegisterViewerPlugin.register("YourPanel");  // create your panel
      let load_template = (uri, name) => {
        $http.get(uri).then((response) => {
          $templateCache.put(name, response.data);
        }, (errorResponse) => {
          console.log('Cannot load the file ' + uri);
        });
      };
      let toload = [{
        uri: '../templates/spinal-env-viewer-YourName-plugin/YourNameTemplate.html', 
        name: 'YourNameTemplate.html'
      }];


      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      class YourPanel {
        constructor(viewer, options) {
          Autodesk.Viewing.Extension.call(this, viewer, options);
          this.viewer = viewer;
          this.panel = null;
        }

        load() {
          if (this.viewer.toolbar) {
            this.createUI();
          } else {
            this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
            this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
          }
          return true;
        }

        onToolbarCreated() {
          this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
          this.onToolbarCreatedBinded = null;
          this.createUI();
        }

        unload() {
          this.viewer.toolbar.removeControl(this.subToolbar);
          return true;
        }
// This function is to create your button on viewer, it used autodesk forge api 
        createUI() {
          var title = 'Title of your panel';
          this.panel = new PanelClass(this.viewer, title);
          var button1 = new Autodesk.Viewing.UI.Button('Title of your button');

          button1.onClick = (e) => {
            if (!this.panel.isVisible()) {
              this.panel.setVisible(true);
            } else {
              this.panel.setVisible(false);
            }
          };

          button1.addClass('fa');
          button1.addClass('fa-list-alt');
          button1.addClass('fa-2x');
          button1.setToolTip('On mouse over');

          this.subToolbar = this.viewer.toolbar.getControl("spinalcom");
          if (!this.subToolbar) {
            this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('spinalcom');
            this.viewer.toolbar.addControl(this.subToolbar);
          }
          this.subToolbar.addControl(button1);
          this.initialize();
        }

        initialize() {

          var _container = document.createElement('div');
          _container.style.height = "calc(100% - 45px)";
          _container.style.overflowY = 'auto';
          this.panel.container.appendChild(_container);
// Modify your ng-controller to have your own controller.
          $(_container).html("<div ng-controller=\"YourNameCtrl\" ng-cloak>" +
            $templateCache.get("YourNameTemplate.html") + "</div>");
          $compile($(_container).contents())($rootScope);
        }
      } // end class
// Don't forget to register your Extension
      Autodesk.Viewing.theExtensionManager.registerExtension('YourPanel', YourPanel);
    } // end run
  ]);
  require("./createPanel.js");

})();
