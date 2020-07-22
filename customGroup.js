// ADD YOUR CODE HERE
fabric.CustomGroup = fabric.util.createClass(fabric.Group, {
     type: 'customGroup',

     initialize: function (objects, options) {
          options || (options = {});
          console.log('CustomGroup', objects);
          this.callSuper('initialize', objects, options);
          this.set('customAttribute', options.customAttribute || 'undefinedCustomAttribute');
     },

     toObject: function () {
          return fabric.util.object.extend(this.callSuper('toObject'), {
               customAttribute: this.get('customAttribute')
          });
     },

     _render: function (ctx) {
          this.callSuper('_render', ctx);
     }
});


/*
 * Synchronous loaded object
 */
fabric.CustomGroup.fromObject = function (object, callback) {
     var _enlivenedObjects;
     fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
          delete object.objects;
          _enlivenedObjects = enlivenedObjects;
     });
     return new fabric.CustomGroup(_enlivenedObjects, object);
};

/*