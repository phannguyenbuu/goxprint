/** <pre>
 *-------------------------------------------------------------------------------

 *

 *-------------------------------------------------------------------------------
 * File: AjaxReqRespHandler.js?v=1659400467ta
 *-------------------------------------------------------------------------------
 * DESCRIPTION:
 * This JS class is used to validate the user and delegates to appropriate page.
 *
 * AUTHOR:        Tarkeshwar
 * PROJECT:		[TOPACCESS]
 *
 * Date Of Creation	: 02-AUG-2007
 * Version No.		: 1.0
 *-------------------------------------------------------------------------------
 * DEPENDENCIES
 *
 *-------------------------------------------------------------------------------
 * </pre>
 */

var AuthenUserStatusOfOpMap = {
    "STATUS_INVALID_INPUT"                     : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_INVALID_EMAILID"                   : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_OBJECT_EXISTS"                     : 'fnGetLocaleString("103523","User information is not found")',
    "STATUS_USER_NOT_FOUND"                    : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_PASSWORD_USERNAME"                 : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_PASSWORD_MISMATCHED"               : 'fnGetLocaleString("103659","The Password and Retyped Password fields do not match.")',
    "STATUS_PASSWORD_COMPANYNAME"              : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_PASSWORD_NO_PUNCTUATION_CHAR"      : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_PASSWORD_NO_ALPHANUMERIC_CHAR"     : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_PASSWORD_NO_NONALPHANUMERIC_CHAR"  : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_PASSWORD_REPEATED_CHARS"           : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_PASSWORD_REPEATED"                 : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_PASSWORD_MORE_MAXCHARS"            : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_INVALID_COMMAND_SCHEMA"            : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_PASSWORD_LESS_MINCHARS"            : 'fnGetLocaleString("103756","Password does not match the password policy.")',
    "STATUS_FAILED"                            : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_BAD_REQUEST"                       : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_INTERNAL_ERROR"                    : 'fnGetLocaleString("101399","Please enter valid password.")',
    "STATUS_USER_TOKEN_NOT_FOUND"              : 'fnGetLocaleString("103523","User information is not found")',
    "STATUS_USER_UNAUTHORIZED"                 : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_AUTH_PASSWORD_RESET"               : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_NO_PERMISSION"                     : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_INVALID_USERTOKEN"                 : 'fnGetLocaleString("103523","User information is not found")',
    "STATUS_AUTH_ACCOUNT_LOCKED"               : 'fnGetLocaleString("100108","Account has been locked. Contact the Administrator.")',
    "STATUS_AUTH_ACCOUNT_LOCKING_LOGIN_REFUSED": 'fnGetLocaleString("100108","Account has been locked. Contact the Administrator.")',
    "STATUS_AUTH_ACCOUNT_DISABLED"             : 'fnGetLocaleString("100108","Account has been locked. Contact the Administrator.")',
    "STATUS_AUTH_ACCOUNT_EXPIRED"              : 'fnGetLocaleString("103519","Account has been expired")',
    "STATUS_AUTH_INVALID_PERIOD"               : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_AUTH_NOT_FOUND_SERVER"             : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_AUTH_INVALID_REALM_NAME"           : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_AUTH_TIME_LAG_ERROR"               : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_AUTH_TICKET_EXPIRED"               : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_AUTH_TICKET_AUTH_FAILED"           : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_PASSWORD_EXPIRED"                  : 'fnGetLocaleString("103519","Account has been expired")',
    "STATUS_PASSWORD_POLICY_EXPIRED"           : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_WRONG_USER_CRED"                   : 'fnGetLocaleString("103519","Account has been expired")',
    "STATUS_UNKNOWN_ERROR"                     : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_FATAL_ERROR"                       : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")',
    "STATUS_ROLE_NOT_FOUND"                    : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_EMPTY_DOMAIN_NAME"                 : 'fnGetLocaleString("103519","Account has been expired")',
    "STATUS_UNDEFINED_AUTHENTICATION"          : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_EMPTY_AUTHENTICATION_MECHANISM"    : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_UNDEFINED_AUTHENTICATION_MECHANISM": 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_UNREGISTERED_DOMAIN_NAME"          : 'fnGetLocaleString("101865","The User Name and Password are not recognized.")',
    "STATUS_DB_CORRUPTED"                      : 'fnGetLocaleString("103472","Internal Error has occurred. Please try again.")', //fnGetLocaleString("DUMMYRESID","DataBase Corrupted"),
    "STATUS_BAD_OLD_PASSWORD"                  : 'fnGetLocaleString("101399","Please enter valid password.")', //fnGetLocaleString("DUMMYRESID","Incorrect Old Password")
    "STATUS_MULTI_BYTE_NOT_SUPPORTED_FOR_SERVICE_USER" :   'fnGetLocaleString("103756","Password does not match the password policy.")'
};

/**
 * Request for Login Authentication
 * @param userName
 * @param passwd
 */
var oldLoginMode;
var oldSecLevel;
var old9003Value;
var oldUserName;
var gblCalledFrom;

function setCookiesAfterRenewSession(){
    top.fnSetCookie("LOGINMODE",oldLoginMode);
    top.fnSetCookie("SECURITYLEVEL",oldSecLevel);
    top.fnTrackCookie("USERCRED","SET","USERNAME",oldUserName);
    top.fnTrackCookie("DiagnosticMode","SET","9003",old9003Value);
}

function getCookiesBeforeRenewSession(userName){
    oldLoginMode = top.fnGetCookie("LOGINMODE");
    oldSecLevel = top.fnGetCookie("SECURITYLEVEL");
    if(userName == "")
        userName = top.fnTrackCookie("USERCRED","GET","USERNAME");
    oldUserName = userName;
    old9003Value = top.fnTrackCookie("DiagnosticMode","GET","9003");
}

function setAuthenticateParams(userName, passwd, domain, deptCode, fromPwdReset) {
    try {
        var IPaddr = top.fnGetCookie("Session");
        if(IPaddr == "" || IPaddr == null){
            alert("Error : Could not retrieve client IP address.");
            return;
        }
        if(domain == "" || domain == null || domain == undefined) {
            domain ="<domainName></domainName>";
        } else {
            domain ="<domainName>"+fnConvertXMLEntities(domain)+"</domainName>";
        }
        IPaddr = IPaddr.substring(0,IPaddr.lastIndexOf("."));
        top.fnSetCookie("IgnoreSessionTimeout","0");

        if(!fromPwdReset){
            getCookiesBeforeRenewSession(userName);
        }


        if(deptCode == null) {
            gblSETRequestXMLArray = ["<Authentication><UserCredential><userName>"+fnConvertXMLEntities(userName)+"</userName><passwd>"+fnConvertXMLEntities(passwd)+"</passwd><ipaddress>"+IPaddr+"</ipaddress><DepartmentManagement isEnable='"+IsdeptEnable+"'><requireDepartment>"+RequiredDept+"</requireDepartment></DepartmentManagement>"+domain+"<applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication>"];
            glbContentWebServerCmdArray = ["<Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login>"];
        }
        else {
            gblSETRequestXMLArray = ["<Authentication><UserCredential><userName>"+fnConvertXMLEntities(userName)+"</userName><passwd>"+fnConvertXMLEntities(passwd)+"</passwd><ipaddress>"+IPaddr+"</ipaddress><DepartmentManagement isEnable='"+IsdeptEnable+"'><requireDepartment>"+RequiredDept+"</requireDepartment><Department><departmentCode>"+deptCode+"</departmentCode></Department></DepartmentManagement>"+domain+"<applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication>"];
            glbContentWebServerCmdArray = ["<Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login>"];
        }
        glbContentWebServerSaveSessionArray = ["<SessionInfo><Information><type>LoginPassword</type><data>"+fnConvertXMLEntities(passwd)+"</data></Information><Information><type>LoginUser</type><data>"+fnConvertXMLEntities(userName)+"</data></Information></SessionInfo>"];
        gblGETRequestXMLArray = ["<Authentication><UserCredential></UserCredential></Authentication>","<Panel><DiagnosticMode><Mode_08><Code_8913></Code_8913></Mode_08></DiagnosticMode></Panel>"];
        //gblGETRequestXMLArray = ["<Authentication><Status></Status><UserCredential></UserCredential></Authentication>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGETSCWS");
    } catch(e){errHandler(e,'setAuthenticateParams()','Authentication.js?v=1659400467ta',"")}

}
/**
 * Invoke for Admin and Admin's role to reset the admin information
 * @param emailId
 * @param passwd
 * @param repeatPasswd
 * @param secQues
 * @param secAns
 */
/*function updateUserAfterPasswordResetForAdmin(emailId, passwd, repeatPasswd,secQues, secAns,copierLang) {
    try {
        calledFromPage = "PasswordReset";
        gblSETRequestXMLArray = ["<UserManager><Users><User><Information><newPasswd>"+fnConvertXMLEntities(passwd)+"</newPasswd><repeatedPasswd>"+fnConvertXMLEntities(repeatPasswd)+"</repeatedPasswd><emailId>"+fnConvertXMLEntities(emailId)+"</emailId><copierLanguage>"+fnConvertXMLEntities(copierLang)+"</copierLanguage><Security><question>"+fnConvertXMLEntities(secQues)+"</question><answer>"+fnConvertXMLEntities(secAns)+"</answer></Security></Information></User></Users></UserManager>"];
        glbContentWebServerCmdArray = ["<UpdateUserAfterPasswordReset><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/Users/User</userDetails></Params></UpdateUserAfterPasswordReset>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMD");
    } catch(e){errHandler(e,'updateUserAfterPasswordResetForAdmin()','Authentication.js?v=1659400467ta',"")}

}
*//**
 * To update a selected user information.
 * @param passwd
 * @param emailId
 * @param repeatPasswd
 *//*
function updateUserAfterPasswordReset(emailId, passwd, repeatPasswd,copierLang) {
    try {
        calledFromPage = "PasswordReset";
        gblSETRequestXMLArray = ["<UserManager><Users><User><Information><newPasswd>"+fnConvertXMLEntities(passwd)+"</newPasswd><repeatedPasswd>"+fnConvertXMLEntities(repeatPasswd)+"</repeatedPasswd><emailId>"+fnConvertXMLEntities(emailId)+"</emailId><copierLanguage>"+fnConvertXMLEntities(copierLang)+"</copierLanguage></Information></User></Users></UserManager>"];
        glbContentWebServerCmdArray = ["<UpdateUserAfterPasswordReset><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/Users/User</userDetails></Params></UpdateUserAfterPasswordReset>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMD");
    } catch(e){errHandler(e,'updateUserAfterPasswordReset()','Authentication.js?v=1659400467ta',"")}
}*/
/*function updateUserAfterPasswordResetForAdmin(oldPasswd, passwd, repeatPasswd) {
    try {
        //calledFromPage = "PasswordReset";
        //calledFromPage = "ChangePassword";
        //var logStat = top.fnGetCookie("LOGINSTATUS");
        //updatePassword(oldPasswd,passwd,repeatPasswd);
        *//*if( logStat == "PasswordReset"){
            gblSETRequestXMLArray = ["<UserManager><Users><User><Information><newPasswd>"+fnConvertXMLEntities(passwd)+"</newPasswd><repeatedPasswd>"+fnConvertXMLEntities(repeatPasswd)+"</repeatedPasswd></Information></User></Users></UserManager>"];
            glbContentWebServerCmdArray = ["<UpdateUserAfterPasswordReset><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/Users/User</userDetails></Params></UpdateUserAfterPasswordReset>"];
            gblBoolHandleRespArray = [true];
            gblHashMapArray = [null];
            InitiateServerRequest("SETCMD");
        }else if(logStat == "PasswordExpired" || logStat == "PasswordPolicyExpired" ){
            updatePassword(oldPasswd,passwd,repeatPasswd);
        }*//*
    } catch(e){errHandler(e,'updateUserAfterPasswordResetForAdmin()','Authentication.js?v=1659400467ta',"")}

}*/
/**
 * To update a selected user information.
 * @param passwd
 * @param emailId
 * @param repeatPasswd
 */
/*function updateUserAfterPasswordReset(passwd, repeatPasswd) {
    try {
        calledFromPage = "PasswordReset";
        gblSETRequestXMLArray = ["<UserManager><Users><User><Information><newPasswd>"+fnConvertXMLEntities(passwd)+"</newPasswd><repeatedPasswd>"+fnConvertXMLEntities(repeatPasswd)+"</repeatedPasswd></Information></User></Users></UserManager>"];
        glbContentWebServerCmdArray = ["<UpdateUserAfterPasswordReset><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/Users/User</userDetails></Params></UpdateUserAfterPasswordReset>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMD");
    } catch(e){errHandler(e,'updateUserAfterPasswordReset()','Authentication.js?v=1659400467ta',"")}
}*/
/**
 *  To get Security Question corresponding User Name and Email Id
 * if user is in Administrator.
 * @param userName
 * @param emailid
 */
function fnGetLoginPwd(){
    try {
        calledFromPage = "GetLoginPassword";
        glbContentWebServerGetSessionArray = ["<SessionInfo><Information><type>LoginPassword</type><data></data></Information></SessionInfo>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("GCWS");
    } catch(e){errHandler(e,'fnGetLoginPwd()','Authentication.js?v=1659400467ta',"");}
}
function fnHandleGetLoginPassword(node){
    if(node == null){
        alert(fnGetLocaleString("103472","Internal Error has occurred. Please try again."));
        return;
    }
    var sts = getXpathValue(node,"statusOfOperation");
    if(sts != "STATUS_OK"){
        alert(fnGetLocaleString("103472","Internal Error has occurred. Please try again."));
        return;
    }
    var LgnPassword = getXpathValue(node,"SessionInfo/Information/data");
    //updateUserAfterPasswordResetForAdmin(LgnPassword, newPasswd, repeatedPasswd);
    //cmd UpdateUserAfterPasswordReset is removed from TA as per Terabe-san's mail (30-11-2010)
    //calledFromPage = "ChangePassword";
    updatePassword(LgnPassword,newPasswd,repeatedPasswd);
}
function forgotPassword(userName, emailid) {
    try {
        calledFromPage = "ForgotPasswrdEmail";
        gblSETRequestXMLArray = ["<UserManager><View><Users><Information><name>"+fnConvertXMLEntities(userName)+"</name><emailId>"+fnConvertXMLEntities(emailid)+"</emailId></Information></Users></View></UserManager>"];
        glbContentWebServerCmdArray = ["<ForgotPassword><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/View/Users</userDetails><cmdDetails commandType='Email'></cmdDetails></Params></ForgotPassword>"];
        gblGETRequestXMLArray = ["<UserManager><View><Users></Users></View></UserManager>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGET");
    } catch(e){errHandler(e,'forgotPassword()','Authentication.js?v=1659400467ta',"")}
}
/**
 * To get the information for creating a new password for Admin
 * @param userName
 * @param answer
 */
function forgotPwdSecAns(question,answer) {
    try {
        /*var userName=top.fnGetCookie("USERNAME");*/
        var userName=top.fnTrackCookie("USERCRED","GET","USERNAME");
        calledFromPage="ForgotPasswrdSecAns";
        gblSETRequestXMLArray = ["<UserManager><View><Users><Information><name>"+fnConvertXMLEntities(userName)+"</name><Security><question>"+fnConvertXMLEntities(question)+"</question><answer>"+fnConvertXMLEntities(answer)+"</answer></Security></Information></Users></View></UserManager>"];
        glbContentWebServerCmdArray = ["<ForgotPassword><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/View/Users</userDetails><cmdDetails commandType='SecAns'></cmdDetails></Params></ForgotPassword>"];
        gblGETRequestXMLArray = ["<UserManager><View><Users></Users></View></UserManager>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGET");
    } catch(e){errHandler(e,'forgotPwdSecAns()','Authentication.js?v=1659400467ta',"")}
}
/**
 * To create a new password for Forgotten paassword(Admin)
 * @param userName
 * @param pwd
 * @param confPwd
 */
function forgotPwdReset(pwd,confPwd){
    try {
        //alert("in forgotPwdReset")
        /*var userName=top.fnGetCookie("USERNAME");*/
        var userName=top.fnTrackCookie("USERCRED","GET","USERNAME");
        calledFromPage="ForgotPwdReset";
        gblSETRequestXMLArray = ["<UserManager><View><Users><User><Information><name>"+fnConvertXMLEntities(userName)+"</name><passwd>"+fnConvertXMLEntities(pwd)+"</passwd><repeatedPasswd>"+fnConvertXMLEntities(confPwd)+"</repeatedPasswd></Information></User></Users></View></UserManager>"];
        glbContentWebServerCmdArray = ["<ForgotPassword><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/View/Users/User</userDetails><cmdDetails commandType='Reset'></cmdDetails></Params></ForgotPassword>"];
        gblGETRequestXMLArray = ["<UserManager><View><Users></Users></View></UserManager>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGET");
    } catch(e){errHandler(e,'forgotPwdReset()','Authentication.js?v=1659400467ta',"")}
}

/**
 * request for password update
 * @param oldPasswd
 * @param newPasswd
 * @param repeatedPasswd
 */
function updatePassword(oldPasswd , newPasswd, repeatedPasswd ){
    try {
        calledFromPage="ChangePassword";
        // need department related info
        gblGETRequestXMLArray = ["<Controller><Settings><AdminSystemSettings><Authentication><deptManagement/><NeedDeptInfo/></Authentication></AdminSystemSettings></Settings></Controller>"];
        gblSETRequestXMLArray = ["<UserManager><View><Users><Information><passwd>"+fnConvertXMLEntities(oldPasswd)+"</passwd><newPasswd>"+fnConvertXMLEntities(newPasswd)+"</newPasswd><repeatedPasswd>"+fnConvertXMLEntities(repeatedPasswd)+"</repeatedPasswd></Information></Users></View></UserManager>"];
        glbContentWebServerCmdArray = ["<ChangePassword><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/View/Users</userDetails><cmdDetails contentType='Value'>Change</cmdDetails></Params></ChangePassword>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGET");
    } catch(e){errHandler(e,'updatePassword()','Authentication.js?v=1659400467ta',"")}
}
/**
 * Request to  update Secret Questions
 * @param userTokenId
 * @param secQues
 * @param secAns
 * @param emailId
 */
function updateUserSecretQuesAns(password, secQues, secAns) {
    try {
        //alert(" secQues "+secQues+ "  new secAns "+secAns);
        //var userName=top.fnGetCookie("USERNAME");
        calledFromPage="ChangeSecQuesAns";
        gblSETRequestXMLArray = ["<UserManager><View><Users><Information><passwd>"+fnConvertXMLEntities(password)+"</passwd><Security><question>"+fnConvertXMLEntities(secQues)+"</question><answer>"+fnConvertXMLEntities(secAns)+"</answer></Security></Information></Users></View></UserManager>"];
        glbContentWebServerCmdArray = ["<ChangeSecQuesAns><commandNode>UserManager/Users</commandNode><Params><userDetails contentType='XPath'>UserManager/View/Users</userDetails></Params></ChangeSecQuesAns>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMD");
    } catch(e){errHandler(e,'updateUserSecretQuesAns()','Authentication.js?v=1659400467ta',"")}

}
/**
 * For request for Logoff
 */
function unAuthenticateUser(logoutMode) {
    try {
        //alert("unAuthenticateUser ")
        glbContentWebServerCmdArray = ["<Logoff><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Logoff>"];
        gblGETRequestXMLArray = ["<Authentication><Status></Status></Authentication>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        if(logoutMode==null)
            calledFromPage = "LogoutUser";

        else if(logoutMode == "PwdResetLogoutUser_Efiling")
            calledFromPage = "PwdResetLogoutUser_Efiling";

        else if(logoutMode == "PwdResetLogoutUser")
            calledFromPage = "PwdResetLogoutUser";
        else
          calledFromPage = "LogoutUser_Efiling";
        InitiateServerRequest("CMDGET");
    } catch(e){errHandler(e,'unAuthenticateUser()','Authentication.js?v=1659400467ta',"")}
}
function getAuthenticationStatus(node) {
   try {

       setCookiesAfterRenewSession();

	   var arrPermissions=new Array();
       hideDivs("authimg_id");
       hideDivs("Deptauthimg_id");
       var main = fnGetClientCookie("pageTrack").split('=')[1];
       var status;       
       var statusOper = ((temp=getXpathValue(node,"statusOfOperation")) == null || temp == "")? "STATUS_FAILED" : temp;
       if(typeof DeptAuthEnable == "undefined" && statusOper != "STATUS_OK") {
           alert(fnGetLocaleString("103472","Internal Error has occurred. Please try again."));
           return;
       }

       switch(statusOper){
           case "STATUS_OK"                        :  status = "Authenticated"; //status = "PasswordReset";
               break;
           case "STATUS_AUTH_PASSWORD_RESET"       :  status = "PasswordReset";
               break;
           case "STATUS_AUTH_FORCED_PASSWORD_RESET":  status = "PasswordForcedReset" ;
               break;
           case "STATUS_PASSWORD_EXPIRED"          :  status = "PasswordExpired";
               break;
           case "STATUS_PASSWORD_POLICY_EXPIRED"   :  status = "PasswordPolicyExpired";
               break;
           case "STATUS_AUTH_INVALID_INPUT_DEPT"                  :
           case "STATUS_AUTH_INVALID_DEPT"                        :
           case "STATUS_NETWORK_NOT_READY"                        :
           case "STATUS_OBJECT_MAX_REACHED"                       :
           case "STATUS_AUTH_ACCOUNT_LOCKING_LOGIN_REFUSED"       :
           case "STATUS_AUTH_ACCOUNT_LOCKED"                      :  status = "AccountLocked";
                break;
           case "STATUS_NEED_TO_ADD_DEPT"                         :
               if(DeptAuthEnable == "DeptAuth")
                   status = "AccountLocked";
               else
                   status = "DepartmentRequired";
               break;
           case "STATUS_FAILED"                    :  status = "Unauthenticated";
               break;
           default                                 :  status = "Unauthenticated";
       }

       if (status == "Authenticated" || status == "PasswordReset"|| status == "PasswordExpired" || status == "PasswordPolicyExpired" || status == "PasswordForcedReset") {
           var role = "";
           var loginMode = top.fnGetCookie("LOGINMODE");
           var UserId = evaluateXpath(node,"User").getAttribute("ID");
           top.fnTrackCookie("USERCRED","SET","USERID",UserId);
           var rolesList = "";
           var roleName = "";
           var roleCount = 0;
           rolesList = node.getElementsByTagName("Role");
           if(status == "Authenticated" || status == "PasswordReset" || status == "PasswordForcedReset"){
               //As per SSDK, status == "PasswordExpired" || status == "PasswordPolicyExpired" 
               if(rolesList != undefined && rolesList.length > 0) {
                   for(var i=0;i<rolesList.length;i++){
                       roleName = getXpathValue(rolesList[i],"name");
                       if(roleName == null || roleName == "")
                           continue;
                       roleCount++;
                       role = role + roleName +gblRoleSep;
                   }
                   if(trim(role) == "" || roleCount == 0){
                       alert("Error!! Role(s) are empty in the response.Cannot proceed");
                       fnEnablePwdRstPageButtons();
                       return;
                   }
                   //role = role.substring(0,role.length-gblRoleSep.length);
                   role = gblRoleSep+role;
                   top.fnSetCookie("USERROLE",role);
               }else{
                   alert("Error!! Role(s) are empty in the response.Cannot proceed");
                   fnEnablePwdRstPageButtons();
                   return;
               }
           }
           top.fnSetCookie("SESSID","123456789");
           //TESTING

          //  if(top.fnGetCookie("TESTING") != 1)
           // status = "PasswordReset";
          // top.fnSetCookie("TESTING",1)
           if(status == "Authenticated"){
             // domainName=getXpathValue(node,"domainName");
             // Added on 14th May 2012 by Bijay  for STFR_12636 , for Admin user <domainNode> node is getting value as null which is converted into string so below check added.
               domainName=((temp=getXpathValue(node,"domainName"))==null || temp == "")?'' : temp;              
			   var permissionObj= node.getElementsByTagName("permission");
               var perLength  =permissionObj.length;
               for(var i=0; i<perLength;i++){
                    arrPermissions[i]=permissionObj[i].childNodes[0].nodeValue;
               }
				//alert("arrPermissions:"+arrPermissions);
               var pwdExpireVal = ((temp=getXpathValue(node,"Authentication/UserCredential/passwdExpiryDays"))==null || temp == "")?-1: parseInt(temp,10);
               var diaVal = ((temp=getXpathValue(node,"Panel/DiagnosticMode/Mode_08/Code_8913"))==null || temp == "")?-1: parseInt(temp,10);
               //alert("pwdExpireVal="+pwdExpireVal+" diaVal="+diaVal);
               //diaVal = 190;
               top.fnSetCookie("TAPERMISSIONS",arrPermissions.join(gblPermSepStr));
               top.fnSetCookie("DOMAINAME",domainName);
               top.fnSetCookie("IgnoreSessionTimeout","1");
               if(loginMode == "")
                   top.fnSetCookie("LOGINMODE","SECURED");
               if (role.indexOf(gblRoleSep+"Administrator"+gblRoleSep) != -1 || (main == "LOGS" && role.indexOf(gblRoleSep+"Auditor"+gblRoleSep) != -1)) {
                   
				   if(diaVal > 0 && pwdExpireVal != -1 && pwdExpireVal < diaVal){
                       if(confirm(fnGetLocaleString("102536","Password will expire in the following number of days: ")+pwdExpireVal+"\n"+fnGetLocaleString("102537","Do you change the password now?"))){
                           if(main == "EFILING"){
                               top.fnSetCookie("LOGINSTATUS","tmpEfilingPwdRst");
                               top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                           }else{
                               top.fnSetCookie("LOGINSTATUS","PasswordReset"); // Then only we get
                                top.fnSetClientCookie("pageTrack","MAIN=PWDRST");
                                top.location.reload();
                           }
                           return;
                       }
                   }
                   top.fnSetCookie("LOGINSTATUS",status);
                   if(main == "EFILING"){   // Bijay made CHanges for redirection of Efiling Page ..
                       top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                    }else {
                        top.fnSetClientCookie("pageTrack","MAIN=DEVICE");
                        top.location.replace(window.location.protocol + "//" + ((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1) ? (("[" + window.location.hostname + "]") + ((window.location.port != "") ? ":" + window.location.port : "" )) : window.location.host) + "/?MAIN=TOPACCESS");
                    }
               }else{
                   if(loginMode == "NORMAL"){
                       setValue("Login",' '+fnGetLocaleString("101083","Login")+' ');
                       window.document.frmLogin.elements["Login"].disabled=false;
                       window.document.frmLogin.elements["Cancel"].disabled=false;
                       top.fnSetCookie("USERROLE",null,-30);
                       top.fnSetCookie("SESSID",null,-30);
                       top.fnSetCookie("LOGINSTATUS",null,-30);
                       hideDivs("error");
                       if(calledFromPage == "AdminLogin") {
                           hideDivs("spaceRow");
                       }
                       showDivs("error_invalid_username");
                       if(main == "ADMIN"){
                           document.frmLogin.USERNAME.focus();
                       }else if(main == "USERMGMT"){
                           document.frmLogin.USRNAME.focus();
                       }
                   }
                   else{
                       //SECURE mode
                       if(diaVal > 0 && pwdExpireVal != -1 && pwdExpireVal < diaVal){
                           if(confirm(fnGetLocaleString("102536","Password will expire in the following number of days: ")+pwdExpireVal+"\n"+fnGetLocaleString("102537","Do you change the password now?"))){
                               if(main == "EFILING"){
                                   top.fnSetCookie("LOGINSTATUS","tmpEfilingPwdRst");
                                   top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                               }else{
                                   top.fnSetCookie("LOGINSTATUS","PasswordReset");
                                    top.fnSetClientCookie("pageTrack","MAIN=PWDRST");
                                    top.location.reload();
                               }
                               return;
                           }
                       }
                       top.fnSetCookie("LOGINSTATUS",status);
                       if(main == "EFILING"){
                          top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING"); 
                        }else {
                            top.fnSetClientCookie("pageTrack","MAIN=DEVICE");
                            top.location.replace(window.location.protocol + "//" + ((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1) ? (("[" + window.location.hostname + "]") + ((window.location.port != "") ? ":" + window.location.port : "" )) : window.location.host) + "/?MAIN=TOPACCESS");
                        }
                   }
               }

           } else if(status == "PasswordForcedReset"){
               domainName=((temp=getXpathValue(node,"domainName"))==null || temp == "")?'' : temp;
               top.fnSetCookie("DOMAINAME",domainName);
               top.fnSetCookie("IgnoreSessionTimeout","1");
               top.fnSetCookie("LOGINSTATUS",status);
               var permissionObj= node.getElementsByTagName("permission");
               var perLength  =permissionObj.length;
               for(var i=0; i<perLength;i++){
                    arrPermissions[i]=permissionObj[i].childNodes[0].nodeValue;
               }
               top.fnSetCookie("TAPERMISSIONS",arrPermissions.join(gblPermSepStr));
               if(loginMode == "" || loginMode == "SECURED"){
                   if(loginMode == ""){
                       top.fnSetCookie("LOGINMODE","SECURED");
                   }
                   if(main == "EFILING"){
                       top.fnSetCookie("LOGINSTATUS","tmpEfilingPwdRst");
                       top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                   }else{
                        top.fnSetClientCookie("pageTrack","MAIN=PWDRST");
                        top.location.reload();
                   }
               }else{
                   if(main == "EFILING"){
                       top.fnSetCookie("LOGINSTATUS","tmpEfilingPwdRst");
                       top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                   }else{
                        top.fnSetClientCookie("pageTrack","MAIN=PWDRST");
                        top.location.reload();
                   }
               }
           }else if (status == "PasswordReset" || status == "PasswordExpired" || status == "PasswordPolicyExpired" ) {
              // domainName=getXpathValue(node,"domainName");
               // Added on 14th May 2012 by Bijay  for STFR_12636 , for Admin user <domainNode> node is getting value as null which is converted into string so below check added.
               domainName=((temp=getXpathValue(node,"domainName"))==null || temp == "")?'' : temp;
               top.fnSetCookie("DOMAINAME",domainName);
               top.fnSetCookie("IgnoreSessionTimeout","1");
               top.fnSetCookie("LOGINSTATUS",status);
               if(loginMode == "" || loginMode == "SECURED"){
                   if(loginMode == ""){
                       top.fnSetCookie("LOGINMODE","SECURED");
                   }
                   if(main == "EFILING"){
                       top.fnSetCookie("LOGINSTATUS","tmpEfilingPwdRst");
                       top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                   }else{
                        top.fnSetClientCookie("pageTrack","MAIN=PWDRST");
                        top.location.reload();
                   }
               }else{
                   if(main == "EFILING"){
                       top.fnSetCookie("LOGINSTATUS","tmpEfilingPwdRst");
                       top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                   }else{
                        top.fnSetClientCookie("pageTrack","MAIN=PWDRST");
                        top.location.reload();
                   }
               }
           }
       } else if (status == "AccountLocked") {
           status = "Unauthenticated";
           top.fnSetCookie("LOGINSTATUS",status);
           setValue("Login",' '+fnGetLocaleString("101083","Login")+' ');
           window.document.frmLogin.elements["Login"].disabled=false;
           window.document.frmLogin.elements["Cancel"].disabled=false;
           window.document.frmLogin.elements["Enter"].disabled=false;
           window.document.frmLogin.elements["CancelDept"].disabled=false;

           if(DeptAuthEnable == "UserAuth") {
                document.frmLogin.PASS.value="";
                document.frmLogin.PASS.focus();
           }

           if(DeptAuthEnable == "DeptAuth") {
                document.frmLogin.DEPTCODE.value="";
                document.frmLogin.DEPTCODE.focus();
           }
           if((statusOper != "STATUS_AUTH_INVALID_INPUT_DEPT" && statusOper != "STATUS_NEED_TO_ADD_DEPT") && DeptAuthEnable == "DeptAuth") {
               hideDivs("LoginTopStringDeptID~DeptCodeID~DpetAuthBts");
               showDivs("LoginTopStringUsrID~UserNameID~PassWordID~domain_id~DeptAuthDummyRow~LoginBtnID~error");
               document.frmLogin.PASS.value="";
               document.frmLogin.PASS.focus();
           }
           // This errorcode is the plugin internal status.This can be changed at any time.
           if(document.getElementById("login_error_msg") != null){
               if(statusOper == "STATUS_AUTH_ACCOUNT_LOCKING_LOGIN_REFUSED"){
                    setValue("login_error_msg",fnGetLocaleString("100108","Account has been locked. Contact the Administrator."));
               } else if(statusOper == "STATUS_NETWORK_NOT_READY") {
                    setValue("login_error_msg",fnGetLocaleString("104250","Failed to connect to Authentication Server."));
               } else if(statusOper == "STATUS_OBJECT_MAX_REACHED") {
                    setValue("login_error_msg",fnGetLocaleString("104219","Failed to register user information automatically because the number for registration has already reached the maximum."));
               }else if(statusOper == "STATUS_AUTH_INVALID_DEPT") {
                    setValue("login_error_msg",fnGetLocaleString("101865","The User Name and Password are not recognized."));
               }else if(statusOper == "STATUS_AUTH_INVALID_INPUT_DEPT" || statusOper == "STATUS_NEED_TO_ADD_DEPT") {
                    setValue("login_error_msg",fnGetLocaleString("101391","Please enter a valid Department code"));
               }else{
                    setValue("login_error_msg",fnGetLocaleString("102577","User account is locked"));
               }
           }

           showDivs("error");
           if(calledFromPage == "AdminLogin") {
               hideDivs("spaceRow");
           }

           hideDivs("success");
           if(main == "ADMIN" || main == "USERMGMT")
               hideDivs("error_invalid_username");
       }else if (status == "DepartmentRequired") {
           hideDivs("LoginTopStringUsrID~UserNameID~PassWordID~domain_id~DeptAuthDummyRow~LoginBtnID~error");
           showDivs("LoginTopStringDeptID~DeptCodeID~DpetAuthBts");
           document.frmLogin.DEPTCODE.focus();
       }else if (status == "Unauthenticated") {
            if(DeptAuthEnable == "DeptAuth") {
               document.frmLogin.DEPTCODE.value="";
               hideDivs("LoginTopStringDeptID~DeptCodeID~DpetAuthBts");
               showDivs("LoginTopStringUsrID~UserNameID~PassWordID~domain_id~DeptAuthDummyRow~LoginBtnID~error");
               document.frmLogin.PASS.value="";
               document.frmLogin.PASS.focus();
           }
           top.fnSetCookie("LOGINSTATUS",status);
           setValue("Login",' '+fnGetLocaleString("101083","Login")+' ');
           window.document.frmLogin.elements["Login"].disabled=false;
           window.document.frmLogin.elements["Cancel"].disabled=false;
           window.document.frmLogin.elements["Enter"].disabled=false;
           window.document.frmLogin.elements["CancelDept"].disabled=false;

           if(DeptAuthEnable == "UserAuth") {
                document.frmLogin.PASS.value="";
                document.frmLogin.PASS.focus();
           }

           if(document.getElementById("login_error_msg") != null)
               setValue("login_error_msg",fnGetLocaleString("101865","The User Name and Password are not recognized."));

           showDivs("error");
           if(calledFromPage == "AdminLogin") {
               hideDivs("spaceRow");
           }
           hideDivs("success");
           if(main == "ADMIN" || main == "USERMGMT")
               hideDivs("error_invalid_username");
       }
   }catch(e){errHandler(e,'getAuthenticationStatus()','Authentication.js?v=1659400467ta',"")}

}
/**
 * This function has been used to handle the Password Reset status.
 * @param node
 */
var lgnUserName,lgnDomainName;   //Added as per new sequence i.e ChangePassword--STATUS_OK->LOGOFF--STATUS_OK->LOGIN CMD--STATUS_OK-->SHOW DEVICE/EFILING HOME PAGE
function fnnHandlePasswordReset(node){
    try{
       // hideDivs("authimg_id");
       // window.document.frmFirstLogin.elements["Enter"].disabled=false;
       // setValue("Enter",fnGetLocaleString("101610","Save"));
        var statusOper = (!node.getElementsByTagName("statusOfOperation")[0].hasChildNodes())? 0 : node.getElementsByTagName("statusOfOperation")[0].childNodes[0].nodeValue;
        if (statusOper == AuthStatusConstants["STATUS_OK"] || statusOper == 0|| statusOper == "0" ) {
            top.fnSetCookie("LOGINSTATUS","Updated");
            //top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=DEVICE");
            //calledFromPage = "AdminLogin";
            lgnUserName = top.fnTrackCookie("USERCRED","GET","USERNAME");
            lgnDomainName = top.fnGetCookie("DOMAINAME");
            if(getQueryStringValue("MAIN","top") == "EFILING"){
                //alert("efling="+top.fnTrackCookie("USERCRED","GET","USERNAME")+"  "+fnsTrim(getValue("PASSWORD"))+ "  "+top.fnGetCookie("DOMAINAME"));
                //setAuthenticateParams(top.fnTrackCookie("USERCRED","GET","USERNAME"), fnsTrim(getValue("PASSWORD")), top.fnGetCookie("DOMAINAME"),"EFILING");
                unAuthenticateUser("PwdResetLogoutUser_Efiling");
            }else{
                //alert("Topaccess="+top.fnTrackCookie("USERCRED","GET","USERNAME")+"  "+fnsTrim(getValue("PASSWORD"))+ "  "+top.fnGetCookie("DOMAINAME"));
                //setAuthenticateParams(top.fnTrackCookie("USERCRED","GET","USERNAME"), fnsTrim(getValue("PASSWORD")), top.fnGetCookie("DOMAINAME"),"TOPACCESS");
                unAuthenticateUser("PwdResetLogoutUser");
            }
        } else {
            fnEnablePwdRstPageButtons();
            var errMsg = eval(AuthenUserStatusOfOpMap[statusOper]);
            if(errMsg != null && errMsg !== undefined){
    		    document.getElementById("error_msg").innerHTML=errMsg;
                //setValue("error_msg",errMsg);
            }
            else if(statusOper == "STATUS_CANNOT_UPDATE_ON_SECONDARY_MFP")
            {
                var msg = fnGetLocaleString("1110691","Password changing is required, however it is prohibited by the Shared User Management.\nPlease contact the administrator.").replace(/\n/g,'<br/>');
                document.getElementById("error_msg").innerHTML = msg;
            }
            showDivs("error");
            if(calledFromPage == "PasswordReset") {
               hideDivs("spaceRow");
           }
            hideDivs("success");
        }
    }  catch(e) {errHandler(e,'fnnHandlePasswordReset','Authentication.js?v=1659400467ta', "")}
}
/**
 * This function has been used by Department to check
 * whether Admin password is correct or not.
 * @param node
 */
function getAuthDeptAdminStatus(node) {
    try {
        var statusOper = ((temp=getXpathValue(node,"statusOfOperation")) == null || temp == "")? "STATUS_FAILED" : temp;
        var status="";
        switch(statusOper){
            case "STATUS_OK"                        :  status = "Authenticated";
                break;
            case "STATUS_AUTH_PASSWORD_RESET"       :  status = "PasswordReset";
                break;
            case "STATUS_PASSWORD_EXPIRED"          :  status = "PasswordExpired";
                break;
            case "STATUS_PASSWORD_POLICY_EXPIRED"   :  status = "PasswordPolicyExpired";
                break;
            case "STATUS_AUTH_ACCOUNT_LOCKED"       :  status = "AccountLocked";
                break;
            case "STATUS_FAILED"                    :  status = "Unauthenticated";
                break;
            default                                 :  status = "Unauthenticated";
        }

        if(status == "Authenticated" ) {
            if(calledFromPage == "DeptAdmin"){
                location.href="DeparmentCounterAdminFrame.html?v=1659400467ta";
            }else if(calledFromPage=="DeptAdminTitle"){
                window.parent.location.href="DeparmentCounterAdminFrame.html?v=1659400467ta";
            }
        } else if (status == "PasswordReset" || status == "CreateAdmin" || status =="PasswordExpired" || status =="PasswordPolicyExpired") {
            alert("Please login through Panel and Reset the Password.");
        } else {
            if(calledFromPage == "DeptAdminTitle"){
                parent.location.href="DepartmentError.html?v=1659400467ta";
            } else {
                showDivs("error");
                hideDivs("success");
            }
        }
    } catch(e) {errHandler(e,'getAuthDeptAdminStatus','Authentication.js?v=1659400467ta', "")}
}

/**
 *  To get the Security Question for selected User and email
 * if he has admin role.
 * @param node
 */
function redirectAndGetSecurityQuestion (node) {
    try {
        window.document.frmLogin.elements["Login"].disabled=false;
        hideDivs("authimg_id");
        var status = (!node.getElementsByTagName("statusOfOperation")[0].hasChildNodes())? 0 : node.getElementsByTagName("statusOfOperation")[0].childNodes[0].nodeValue;
        if (status != 0 && status != "0" && status != "STATUS_OK"){
            top.fnSetCookie("SESSID","",-30);
            top.fnSetCookie("LOGINSTATUS","",-30);
            top.fnSetCookie("USERROLE","",-30);
            showDivs("error");
        } else {
            var isAdmin = getXpathValue(node,"isUserAdmin");
            if(isAdmin == "YES") {
                top.fnSetCookie("USERROLE",gblRoleSep+"Administrator"+gblRoleSep);
                var secQuesList = node.getElementsByTagName("question");
                if(secQuesList != undefined && secQuesList !=null && secQuesList.length > 0) {
                    var ques = (!node.getElementsByTagName("question")[0].hasChildNodes())? 0 : node.getElementsByTagName("question")[0].childNodes[0].nodeValue;
                    top.fnSetCookie("SECQUEST",ques);
                    /*top.fnSetCookie("USERNAME",document.frmLogin.USERNAME.value);*/
                    top.fnTrackCookie("USERCRED","SET","USERNAME",document.frmLogin.USERNAME.value);
                    location.href = '/Administration/SecretQuestion.html?v=1659400467ta';
                }
            } else if(isAdmin == "NO"){
                top.fnSetCookie("USERCRED","",-1);
                location.href = '/Administration/EmailNotify.html?v=1659400467ta';
            } else {
                showDivs("error");
            }
        }
    } catch(e){errHandler(e,'getSecurityQuestion()','Authentication.js?v=1659400467ta',"")}

}

/**
 * To get the status for create new password for User
 * if user has successfully been authenticated his sec answer.
 * Redirect for Create New Password for Admin or Admin role
 * @param node
 */
function redirectFromSecAns (node) {
    try {
        window.document.frmLogin.elements["Enter"].disabled=false;
        hideDivs("authimg_id");
        var status = (!node.getElementsByTagName("statusOfOperation")[0].hasChildNodes())? 0 : node.getElementsByTagName("statusOfOperation")[0].childNodes[0].nodeValue;
        if (status != 0 && status != "0" && status != "STATUS_OK"){
            showDivs("error");
            window.document.frmLogin.ANSWER.focus();
        } else {
            top.glbUserName = getValue("HiddenUserName");
            top.fnSetCookie("SECQUEST",null,-30);
            location.href = '/Administration/CreateNewPwd.html?v=1659400467ta';
        }
    } catch(e){errHandler(e,'redirectFromSecAns()','Authentication.js?v=1659400467ta',"")}
}
/***
 * Successfully password has been created for Admin or Admin' role
 * Redirect to loing page to login with new password
 * @param node
 */
function redirectFromSecReset (node) {
    try {
        window.document.frmLogin.elements["Enter"].disabled=false;
        hideDivs("authimg_id");
        var status = (!node.getElementsByTagName("statusOfOperation")[0].hasChildNodes())? 0 : node.getElementsByTagName("statusOfOperation")[0].childNodes[0].nodeValue;
        if (status != 0 && status != "0" && status != "STATUS_OK" ){
            document.frmLogin.Password.value="";
            document.frmLogin.ConfirmPwd.value="";
            document.frmLogin.Password.focus();
            showDivs("error");
        } else {
            hideDivs("error");
            top.fnSetCookie("SECQUEST","",-30);
            top.fnSetCookie("USERCRED","",-30);
            top.fnSetCookie("SESSID","",-30);
            top.fnSetCookie("LOGINSTATUS","",-30);
            top.fnSetCookie("USERROLE","",-30);
            top.fnSetClientCookie("pageTrack","MAIN=LOGIN");
            top.location.reload();
        }
    } catch(e){errHandler(e,'redirectFromSecAns()','Authentication.js?v=1659400467ta',"")}
}

/**
 * UnAuthenticated user Response Redirected by logout
 * @param node
 */
function redirectUnAuthenticationStatus(node) {
    try {
        var status = (!node.getElementsByTagName("statusOfOperation")[0].hasChildNodes())? 0 : node.getElementsByTagName("statusOfOperation")[0].childNodes[0].nodeValue;
        var main = getQueryStringValue("MAIN","top");
        top.fnSetCookie("ADDR_BOOK_REMOTE_PERM",null, -30);
        top.fnSetCookie("AddressBkPerm",null, -30);
        if (status == AuthStatusConstants["STATUS_OK"] || status == 0 || status == 6 || status=="STATUS_INVALID_USERTOKEN" || status == "STATUS_SESSION_FOLDER_NOT_EXISTS") {
            //status == 6 should be removed later after logoff command is properly working

            if(calledFromPage == "PwdResetLogoutUser" || calledFromPage == "PwdResetLogoutUser_Efiling")
                getCookiesBeforeRenewSession(fnConvertXMLEntities(lgnUserName));

            if(calledFromPage=="LogoutUser" || calledFromPage == "PwdResetLogoutUser"){
                var loginMode = top.fnGetCookie("LOGINMODE");
                var secLevel = top.fnGetCookie("SECURITYLEVEL");
                top.fnSetCookie("SESSID",null, -30);
                top.fnSetCookie("USERCRED",null, -30);
                top.fnSetCookie("LOGINSTATUS",null, -30);
                top.fnSetCookie("USERROLE",null, -30);
				top.fnSetCookie("LOGINMODE",null, -30);
                top.fnSetCookie("TAPERMISSIONS",null, -30);
                top.fnSetCookie("EFICtrlInstalled",null, -30);
                top.fnSetCookie("SECURITYLEVEL",null, -30);
                top.fnSetCookie("TA_SETTINGS",null, -30);
                top.fnSetCookie("LICENSE_SETTINGS",null, -30);
				top.fnSetCookie("DiagnosticMode",null, -30);
		        top.fnSetCookie("IgnoreSessionTimeout","0");
				//top.fnSetClientCookie("Session",null, -30,"/");
                
                if(calledFromPage == "PwdResetLogoutUser"){
                    top.fnTrackCookie("USERCRED","SET","USERNAME",lgnUserName);
                    top.fnSetCookie("SECURITYLEVEL",secLevel);
                    calledFromPage = "AdminLogin";
                    //setAuthenticateParams(fnConvertXMLEntities(lgnUserName),fnConvertXMLEntities(getValue("PASSWORD")),fnConvertXMLEntities(lgnDomainName));
                     setAuthenticateParams(lgnUserName,getValue("PASSWORD"),lgnDomainName,null,true);
                    //top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=LOGIN");
                    return;
                }
                top.fnSetClientCookie("Session",null, -30,"/");
                if(loginMode == "SECURED"){
                    top.fnSetClientCookie("pageTrack","MAIN=LOGIN");
                    top.location.reload();
                }
                else{
                    top.fnSetClientCookie("pageTrack","MAIN=DEVICE");
                    top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host));
                }
            }
            else if(calledFromPage == "LogoutUser_Efiling" || calledFromPage == "PwdResetLogoutUser_Efiling"){
                top.glLoginCancel="DONOTALERT";
                var loginMode = top.fnGetCookie("LOGINMODE");
                var secLevel = top.fnGetCookie("SECURITYLEVEL");
                top.fnSetCookie("SESSID",null, -30);
                top.fnSetCookie("USERCRED",null, -30);
                top.fnSetCookie("LOGINSTATUS",null, -30);
                top.fnSetCookie("USERROLE",null, -30);
                top.fnSetCookie("LOGINMODE",null, -30);
                top.fnSetCookie("TAPERMISSIONS",null, -30);
                top.fnSetCookie("EFICtrlInstalled",null, -30);
                top.fnSetCookie("SECURITYLEVEL",null, -30);
                top.fnSetCookie("TA_SETTINGS",null, -30);
                top.fnSetCookie("LICENSE_SETTINGS",null, -30);
                top.fnSetCookie("DiagnosticMode",null, -30);
                /*top.fnSetCookie("USERROLE",null, -30);
                top.fnSetCookie("LOGINMODE",null, -30);
                top.fnSetCookie("TA_SETTINGS",null, -30);
                top.fnSetCookie("LICENSE_SETTINGS",null, -30);*/
                top.fnSetCookie("SELECTEDITEM",null, -30);
                top.fnSetCookie("Box_Number",null, -30);
                top.fnSetCookie("Folder_Number",null, -30);
                top.fnSetCookie("Document_Name",null, -30);
                top.fnSetCookie("EDITOPR",null ,-30)
                top.fnSetCookie("TEMPVIEW","");
                // parent.opener.top.fnSetCookie("EFILINGSESSPERIOD",null, -30);
                 top.fnSetCookie("EFILINGSESSPERIOD",null, -30);
                // parent.opener.top.fnSetCookie("EFILINGSESSTIMER",null, -30);
                top.fnSetCookie("EFILINGSESSTIMER",null, -30);
                top.fnSetCookie("IgnoreSessionTimeout","0");
		if(calledFromPage == "PwdResetLogoutUser_Efiling"){
                    top.fnSetCookie("LOGINSTATUS","tmpEfilingLoginAfterPwdRst");
                    //top.fnSetClientCookie("Session",null, -30,"/");
                    top.fnSetCookie("SECURITYLEVEL",secLevel);
                    top.fnTrackCookie("USERCRED","SET","USERNAME",lgnUserName);
                    calledFromPage = "AdminLogin";
                   // setAuthenticateParams(fnConvertXMLEntities(lgnUserName),fnConvertXMLEntities(getValue("PASSWORD")),fnConvertXMLEntities(lgnDomainName));
                    setAuthenticateParams(lgnUserName,getValue("PASSWORD"),lgnDomainName,null,true);
                    //top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                    return;
                }
		top.fnSetClientCookie("COPYSESSID",null, -30,"/");
                top.fnSetClientCookie("Session",null, -30,"/");
                try{
                    //In Efiling-> Pwd reset page below div ids are not present. So, exception comes when cancel btn is clicked on the pwd reset page.So, try-catch is added
                    document.getElementById("Logout").style.display="none";
                    document.getElementById("Login").style.display="";
                    document.getElementById("Admin").style.display="none";
                    userRole="";
                    if(loginMode == "SECURED"){ // secure mode ..
                        // redirecting Efiling window.
                        top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                        // below code changed because of DTFR_10235: whenever logout clicked in efiling window TA should also get refreshed or redirect to TA login page.
                        var winopenerObj = window.top;
                        var winopenerObj_prev = window.top;
                        var isEfiling =false;
                        try{
                            while(winopenerObj.opener != null && typeof winopenerObj.top.gblTopWindow == 'undefined'){
                                if(winopenerObj.location.href.indexOf("?MAIN=EFILING") != -1 || winopenerObj.location.href.indexOf("/efiling/") != -1){ //winopenerObj.location.href.indexOf("/efiling/Efb.html?v=1659400467ta") != -1){
                                    isEfiling = true;
                                    break;
                                }
                                winopenerObj_prev = winopenerObj;
                                winopenerObj = winopenerObj.opener.top;
                            }
                        }catch(e){}
                        if(typeof winopenerObj.fnGetCookie == 'undefined'){    //  fnGetCookie function will be avialble on TopAcess window that is why we are checking for  "fnGetCookie", if it is not avilable then it is EfI window.
                            if(typeof winopenerObj_prev.fnGetCookie != 'undefined'){
                                winopenerObj = winopenerObj_prev;
                            }
                        }
                        var TAWindowObj = winopenerObj;
                        try{
                            if(TAWindowObj.opener != null){
                                while(TAWindowObj.opener != null && typeof TAWindowObj.top.gblTopWindow == 'undefined'){
                                    TAWindowObj = TAWindowObj.opener.top;
                                }
                            }
                            else{
                                return;
                            }
                        }catch(e){}
                        // Redirecting and refresh to TopAccess
                        top.fnSetClientCookie("pageTrack","MAIN=LOGIN");
                        TAWindowObj.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=TOPACCESS");


                    }else{  // Normal Mode ..
                        fnnTabClick("Doc");
                        var winopenerObj = window.top;
                        var winopenerObj_prev = window.top;
                        var isEfiling =false;
                        try{
                            while(winopenerObj.opener != null && typeof winopenerObj.top.gblTopWindow == 'undefined'){
                                if(winopenerObj.location.href.indexOf("?MAIN=EFILING") != -1 || winopenerObj.location.href.indexOf("/efiling/") != -1){ //winopenerObj.location.href.indexOf("/efiling/Efb.html?v=1659400467ta") != -1){
                                    isEfiling = true;
                                    break;
                                }
                                winopenerObj_prev = winopenerObj;
                                winopenerObj = winopenerObj.opener.top;
                            }
                        }catch(e){}
                        if(typeof winopenerObj.fnGetCookie == 'undefined'){    //  fnGetCookie function will be avialble on TopAcess window that is why we are checking for  "fnGetCookie", if it is not avilable then it is EfI window.
                            if(typeof winopenerObj_prev.fnGetCookie != 'undefined'){
                                winopenerObj = winopenerObj_prev;
                            }
                        }
                        var TAWindowObj = winopenerObj;
                        try{
                            while(TAWindowObj.opener != null && typeof TAWindowObj.top.gblTopWindow == 'undefined'){
                                TAWindowObj = TAWindowObj.opener.top;
                            }
                        }catch(e){}
                        // Redirecting and refresh to TopAccess
                        TAWindowObj.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=TOPACCESS");
                    }
                }catch(e){
                    top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=EFILING");
                }
            }
        } else {
            fnEnablePwdRstPageButtons();
            alert("Logout not successfull");
        }
    } catch(e){errHandler(e,'redirectUnAuthenticationStatus()','Authentication.js?v=1659400467ta',"")}
}
/**
 *   This function has been used by E-filing.
 * After Authentication, return the status.
 * @param node
 */

function getAuthEfilingAdminStatus(node) {
    try {

		var arrPermissions=new Array();
        hideDivs("authimg_id");

        var isHttps;

        if((window.location.protocol).indexOf("https") == -1){
            isHttps = false;
        }
        else
            isHttps = true;

        top.fnSetClientCookie("COPYSESSID",fnGetCookie("Session"),30,null,null,isHttps);

        setCookiesAfterRenewSession();

        // var statusOper = (!node.getElementsByTagName("statusOfOperation")[0].hasChildNodes())? 0 : node.getElementsByTagName("statusOfOperation")[0].childNodes[0].nodeValue;
		var status;
		var statusOper = ((temp=getXpathValue(node,"statusOfOperation")) == null || temp == "")? "STATUS_FAILED" : temp;
        //alert(statusOper)
        switch(statusOper){
           case "STATUS_OK"                        :  status = "Authenticated";
               break;
           case "STATUS_AUTH_PASSWORD_RESET"       :  status = "PasswordReset";
               break;
           case "STATUS_PASSWORD_EXPIRED"          :  status = "PasswordExpired";
               break;
           case "STATUS_PASSWORD_POLICY_EXPIRED"   :  status = "PasswordPolicyExpired";
               break;
           case "STATUS_AUTH_ACCOUNT_LOCKED"       :  status = "AccountLocked";
               break;
           case "STATUS_FAILED"                    :  status = "Unauthenticated";
               break;
           case "STATUS_WRONG_USER_CRED"           :  status = "WrongPasswordDetails";
              break;
           case "STATUS_AUTH_FORCED_PASSWORD_RESET":  status = "PasswordForcedReset" ;
               break;  
           default                                 :  status = "Unauthenticated";
       }
        if (statusOper == AuthStatusConstants["STATUS_OK"] || statusOper == 0|| statusOper == "0" ) {
            var role = "";
            var token = "";
            var loginMode = top.fnGetCookie("LOGINMODE");
            var rolesList = node.getElementsByTagName("Role");
            var roleName = "";
            var roleCount = 0;
            if(rolesList != undefined && rolesList.length > 0) {
                for(var i=0;i<rolesList.length;i++){
                    roleName = getXpathValue(rolesList[i],"name");
                    if(roleName == null || roleName == "")
                        continue;
                    roleCount++;
                    role = role + roleName +gblRoleSep;
                }
                if(trim(role) == ""|| roleCount == 0){
                    alert("Error!! Role(s) are empty.Cannot proceed");
                    return;
                }
                //  role = role.substring(0,role.length-1);
                //  role = gblRoleSep+role+gblRoleSep;
                role = gblRoleSep+role;
                top.fnSetCookie("USERROLE",role);
            }else{
                alert("Error!! Role(s) are empty.Cannot proceed");
                return;
            }
            /*var tokenList = node.getElementsByTagName("userTokenId");
             if(tokenList != undefined && tokenList.length > 0) {
             token = (!node.getElementsByTagName("userTokenId")[0].hasChildNodes())? 0 : node.getElementsByTagName("userTokenId")[0].childNodes[0].nodeValue;
             if(token != 0 && token != '0') {
             top.fnSetCookie("SESSID",token);
             }
             }*/
            top.fnSetCookie("SESSID","123456789");
            if(status == "Authenticated" ) {
              //  domainName=getXpathValue(node,"domainName");
              // Added on 14th May 2012 by Bijay  for STFR_12636 , for Admin user <domainNode> node is getting value as null which is converted into string so below check added.
               domainName=((temp=getXpathValue(node,"domainName"))==null || temp == "")?'' : temp;         
                var permissionObj= node.getElementsByTagName("permission");
                var perLength  =permissionObj.length;
                for(var i=0; i<perLength;i++){
                    arrPermissions[i]=permissionObj[i].childNodes[0].nodeValue;
                }
                //alert("arrPermissions:"+arrPermissions);
                top.fnSetCookie("TAPERMISSIONS",arrPermissions);
                top.fnSetCookie("DOMAINAME",domainName);
                top.fnSetCookie("IgnoreSessionTimeout","1");
                if(loginMode == "")
                    top.fnSetCookie("LOGINMODE","SECURED");
                if (role.indexOf(gblRoleSep+"Administrator"+gblRoleSep) != -1) {
                    top.fnSetCookie("LOGINSTATUS",status);
                    top.fnTrackCookie("USERCRED","SET","USERNAME","Admin");
                    parent.login.location.replace("EraseData.html?v=1659400467ta");
                    return;
                }
                else{
                    //SECURE mode
                    window.document.forms[0].elements["ADMPWD"].value = "";
                    window.document.forms[0].elements["ADMPWD"].focus();
                    setValue("Login",fnGetLocaleString("101083","Login"));
                    window.document.forms[0].elements["Login"].disabled=false;
                    showDivs("error");
                    setValue("efiling_Login_error_msg",fnGetLocaleString("101398","Please enter valid Password."));
                }
            } else if(status == "AccountLocked") {
                status = "Unauthenticated";
                top.fnSetCookie("LOGINSTATUS",status);
                setValue("Login","Login");
                window.document.forms[0].elements["ADMPWD"].value = "";
                window.document.forms[0].elements["ADMPWD"].focus();
                setValue("Login",fnGetLocaleString("101083","Login"));
                window.document.forms[0].elements["Login"].disabled=false;
                showDivs("error");
                setValue("efiling_Login_error_msg",fnGetLocaleString("102577","User account is locked"));
            }else if(status == "PasswordExpired") {
                status = "Unauthenticated";
                top.fnSetCookie("LOGINSTATUS",status);
                setValue("Login","Login");
                window.document.forms[0].elements["ADMPWD"].value = "";
                window.document.forms[0].elements["ADMPWD"].focus();
                setValue("Login",fnGetLocaleString("101083","Login"));
                window.document.forms[0].elements["Login"].disabled=false;
                showDivs("error");
                setValue("efiling_Login_error_msg",fnGetLocaleString("103520 ","Password has been expired"));
            } else if(status == "PasswordPolicyExpired") {
                status = "Unauthenticated";
                top.fnSetCookie("LOGINSTATUS",status);
                setValue("Login","Login");
                window.document.forms[0].elements["ADMPWD"].value = "";
                window.document.forms[0].elements["ADMPWD"].focus();
                setValue("Login",fnGetLocaleString("101083","Login"));
                window.document.forms[0].elements["Login"].disabled=false;
                showDivs("error");
                setValue("efiling_Login_error_msg",fnGetLocaleString("101865","The User Name and Password are not recognized."));
            }else if(status == "PasswordReset") {
                status = "Unauthenticated";
                top.fnSetCookie("LOGINSTATUS",status);
                setValue("Login","Login");
                window.document.forms[0].elements["ADMPWD"].value = "";
                window.document.forms[0].elements["ADMPWD"].focus();
                setValue("Login",fnGetLocaleString("101083","Login"));
                window.document.forms[0].elements["Login"].disabled=false;
                showDivs("error");
                setValue("efiling_Login_error_msg",fnGetLocaleString("103472","Internal Error has occurred. Please try again."));
            }else if(status == "PasswordForcedReset") {
                status = "Unauthenticated";
                top.fnSetCookie("LOGINSTATUS",status);
                setValue("Login","Login");
                window.document.forms[0].elements["ADMPWD"].value = "";
                window.document.forms[0].elements["ADMPWD"].focus();
                setValue("Login",fnGetLocaleString("101083","Login"));
                window.document.forms[0].elements["Login"].disabled=false;
                showDivs("error");
                setValue("efiling_Login_error_msg",fnGetLocaleString("101865","The User Name and Password are not recognized."));
            }else if(status == "WrongPasswordDetails") {
                status = "Unauthenticated";
                top.fnSetCookie("LOGINSTATUS",status);
                setValue("Login","Login");
                window.document.forms[0].elements["ADMPWD"].value = "";
                window.document.forms[0].elements["ADMPWD"].focus();
                setValue("Login",fnGetLocaleString("101083","Login"));
                window.document.forms[0].elements["Login"].disabled=false;
                alert(fnGetLocaleString("101398","Please enter valid Password"));
                return;
            }
            else{
                window.document.forms[0].elements["ADMPWD"].value = "";
                window.document.forms[0].elements["ADMPWD"].focus();
                setValue("Login",fnGetLocaleString("101083","Login"));
                window.document.forms[0].elements["Login"].disabled=false;
                showDivs("error");
                setValue("efiling_Login_error_msg",fnGetLocaleString("103472","Internal Error has occurred. Please try again."));

            }
            // } // authenticationStatus Checking ..
        } else if(status == "AccountLocked") {
            status = "Unauthenticated";
            top.fnSetCookie("LOGINSTATUS",status);
            setValue("Login","Login");
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login",fnGetLocaleString("101083","Login"));
            window.document.forms[0].elements["Login"].disabled=false;
            showDivs("error");
            setValue("efiling_Login_error_msg",fnGetLocaleString("102577","User account is locked"));
        }else if(status == "PasswordExpired") {
            status = "Unauthenticated";
            top.fnSetCookie("LOGINSTATUS",status);
            setValue("Login","Login");
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login",fnGetLocaleString("101083","Login"));
            window.document.forms[0].elements["Login"].disabled=false;
            showDivs("error");
            setValue("efiling_Login_error_msg",fnGetLocaleString("103520 ","Password has been expired"));
        } else if(status == "PasswordPolicyExpired") {
            status = "Unauthenticated";
            top.fnSetCookie("LOGINSTATUS",status);
            setValue("Login","Login");
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login",fnGetLocaleString("101083","Login"));
            window.document.forms[0].elements["Login"].disabled=false;
            showDivs("error");
            setValue("efiling_Login_error_msg",fnGetLocaleString("101865","The User Name and Password are not recognized."));
        }else if(status == "PasswordReset") {
            status = "Unauthenticated";
            top.fnSetCookie("LOGINSTATUS",status);
            setValue("Login","Login");
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login",fnGetLocaleString("101083","Login"));
            window.document.forms[0].elements["Login"].disabled=false;
            showDivs("error");
            setValue("efiling_Login_error_msg",fnGetLocaleString("103472","Internal Error has occurred. Please try again."));
        }else if(status == "PasswordForcedReset") {
            status = "Unauthenticated";
            top.fnSetCookie("LOGINSTATUS",status);
            setValue("Login","Login");
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login",fnGetLocaleString("101083","Login"));
            window.document.forms[0].elements["Login"].disabled=false;
            showDivs("error");
            setValue("efiling_Login_error_msg",fnGetLocaleString("101865","The User Name and Password are not recognized."));
        }
        else if(status == "WrongPasswordDetails") {
            status = "Unauthenticated";
            top.fnSetCookie("LOGINSTATUS",status);
            setValue("Login","Login");
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login",fnGetLocaleString("101083","Login"));
            window.document.forms[0].elements["Login"].disabled=false;
            alert(fnGetLocaleString("101398","Please enter valid Password"));
            return;
        }
        else{
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login",fnGetLocaleString("101083","Login"));
            window.document.forms[0].elements["Login"].disabled=false;
            showDivs("error");
            setValue("efiling_Login_error_msg",fnGetLocaleString("103472","Internal Error has occurred. Please try again."));
        }
    }catch(e){errHandler(e,'getAuthEfilingAdminStatus()','Authentication.js?v=1659400467ta',"");}
 }


/*function getAuthEfilingAdminStatus(node) {
    hideDivs("authimg_id");
    var authenticationStatus = node.getElementsByTagName("authenticationStatus") ;
    if( authenticationStatus != undefined && authenticationStatus.length > 0){
        var status = (!node.getElementsByTagName("authenticationStatus")[0].hasChildNodes())? 0 : node.getElementsByTagName("authenticationStatus")[0].childNodes[0].nodeValue;
        if(status == "Authenticated" ) {
            parent.parent.topframe.fnSetCookie("EFILINGLOGINSTATUS",status);
            parent.login.location.href = "EraseData.html?v=1659400467ta"
            return;

        } else if (status =="PasswordReset" || status =="PasswordExpired" || status =="PasswordPolicyExpired" || status == "CreateAdmin") {
            alert("Please login through Panel and Reset the Password.");
            return;
        } else {
            window.document.forms[0].elements["ADMPWD"].value = "";
            window.document.forms[0].elements["ADMPWD"].focus();
            setValue("Login","Login");
            window.document.forms[0].elements["Login"].disabled=false;
            showDivs("error");
            hideDivs("success");

        }
    }
}*/

/**
 * This function has been used by My Account
 * for Change Secret Question and Password
 * @param node
 */

function getAuthStatusForChangePWDSecret(node) {
    try {
        var pageTrackValue = top.fnGetClientCookie("pageTrack");
        var tabId = pageTrackValue.split("&")[0].split("=")[1];
        if(tabId == "PWDRST" || getQueryStringValue("MAIN","top") == "EFILING"){
            // below variables are need for Password reset and internal Authentication.
            IsdeptEnable=(((temp =getXpathValue(node,"Controller/Settings/AdminSystemSettings/Authentication/deptManagement")) == "" || temp == null)?  '' : temp);
            RequiredDept=(((temp =getXpathValue(node,"Controller/Settings/AdminSystemSettings/Authentication/NeedDeptInfo")) == "" || temp == null)?  '' : temp);
            fnnHandlePasswordReset(node);
        }else{
            var status = (!node.getElementsByTagName("statusOfOperation")[0].hasChildNodes())? 0 : node.getElementsByTagName("statusOfOperation")[0].childNodes[0].nodeValue;
            //alert("alert(getAuthStatusForChangePWDSecret) status "+status);
            //setValue("Save","Save");
            //window.document.forms[0].elements["Save"].disabled=false;
            if (status != 0 && status != "0" &&status != "STATUS_OK"){
                var errMsg = eval(AuthenUserStatusOfOpMap[status]);
                if(errMsg != null && errMsg !== undefined){
                    document.getElementById("errorMsg").innerHTML= errMsg;
                    showDivs("errorID");
                }else{
                    showDivs("errorID");
                }

            } else {
                /*if( calledFromPage =="ChangePassword") {
                 alert("Your password has been changed.");
                 } else {
                 alert("Your secret question has been changed");
                 }*/
                opener.fnrefreshParent();
                self.close();
            }
        }
    } catch(e){errHandler(e,'getAuthStatusForChangePWDSecret()','Authentication.js?v=1659400467ta',"")}
}



/*********************************** Not in Use **********************************/

/**
 * To get the user details.
 * @param userTokenId
 */
function getUserCredential(userTokenId) {
    try {
        gblSETRequestXMLArray = ["<Authentication><UserCredential><userTokenId>"+fnConvertXMLEntities(userTokenId)+"</userTokenId></UserCredential></Authentication>"];
        glbContentWebServerCmdArray = ["<GetUserCredential><commandNode>Authentication/UserCredential</commandNode></GetUserCredential>"];
        gblGETRequestXMLArray = ["<Authentication><UserCredential></UserCredential></Authentication>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGET");

    } catch(e) {errHandler(e,"GetUserCredential()", "Authentication.js?v=1659400467ta","")}
}

/**
 * To create a new user
 * @param userName
 * @param passwd
 * @param emailId
 * @param role
 */
function createUser(userName, passwd, emailId, role) {
    try {                                                                                                                                     //role/role
        gblSETRequestXMLArray = ["<Authentication><UserCredential><userName>"+fnConvertXMLEntities(userName)+"</userName><passwd>"+fnConvertXMLEntities(passwd)+"</passwd><emailId>"+fnConvertXMLEntities(emailId)+"</emailId><Roles><role>"+fnConvertXMLEntities(role)+"</role></Roles></UserCredential></Authentication>"];
        glbContentWebServerCmdArray = ["<CreateUser><commandNode>Authentication/UserCredential</commandNode></CreateUser>"];
        gblGETRequestXMLArray = ["<Authentication><Status><userManagementStatus></userManagementStatus></Status></Authentication>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGET");
    } catch(e){errHandler(e,'createUser()','Authentication.js?v=1659400467ta',"")}

}


/**
 *
 * @param userName
 * @param passwd
 */
function authenticate(userName, passwd) {
    try {
        gblSETRequestXMLArray = ["<Authentication><UserCredential><userName>"+fnConvertXMLEntities(userName)+"</userName><passwd>"+fnConvertXMLEntities(passwd)+"</passwd></UserCredential></Authentication>"];
        glbContentWebServerCmdArray = ["<Authenticate><commandNode>Authentication/UserCredential</commandNode></Authenticate>"];
        gblGETRequestXMLArray = ["<Authentication><Status><authenticationStatus></authenticationStatus></Status></Authentication>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("SETCMDGET");
    } catch(e){errHandler(e,'authenticate()','Authentication.js?v=1659400467ta',"")}

}
/**
 * This method has been used for default Security DatabaseInitialization
 */
function defaultSecurityDatabaseInitialization() {
    try {
        glbContentWebServerCmdArray = ["<Authenticate><commandNode>Authentication/UserCredential</commandNode></Authenticate>"];
        gblGETRequestXMLArray = ["<Authentication><Status><databaseInitializationStatus></databaseInitializationStatus></Status></Authentication>"];
        gblBoolHandleRespArray = [true];
        gblHashMapArray = [null];
        InitiateServerRequest("CMDGET");
    } catch(e){errHandler(e,'defaultSecurityDatabaseInitialization()','Authentication.js?v=1659400467ta',"")}

}
/*
    This function is used for SMTP Authentication for Box To Email.

 */
 function fnnSMTPAutenticate(smtpUser,smtpPassword,ServerReqType){
     try {
             if( ServerReqType == "SETCMDGET"){
                gblSETRequestXMLArray = ["<Queues><Scan><WorkflowExecutionParameter><DocumentStore><Output><EmailSend><EmailSendParameter><SMTPServerInformation><SMTPLoginName>"+fnConvertXMLEntities(smtpUser)+"</SMTPLoginName><SMTPLoginPassword>"+fnConvertXMLEntities(smtpPassword)+"</SMTPLoginPassword></SMTPServerInformation></EmailSendParameter></EmailSend></Output></DocumentStore></WorkflowExecutionParameter></Scan></Queues>","<Authentication><UserCredential><userName>"+fnConvertXMLEntities(smtpUser)+"</userName><passwd>"+fnConvertXMLEntities(smtpPassword)+"</passwd><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication>"];
             }else{
                gblSETRequestXMLArray = null; 
             }
             glbContentWebServerCmdArray = ["<AuthenticateSmtpOrLdap><commandNode>Authentication/UserCredential</commandNode></AuthenticateSmtpOrLdap>"];
            // gblGETRequestXMLArray = ["<Authentication><Status><specialAuthenticationStatus></specialAuthenticationStatus></Status></Authentication>"];
             gblGETRequestXMLArray = ["<Authentication></Authentication>"];
             gblBoolHandleRespArray = [true];
             gblHashMapArray = [null];
             if(ServerReqType == "SETCMDGET"){
                 calledFromPage="SMTPLogin_BoxToEmail";
                InitiateServerRequest("SETCMDGET");
             }
             else{
                 calledFromPage="SMTPInternalLogin_BoxToEmail";
                InitiateServerRequest(ServerReqType);
             }
         } catch(e){errHandler(e,'fnnSMTPAutenticate()','Authentication.js?v=1659400467ta',"");}

}
function fnEnablePwdRstPageButtons(){
    try{
        //below 3 statements work only in case of Pwd reset->logincase. For normal login this gives exception and handled immediately
        hideDivs("authimg_id");
        window.document.frmFirstLogin.elements["Enter"].disabled=false;
        setValue("Enter",fnGetLocaleString("101610","Save"));
    }catch(e){}
}
function getAuthSettingsForSyncUser(calledFrom){
	gblCalledFrom = calledFrom;
	glbContentWebServerCmdArray = ["<GetSettings><commandNode>Authentication/AuthenticationSettings</commandNode></GetSettings>"];
    gblGETRequestXMLArray = ["<Authentication><AuthenticationSettings><openAccess></openAccess><AuthenticationType><authenticationName></authenticationName></AuthenticationType><UserSyncSetting><SyncronizationType></SyncronizationType></UserSyncSetting></AuthenticationSettings></Authentication>"];
    gblBoolHandleRespArray = [true];
    gblHashMapArray = [null];
    calledFromPage="GetAuthInfo";
    InitiateServerRequest("CMDGET");
}
function fnDisplaySyncButton(xmlObj){
    var authObj = evaluateXpath(xmlObj,"Authentication/AuthenticationSettings");
    var UserAuth = ((temp =getXpathValue(authObj, "openAccess")) == "" || temp == null)?  '' : temp; // 1 means auth enabled and 0 means auth disabled
    var UserAuthType = getXpathValue(authObj, "AuthenticationType/authenticationName");
    var SharedUserMgt = getXpathValue(authObj, "UserSyncSetting/SyncronizationType");
    if(UserAuth == "1" && UserAuthType == "Local")
    {
        if(SharedUserMgt == "Master") {
            top.gblIsMasterMFP = true;
            top.gblIsSlaveMFP = false;
        }
        else if(SharedUserMgt == "Slave") {
            top.gblIsSlaveMFP = true;
            top.gblIsMasterMFP = false;
        }			
        else{
            top.gblIsMasterMFP = false;
            top.gblIsSlaveMFP = false;
        }
    }
    else{
        top.gblIsMasterMFP = false;
        top.gblIsSlaveMFP = false;
    }
	if(gblCalledFrom == "USERMGMT")
		parent.SubMenu.location.href = "/usermanagement/UserMgmtSubMenu.html?v=1659400467ta";
	else if(gblCalledFrom == "ACCINFO"){
		parent.SubMenu.location = "/MyAccount/MyAcctSubMenu.html?v=1659400467ta";
        parent.frames[2].location = "/MyAccount/MyAccountFrame.html?v=1659400467ta";
	}
}













