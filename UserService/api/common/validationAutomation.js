const contractParams = {
  expectedContract : "Contract",
  mandatoryFields : "MandatoryFields",
  blankAllowed : "BlankAllowed"
}

const automatedParamsGenerator = function(action, model, payload) {
  const imports = require('../contract/' + model + '.contract.js').allObjects;
  return {
    expectedContract : imports[action + model + contractParams.expectedContract],
    mandatoryFields : imports[action + model + contractParams.mandatoryFields],
    blankAllowed : imports[action + model + contractParams.blankAllowed],
    incomingContract : payload,
  }
}

const modelActionSeperator = function(functionName) {
  var boundary = 0
  for(var x = 0; x < functionName.length; x++) {
    if (functionName[x].toUpperCase() === functionName[x]) {
      break;
    } else {
      boundary += 1;
    }
  }
  return {
    action: functionName.substring(0, boundary),
    model: functionName.substring(boundary, functionName.length)
  }
}

module.exports.automatedContractValidator = function(validator, payload, name) {
  const seperationResult = modelActionSeperator(name);
  const model = seperationResult.model;
  const action = seperationResult.action;
  const automatedParams = automatedParamsGenerator(action.toLowerCase(), model[0].toUpperCase() + model.slice(1), payload);
  return validator.validator(automatedParams.incomingContract, automatedParams.expectedContract,
  automatedParams.mandatoryFields, automatedParams.incomingContract);
}
