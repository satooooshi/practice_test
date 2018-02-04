var validatorWith = require('./validator'),
    nonPositiveValidationRule = require('./rules/nonPositive'),
    nonDivisibleValidationRule = require('./rules/nonDivisible');

//Dictionary
//ruleFactoryMap={elem1:one,elem2:two}
//ruleFactoryMap[elem1] returns one
//ruleFactoryMap[elem2] returns two
//Ex.
//when nonPositive, return nonPopsitiveValidationRule
//when nonDivisible, return nonDivisibleValidationRule(arg1,arg2)
var ruleFactoryMap = {
  nonPositive: function () {
    return nonPositiveValidationRule;
  },
  nonDivisible: function (options) {
    return nonDivisibleValidationRule(options.divisor, options.error);
  }
};

function toValidatorRule(ruleDescription) {
  //console.log(ruleDescription.options);
  return ruleFactoryMap[ruleDescription.type](ruleDescription.options);
}

/* configuration Ex.
configuration = sinon.stub();
configuration.returns([
  {type: 'nonPositive'},
  {type: 'nonDivisible', options: {divisor: 3, error: 'error.three'}},
  {type: 'nonDivisible', options: {divisor: 5, error: 'error.five'}}
]);
factoryWithConfiguration = require('../lib/factory');
var newValidator = factoryWithConfiguration(configuration);
validator = newValidator('default');
*/

//Create validator object here
//1つの引数を必要とする関数を使用するときに,
//引数は元の配列を通した map ループとして、配列の各要素に自動的に割り当てられます。
//この場合はruleDescriptionが引数扱い
//Ex.
//findConfiguratin(ruleSetName)
//
module.exports = function (findConfiguration) {
  //console.log(findConfiguration);
  return function (ruleSetName) {
    //console.log(ruleSetName);//output would be default or alternative
    return validatorWith(findConfiguration(ruleSetName).map(toValidatorRule));
  };
};
