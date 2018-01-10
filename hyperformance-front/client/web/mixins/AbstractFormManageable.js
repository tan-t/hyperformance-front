export default {
    name: 'AbstractFormManageable',
    methods : {
        clear() {
            this.getForm().reset()
        },
        setModel(model) {
        Object.keys(model).forEach(key=>{
                let field = this.fields.find(f=>f.id == key);
                if(!field){
                  return;
                }
                field.model = model[key];
              });
        this.setModelInternal(model);
        },
        getForm() {
            console.warn('getForm is not implemented.');
            return {reset(){}};
        },
        setModelInternal(model) { 
            
        },
        getItem(itemId) {
            return this.fields.find(field=>field.id == itemId);
        },
        setErrors(errorMap) {
            Object.keys(errorMap).forEach(attribute=>{
                var errors = errorMap[attribute].map(e=>e.message);
                this.getItem(attribute).errors = errors;
            });
        },
        clearErrors() {
            this.fields.forEach(field=>{
                field.errors = [];
            });
        },
        createModel() {
        var model = this.fields.reduce((a,b)=>{a[b.id] = b.model; return a;},{});
        return this.createModelInternal(model);;
        },
        createModelInternal(model) {
            return model;
        }

    }
  }