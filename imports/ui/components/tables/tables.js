import "./tables.html";

Template.table1.onCreated(function () {
    const self = this;
    self.categories = new ReactiveVar();
    Meteor.call("categories.getAll", function (error, result) {
        if (result) {
            self.categories.set(result);
        } else {
            console.log(error);
        }
    });
});

Template.table1.helpers({
    fc_label(code) {
        if( Template.instance().categories.get()){
            const items =  Template.instance().categories.get();

            return items.find(item=>item.code == code).label;
        }
    },
    totalAll(){
        const items = this.data;
        if(items){
            return items.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
        }

    }
})