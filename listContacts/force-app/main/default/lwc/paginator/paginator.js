import { LightningElement } from 'lwc';

export default class Paginator extends LightningElement {
    // обьявляють что пользователь нажал кнопку(https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.events_create_dispatch)
    previousHandler() {
        this.dispatchEvent(new CustomEvent('previous')); 
    }

    nextHandler() {
        this.dispatchEvent(new CustomEvent('next'));
    }

}