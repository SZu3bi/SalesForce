import { LightningElement ,wire,track,api } from 'lwc';
import getMyContact from "@salesforce/apex/ContactController.fetchContact";
import updateMyContact from "@salesforce/apex/ContactController.updateContact";
import createMyContact from "@salesforce/apex/ContactController.createContact";
import { refreshApex } from '@salesforce/apex';
import CONTACT_FIRSTNAME from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME from '@salesforce/schema/Contact.LastName';
import CONTACT_Selected_Value from '@salesforce/schema/Contact.Selected_Value__c';
import { getFieldValue } from 'lightning/uiRecordApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';


//import CONTACT_zaba6 from '@salesforce/schema/Contact.zaba6__c';
import { NavigationMixin } from 'lightning/navigation';


export default class MyCmp extends LightningElement {

    value = [];
    contactId;
    name = '';

 @api wiredContact;
 @api recordId;
 @api realFormData;
 @track areDetailsVisible;
 @track selectedCheckedBox;
 @track CONTACT_FIRSTNAME;
 

 @wire (getMyContact , { contactId: '$recordId' })
        fetchedContact( resp){
           this.wiredContact = resp;
           this.realFormData = {... this.wiredContact.data};

    }


    updateValue(event){      



        this.realFormData = {...this.realFormData , [event.target.dataset.field] : event.detail.value };
        console.log( this.realFormData);
    }

    
    updateCheckValue(event){      

        this.realFormData = {...this.realFormData , [event.target.dataset.field] : event.target.checked };
        console.log( this.realFormData);
    }


    saveRecord(event ){

        updateMyContact({con : this.realFormData}).then(()=>{

            console.log('Refresh Apex called');
            refreshApex(this.wiredContact);
        });

    }


    createRecord(event ){

            let newContact = { [CONTACT_FIRSTNAME.fieldApiName] : this.CONTACT_FIRSTNAME ,[CONTACT_LASTNAME.fieldApiName] : 'ssssssssssss', [CONTACT_Selected_Value.fieldApiName]: this.selectedCheckedBox};
              console.log('refresh===========> ', this.CONTACT_FIRSTNAME.target );
              


            createMyContact({con : newContact}).then((resp)=>{
                            this.recordId = resp.Id; //this will auto call wireMethod/


            }).catch((err) => {
               // Handle any error that occurred in any of the previous
               // promises in the chain.

               console.log(JSON.stringify(err));
             });
             



        }

        get options() {
            return [
                { label: 'Ross', value: 'Ross' },
                { label: 'Rachel', value: 'Rachel' },
            ];
        }
    
        get selectedValues() {

            return this.value.join(',');

        }
    
        handleChange(e) {
            this.value = e.detail.value;
            this.selectedCheckedBox=this.value.join(',');

        }
        
    
       
    }




    