
function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

function guid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    };


var _mockToday = new Date();

seedTasks = [
     {
          //_id: X,
          Title: "Count the Register"
          ,Due: "Close of Business"
          ,Importance: "High"
          ,Assigned: "John Doe"
          ,Issued: "Mary Smith"
          ,Status: "Pending"
     }
     ,{
          //_id: X,
          Title: "Count the Register"
          ,Due: "Close of Business"
          ,Importance: "High"
          ,Assigned: "John Doe"
          ,Issued: "Mary Smith"
          ,Status: "Pending"
     }
     ,{
          //_id: X,
          Title: "Count the Register"
          ,Due: "Close of Business"
          ,Importance: "High"
          ,Assigned: "John Doe"
          ,Issued: "Mary Smith"
          ,Status: "Pending"
     }
     ,{
          //_id: X,
          Title: "Count the Register"
          ,Due: "Close of Business"
          ,Importance: "High"
          ,Assigned: "John Doe"
          ,Issued: "Mary Smith"
          ,Status: "Pending"
     }
     ,{
          //_id: X,
          Title: "Count the Register"
          ,Due: "Close of Business"
          ,Importance: "High"
          ,Assigned: "John Doe"
          ,Issued: "Mary Smith"
          ,Status: "Pending"
     }
     ,{
          //_id: X,
          Title: "Count the Register"
          ,Due: "Close of Business"
          ,Importance: "High"
          ,Assigned: "John Doe"
          ,Issued: "Mary Smith"
          ,Status: "Pending"
     }
     ,{
          //_id: X,
          Title: "Count the Register"
          ,Due: "Close of Business"
          ,Importance: "High"
          ,Assigned: "John Doe"
          ,Issued: "Mary Smith"
          ,Status: "Pending"
     }
];
