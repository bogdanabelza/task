import { LightningElement, track, wire, api } from 'lwc';

// *Apex методы
import getRecordContacts from '@salesforce/apex/recordContacts.getRecordContacts';//импорт метода getRecordContacts() апекс
import getCreateNewContact from '@salesforce/apex/recordContacts.getCreateNewContact';
import getContactById from '@salesforce/apex/recordContacts.getContactById';
import getTheBtnCreateIsHiddenDependingOnAccess from '@salesforce/apex/recordContacts.getTheBtnCreateIsHiddenDependingOnAccess';
import getTheBtnEditIsHiddenDependingOnAccess from '@salesforce/apex/recordContacts.getTheBtnEditIsHiddenDependingOnAccess';

import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';//Это создаст ссылку на используемый метод apex

import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import ID_FIELD from '@salesforce/schema/Contact.Id';


export default class ContactList extends LightningElement {
    @track conts = []; //содержит все записи
    @track data = []; // данные для отображения в таблице
    @track error;

    @api recordId;
    refreshTable;

    // *paginator
    @track startingRecord = 1;
    @track endingRecord = 0;
    @api pageSize;
    @track page = 1;
    @api totalConts = 0;
    @track totalPage = 0;
    isVisible = true;


    //*modal
    showModal = false;
    @track fName;
    @track lName;
    @track email;
    @track phone;
    @track title;
    btnSaveAdd = false;
    btnSaveEdit = false;
    disabled = false;
    contId;

    //*hidden btn
    theBtnCreateIsHidden = false;
    theBtnEditIsHidden = false;
    
    

    @wire(getRecordContacts)
    getContacts(result) {
        this.refreshTable = result;
        if (result.data) {
            this.conts = result.data;
            console.log(this.conts);
            this.totalConts = result.data.length; //все записи(20)
            if(this.totalConts == 10){ //указываем что если записей всего 10 то пагинацию не отображать
                this.isVisible = false;
                this.pageSize = this.totalConts;
                console.log(this.isVisible);
            }
            this.totalPage = Math.ceil(this.totalConts / this.pageSize); //количество страниц
            
            // начальные данные для отображения
            this.data = this.conts.slice(0, this.pageSize);//будет принимать 0-й элемент и оканчиваться на 5, но не включает 5-й элемент 
            this.endingRecord = this.pageSize; //первое количество записей которые отображены на экране


            this.error = undefined;
        }
        else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    //*метод чтобы скрыть кнопку Add Contact от юзера у котого нет доступа
    @wire (getTheBtnCreateIsHiddenDependingOnAccess)
    getTheBtnCreateIsHidden({error, data}){
        console.log(this.theBtnCreateIsHidden);
        if (data) {
            console.log(data);
            this.theBtnCreateIsHidden = true;
            console.log(this.theBtnCreateIsHidden);
        } else if (error) {
            this.error = error; 
            console.log(this.error);
        }
    };

    //*метод чтобы скрыть кнопку Edit от юзера у котого нет доступа
    @wire (getTheBtnEditIsHiddenDependingOnAccess)
    getTheBtnEditIsHidden({error, data}){
        console.log(this.theBtnEditIsHidden);
        if (data) {
            console.log(data);
            this.theBtnEditIsHidden = true;
            console.log(this.theBtnEditIsHidden);
        } else if (error) {
            this.error = error; 
            console.log(this.error);
        }
    };
    

       // *paginator

    //при нажатии на previous кнопку будет вызван этот метод
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //уменьшаем на 1 страницу
            this.displayRecordPerPage(this.page);
        }
    }
    //при нажатии на next кнопку будет вызван этот метод
    nextHandler() {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //увеличиваем на 1 страницу
            this.displayRecordPerPage(this.page);
        }
    }

    displayRecordPerPage(page) {
        this.startingRecord = ((page - 1) * this.pageSize); //на первой записи показано часть записей от заданого размера(в зависимоти от кол страниц)
        this.endingRecord = (this.pageSize * page); //на последней записи показано часть записей от заданого размера

        this.endingRecord = (this.endingRecord > this.totalConts)
            ? this.totalConts : this.endingRecord; //вычисляется условие: если оно истинно, тогда возвращается значение1, в противном случае – значение2

        this.data = this.conts.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1; // увеличиваем на 1, чтобы отобразить начальное количество записей 
    }


    handleChange(e) {
        // если поле имени пустое отображать ошибку
       if (!e.target.value) {
           e.target.reportValidity(); //Чтобы отображать сообщения об ошибках в недопустимых полях
           this.disabled = true; //активность/неактивность кнопки в зависимости от данных в инпуте
       }
       else {
           this.disabled = false;
       }

    //    if (e.target.name === "FirstName") {
    //     this.fName = e.target.value;
    //     console.log(this.fName);

    //   } else if (e.target.name === "LastName") {
    //     this.lName = e.target.value;
    //     console.log(this.lName);

    //   } else if (e.target.name === "Email") {
    //     this.email = e.target.value;
    //     console.log(this.email);

    //   } else if (e.target.name === "Phone") {
    //     this.phone = e.target.value;
    //     console.log(this.phone);

    //   } else if (e.target.name === "Title") {
    //     this.title = e.target.value;
    //     console.log(this.title);
    //   }
   }


    //*перейти на страницу редактирования

    handleClickEdit(event){
        this.showModal = true;
        this.btnSaveEdit = true;
        this.contId = event.target.dataset.recordid;
        console.log(this.contId);
        getContactById({contId: this.contId})
            .then(result => {
                console.log(result);
                this.fName = result.FirstName;
                console.log(this.fName);
                this.lName = result.LastName;
                this.email = result.Email;
                this.phone = result.Phone;
                this.title = result.Title;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
            });  
    }

    updateCont(event){
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputFields) => {
                inputFields.reportValidity();
                return validSoFar && inputFields.checkValidity();
            }, true);

        if (allValid) {
            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.contId;
            console.log(event.target.dataset.id);
            fields[FIRSTNAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='FirstName']").value;
            fields[LASTNAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='LastName']").value;
            fields[EMAIL_FIELD.fieldApiName] = this.template.querySelector("[data-field='Email']").value;
            fields[PHONE_FIELD.fieldApiName] = this.template.querySelector("[data-field='Phone']").value;
            fields[TITLE_FIELD.fieldApiName] = this.template.querySelector("[data-field='Title']").value;


            const recordInput = { fields };
            console.log(recordInput);

            updateRecord(recordInput) //Обновляет запись
                .then((record) => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated',
                            variant: 'success'
                        })
                    );
                    console.log(record);
                    this.showModal = false;
                    this.btnSaveEdit = false;
                    // recordInput.forEach(field=>{field.reset();});
                    return refreshApex(this.refreshTable);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            
            }
        else {
            // Если форма valid
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Something is wrong',
                    message: 'Check your input and try again.',
                    variant: 'error'
                })
             );
        }
    }

    // *создание нового контакта(Btn Add Contact)
    handleClickAdd() {
        this.showModal = true;
        this.btnSaveAdd = true;
        this.contId = null;
        this.fName = null;
        console.log(this.fName);
        this.lName = null;
        this.email = null;
        this.phone = null;
        this.title = null;
        console.log(this.contId);
    }        


    saveAddRecord(){//сохраняет запись
        const allValid = [...this.template.querySelectorAll('lightning-input')]
        .reduce((validSoFar, inputFields) => {
            inputFields.reportValidity();
            return validSoFar && inputFields.checkValidity();
        }, true);

        if (allValid) {
            this.fName = this.template.querySelector("[data-field='FirstName']").value;
            console.log(this.fName);
            this.lName = this.template.querySelector("[data-field='LastName']").value;
            this.email = this.template.querySelector("[data-field='Email']").value;
            this.phone = this.template.querySelector("[data-field='Phone']").value;
            this.title = this.template.querySelector("[data-field='Title']").value;

            getCreateNewContact({
                a_fName: this.fName,
                a_lName: this.lName,
                a_email: this.email,
                a_phone: this.phone,
                a_title: this.title
            })

            .then(result => {
                const event = new ShowToastEvent({
                    title: 'Contact created',
                    message: 'New Contact '+ this.fName +' '+ this.lName +' created.',
                    variant: 'success'
                });
                this.dispatchEvent(event);
                this.showModal = false;
                this.btnSaveAdd = false;
                console.log(this.conts);
                console.log(this.refreshTable);
                return refreshApex(this.refreshTable);
                
            })
            .catch((error) => {
                console.log(error);
                const event = new ShowToastEvent({
                    title : 'Error',
                    message : 'Error creating contact.',
                    variant : 'error'
                });
                this.dispatchEvent(event);
            });
        }
        else {
            // Если форма valid
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Something is wrong',
                    message: 'Check your input and try again.',
                    variant: 'error'
                })
            );
        }
        
    }
    
    //*закрытие модального окна
    customHideModalPopup() {
        this.showModal = false;
        this.btnSaveAdd = false;
        this.btnSaveEdit = false;
    }  
}
// editCont() {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standart__recordPage',
    //         attributes: {
    //             recordId: this.recordId,
    //             objectApiName: 'Contact',
    //             actionName: 'edit'
    //         }
    //     })
    // }
    // addCont() {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: 'Contact',
    //             actionName: 'new'
    //         },
    //     });
    // }