fabric.MyCompositeObject = fabric.util.createClass(fabric.Group, {
               type: 'MyCompositeObject',

               initialize: function (options) {
                    options || (options = {});

                    this.callSuper('initialize', options);
                    this.set('radius', options.radius || 10);
                    this.set('spacing', options.spacing || 100);

                    this.add(new fabric.Circle({
                         ...
                    }));
                    this.add(new fabric.Circle({
                         ...
                    }));

                    ...
               },