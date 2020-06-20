import { LightningElement ,wire,track,api } from 'lwc';
import getMyoppo from "@salesforce/apex/OppController.fetchOpportunity";
import { refreshApex } from '@salesforce/apex';
import NAME from '@salesforce/schema/Opportunity.Name';
import Opportunity_Selected_Value from '@salesforce/schema/Opportunity.Selected_Value__c';
import updateOpportunity from "@salesforce/apex/OppController.updateOpportunity";
import createOpportunity from "@salesforce/apex/OppController.createOpportunity";
import Account_Name from '@salesforce/schema/Opportunity.AccountId'
//import updateMyContact from "@salesforce/apex/ContactController.updateContact";
//import createMyContact from "@salesforce/apex/ContactController.createContact";
//import CONTACT_LASTNAME from '@salesforce/schema/Contact.LastName';
//import { getFieldValue } from 'lightning/uiRecordApi';
//import CONTACT_OBJECT from '@salesforce/schema/Contact';
//import CONTACT_zaba6 from '@salesforce/schema/Contact.zaba6__c';
//import { NavigationMixin } from 'lightning/navigation';


export default class MyCmp extends LightningElement {

    value = [];
    opportunityId;

 @api wiredOpportunity;
 @api recordId;
 @api realFormData;
 @track areDetailsVisible;
 @track selectedCheckedBox;
 @track NAME;
 @track Account_Name;
 

 @wire (getMyoppo , { opportunityId: '$recordId' })
        fetchedContact( resp){
           this.wiredOpportunity = resp;
           this.realFormData = {... this.wiredOpportunity.data};

    }


    updateValue(event){      



        this.realFormData = {...this.realFormData , [event.target.dataset.field] : event.detail.value };
        this.Account_Name = event.target.value;


    }
    updateValue1(event){      



        this.realFormData = {...this.realFormData , [event.target.dataset.field] : event.detail.value };
        this.NAME = event.target.value;

    }
    
    updateCheckValue(event){      

        this.realFormData = {...this.realFormData , [event.target.dataset.field] : event.target.checked };
    }


    saveRecord(event ){

        updateOpportunity({opp : this.realFormData}).then(()=>{

            refreshApex(this.wiredOpportunity);
        });

    }


    createRecord(event ){

            let newopp = { [NAME.fieldApiName] : this.NAME ,[Account_Name.fieldApiName] : this.Account_Name ,[Opportunity_Selected_Value.fieldApiName]: this.selectedCheckedBox};
              console.log('==========>' , this.NAME , this.Account_Name)


            createOpportunity({opp : newopp}).then((resp)=>{
                            this.recordId = resp.Id; //this will auto call wireMethod/


            }).catch((err) => {
               // Handle any error that occurred in any of the previous
               // promises in the chain.

               console.log(JSON.stringify(err));
             });
             



        }

     // get options() {
           // return [
           //    { label: 'Ross', value: 'Ross' },
            //    { label: 'Rachel', value: 'Rachel' },
          //  ];
     //   }
        
    
        get selectedValues() {

            return this.value.join(',');

        }
    
        handleChange(e) {
            this.value = e.detail.value;
            this.selectedCheckedBox = this.value.join(',');

        }
        
    
       
    }




    