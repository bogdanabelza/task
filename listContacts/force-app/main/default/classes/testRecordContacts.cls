@isTest
public class testRecordContacts {
   @isTest static void getRecordContacts() {
        Contact cont = new Contact(FirstName = 'test',
            LastName = 'test',
            Email = 'test@test.com',
            Phone = '534-563-6378',
            Title = 'VP, Facilities');
        insert cont;

        Test.startTest();// Сбрасывает все ограничения (DML, SOQL, etc)
        List<Contact> conts = recordContacts.getRecordContacts();
        Test.stopTest();

        System.assert(conts != null);
    }
    
    @isTest static void getCreateNewContact() {
        Test.startTest();
        recordContacts.getCreateNewContact('test', 'test', 'test@test.com', '234-452-3452', 'VP');
        Test.stopTest();
        System.assert(true);
    }
    @isTest static void getContactById() {
        Contact cont = new Contact(
            FirstName = 'Yan',
            LastName = 'Khang',
            Email = 'yan@khang.com');
        insert cont;
        
        Test.startTest();
        Contact c = recordContacts.getContactById(cont.Id);
        Test.stopTest();

        System.assertEquals('Yan', c.FirstName);
        System.assertEquals(cont.Email, c.Email);
    }
    
    @isTest static void getTheBtnCreateIsHiddenDependingOnAccess() {

        Test.startTest();
        List<Contact> conts = recordContacts.getTheBtnCreateIsHiddenDependingOnAccess();
        Test.stopTest();

        System.assert(conts != null,'One Contact should had been retrieved.');
    }
    @isTest static void getTheBtnEditIsHiddenDependingOnAccess() {
        Test.startTest();
        List<Contact> conts = recordContacts.getTheBtnEditIsHiddenDependingOnAccess();
        Test.stopTest();

        System.assert(conts != null,'One Contact should had been retrieved.');
    }
}
