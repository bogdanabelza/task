public with sharing class recordContacts {
    @AuraEnabled(cacheable = true)
    public static List<Contact> getRecordContacts() {
        List<Contact> conts = [SELECT Id, FirstName, LastName, Email, Phone, Title FROM Contact ORDER BY LastName];//в методе возращаем список контактов с указаными полями
        //System.debug(conts);
        SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, conts);
        //System.debug(conts);
        if(!conts.isEmpty()){
            conts = decision.getRecords();
            //System.debug(decision.getRecords());
        }
        else{
            throw new SecurityException('You don\'t have access to all contact fields required to use this API');
        }
        //System.debug(conts);
        return conts;
    }

    @AuraEnabled
    public static void getCreateNewContact(String a_fName, String a_lName, String a_email, String a_phone, String a_title) {
        try{
            List<Contact> conts = new List<Contact>();

            Contact cont = new Contact();
            cont.FirstName = a_fName;
            cont.LastName = a_lName;
            cont.Email = a_email;
            cont.Phone = a_phone;
            cont.Title = a_title;
            
            conts.add(cont);

            SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.CREATABLE, conts);

            insert securityDecision.getRecords();
        }
        catch(Exception ex){
            System.debug('An Exception: ' + ex);
        }
    }

    @AuraEnabled
    public static Contact getContactById(Id contId) {
        Contact cont;
        List<Contact> conts = [SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contact WHERE Id =:contId];
        SObjectAccessDecision decision = Security.stripInaccessible(AccessType.READABLE, conts);
        if(!conts.isEmpty()){
            cont = (Contact)decision.getRecords()[0];
        }
        else{
            throw new SecurityException('You don\'t have access to all contact fields required to use this API');
        }
        return cont;
    }

    @AuraEnabled(cacheable = true)
    public static List<Contact> getTheBtnCreateIsHiddenDependingOnAccess() {
        List<Contact> conts = [SELECT Id, FirstName, LastName, Email, Phone, Title FROM Contact LIMIT 1];
        //SObjectAccessDecision decision = Security.stripInaccessible(AccessType.UPDATABLE, conts);
        SObjectAccessDecision decision = Security.stripInaccessible(AccessType.CREATABLE, conts);
        conts = decision.getRecords();

        return conts;
    }

    @AuraEnabled(cacheable = true)
    public static List<Contact> getTheBtnEditIsHiddenDependingOnAccess() {
        List<Contact> conts = [SELECT Id, FirstName, LastName, Email, Phone, Title FROM Contact LIMIT 1];
        SObjectAccessDecision decision = Security.stripInaccessible(AccessType.UPDATABLE, conts);
        //SObjectAccessDecision decision = Security.stripInaccessible(AccessType.CREATABLE, conts);
        conts = decision.getRecords();

        return conts;
    }
        
    //если у пользователя нет доступа к созданию или обновлению контактов соответствующие кнопки скрыты
}
