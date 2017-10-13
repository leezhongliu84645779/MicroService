createUserContract = {
	"username": "",
	"encryptedPassword": "",
	"email": "",
	"name" : "",
};

createUserMandatoryFields = ["username", "encryptedPassword", "email", "name"];

createUserBlankAllowed = true;


module.exports.allObjects = {
  "createUserContract" : createUserContract,
  "createUserMandatoryFields" : createUserMandatoryFields,
  "createUserBlankAllowed" : createUserBlankAllowed
}
