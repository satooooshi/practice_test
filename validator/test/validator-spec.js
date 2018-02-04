var chai=require('chai');
var expect=chai.expect;


/*
function validator(n) {
	var result=[];

	if(n>0){
		if(n%3===0){
			result.push('error.three');
		}
		if(n%5===0){
			result.push('error.five');
		}
	}else{
		result.push('error.nonpositive');
	}
	return result;
}
*/

//Ex.
//nonDivisibleBy3ValidationRule = function(3,'error.three'){
//    if(n%3===0)
//       result.push('error.three');
//}
// # nonDivisibleBy3ValidateionRule(n,result)
function nonPositiveValidationRule(n, result) {
     if (n <= 0)
       result.push('error.nonpositive');
}
function makeNonDivisibleValidationRule(divisor, error) {
     return function(n, result) {
       if (n % divisor === 0)
         result.push(error);
       };
}
var validationRules = [
     nonPositiveValidationRule,
     makeNonDivisibleValidationRule(3, 'error.three'),
     makeNonDivisibleValidationRule(5, 'error.five')
   ];
//
//arrayObj.reduce(function(previousValue, currentValue, index, array){}
//
//Ex.validator=validatorWith(['makeNonDivisibleValidationRule(3,'error.three')']);
//
//  validator=function(n, result){
//    if(n % 3===0){
//      result.push('error.three');
//    };
//  }
//
//validator(3[,result]);
//
//
//reduce(which has second value)は配列内の要素を一つずつrule(currentValue)にしまって、
//return値をresult(previousValue)にしまう
//
function validatorWith(validationRules) {
  return function (n) {
    return validationRules.reduce(function (result, rule) {
      rule(n, result);//makeNonDivisibleValidationRule(3,'error.three')
      return result;
    }, []/*Watch out has second value*/);
  };
}
/*
function expectedToIncludeErrorWhenInvalid(number, error) {
     it('like ' + number, function () {
       expect(validator(number)).to.include(error);
	});
}
*/

//define features and actions,
describe('A Validation', function() {


  var validator;

   before(function() {
     validator=validatorWith(validationRules);
   });
   beforeEach(function() {
   });
   //define scenarios
  context('using the default validation rules:', function () {
        // for assertions or tests
         it('will return no errors for valid numbers', function () {
           		expect(validator(7)).to.be.empty;
         	});
   });
	context('for not strictly positive numbers:', function () {
    it('like 0, will include error.nonpositive', function () {
          expect(validator(0)).to.include('error.nonpositive');
    });
    it('like -2, will include error.nonpositive', function () {
          expect(validator(-2)).to.include('error.nonpositive');
    });
	});
	context('for numbers divisible by 3:', function () {
      it('like 3, will include error.three', function () {
                expect(validator(3)).to.include('error.three');
      });
      it('like 15, will include error.three', function () {
                expect(validator(15)).to.include('error.three');
      });
	});
	context('for numbers divisible by 5:', function () {
      it('like 5, will include error.five', function () {
          expect(validator(5)).to.include('error.five');
      });
      it('like 15, will include error.five', function () {
          expect(validator(15)).to.include('error.five');
      });
  });

});
