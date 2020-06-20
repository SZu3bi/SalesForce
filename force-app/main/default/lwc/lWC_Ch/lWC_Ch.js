import { LightningElement ,wire,track,api } from 'lwc';
import getMyContact from "@salesforce/apex/ContactController.fetchContact";
import updateMyContact from "@salesforce/apex/ContactController.updateContact";
import createMyContact from "@salesforce/apex/ContactController.createContact";
import { refreshApex } from '@salesforce/apex';
import CONTACT_FIRSTNAME from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME from '@salesforce/schema/Contact.LastName';
import CONTACT_Checked from '@salesforce/schema/Contact.Checked__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class MyCmp extends LightningElement {
 @api wiredContact;
 @api recordId;
 @api realFormData;
 @track cheke;
 @wire (getMyContact , { contactId: '$recordId' })
        fetchedContact( resp){
           this.wiredContact = resp;
           this.realFormData = {... this.wiredContact.data};
    }
    updateValue(event){      
        this.cheke=event.target.field;
        this.realFormData = {...this.realFormData , [event.target.dataset.field] : event.detail.value };
        console.log( this.realFormData);
    }
    saveRecord(){
        
        updateMyContact({con : this.realFormData}).then(()=>{
            console.log('Refresh Apex called');
            refreshApex(this.wiredContact);
        });
    }
    createRecord(){
            let newContact = { [CONTACT_FIRSTNAME.fieldApiName] : '' ,[CONTACT_LASTNAME.fieldApiName] : ''};
            createMyContact({con : newContact}).then((resp)=>{
                            this.recordId = resp.Id; //this will auto call wireMethod/
            }).catch((err) => {
               // Handle any error that occurred in any of the previous
               // promises in the chain.
               console.log(JSON.stringify(err));
             });
        }
        showSuccessToast() {
            const evt = new ShowToastEvent({
                title: 'Record Update',
                message: 'Application is loaded ',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }

      
    }