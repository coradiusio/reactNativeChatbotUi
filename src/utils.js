const numbersComparisionOperators = [
  '==',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
];

const stringsComparisionOperators = [
  '==',
  '!=',
];

function isEmptySrting(value) {
  if (typeof value === 'string') {
    return value === '';
  }
  return undefined;
}

export const stringCases = [
  'lower',
  'lowercase',
  'upper',
  'uppercase',
  'title',
  'titlecase'
];

export function stringCasing(value, casing) {
  switch(casing) {
    case 'lower':
    case 'lowercase':
      return value.toLowerCase();
    case 'upper':
    case 'uppercase':
      return value.toUpperCase();
    case 'title':
    case 'titlecase':
      return toTitleCase(value);
  }
  return value;
}

export function isElementByIdValueEmpty(id) {
  return isEmptySrting(document.getElementById(id) && document.getElementById(id).value);
}

function numberComparisionValidator(comparision, firstValue, secondValue) {
  switch (comparision) {
    case '==':
      return (firstValue === secondValue);
    case '!=':
      return (firstValue !== secondValue);
    case '>':
      return (firstValue > secondValue);
    case '>=':
      return (firstValue >= secondValue);
    case '<':
      return (firstValue < secondValue);
    case '<=':
      return (firstValue <= secondValue);
  }
  return false;
}

function stringComparisionValidator(comparision, firstValue, secondValue) {
  switch (comparision) {
    case '==':
      return (firstValue === secondValue);
    case '!=':
      return (firstValue !== secondValue);
  }
  return false;
}

export function validateInput(currentQuestion, answerInputModified, source = 'text', resultData) {
  const validateInput = currentQuestion.validateInput;
  const widget = currentQuestion.widget;
  function validateByComparisionOperator(typeLowerCase, propertyNameLowerCase, comparisionOperator, answerInputModified, propertyValue, result) {
    const answerInputModifiedLength = answerInputModified.length;
    if (typeLowerCase === 'number') {
      if (numbersComparisionOperators.indexOf(comparisionOperator) > -1) {
        if (propertyNameLowerCase === 'inputlength') {
          if (!numberComparisionValidator(comparisionOperator, answerInputModifiedLength, typeof propertyValue === 'string' ? massageText(propertyValue, resultData) : propertyValue)) {
            result.foundError = true;
          }
        } else if (propertyNameLowerCase === 'inputvalue') {
          if (!numberComparisionValidator(comparisionOperator, answerInputModified, typeof propertyValue === 'string' ? massageText(propertyValue, resultData) : propertyValue)) {
            result.foundError = true;
          }
        }
      }
    } else if (typeLowerCase === 'string') {
      if (stringsComparisionOperators.indexOf(comparisionOperator) > -1) {
        if (!stringComparisionValidator(comparisionOperator, answerInputModified, typeof propertyValue === 'string' ? massageText(propertyValue, resultData) : propertyValue)) {
          result.foundError = true;
        }
      }
    }
    return result;
  }

  function validateByRegexPattern(regexPattern, propertyNameLowerCase, answerInputModified, result) {
    const answerInputModifiedLength = answerInputModified.length;
    if (propertyNameLowerCase === 'inputlength') {
      if (!regexPattern.test(answerInputModifiedLength)) {
        result.foundError = true;
      }
    } else if (propertyNameLowerCase === 'inputvalue') {
      if (!regexPattern.test(answerInputModified)) {
        result.foundError = true;
      }
    }
    return result;
  }

  function validator(allValidations, i, outerRegexPattern) {
    const typeLowerCase = allValidations[i].type && allValidations[i].type.trim().toLowerCase();
    const comparisionOperator = allValidations[i].comparisionOperator && allValidations[i].comparisionOperator.trim();
    const regexPattern = allValidations[i].regexPattern && new RegExp(allValidations[i].regexPattern.trim(), 'i');
    const propertyNameLowerCase = allValidations[i].propertyName && allValidations[i].propertyName.toLowerCase();

    if (regexPattern) {
      validateByRegexPattern(regexPattern, propertyNameLowerCase, answerInputModified, result);
    }
    if (comparisionOperator) {
      validateByComparisionOperator(typeLowerCase, propertyNameLowerCase, comparisionOperator, answerInputModified, allValidations[i].propertyValue, result);
    }
  }

  const result = {
    success: false,
    foundError: false,
    errorMessage: '',
  };
  if (widget === 'text' || widget === 'calendar' || widget === 'qrscanner') {
    if (answerInputModified !== '' && validateInput) {
      const outputType = validateInput.outputType;
      if (outputType === 'object') {
        if (validateInput.splitBy) {
          answerInputModified = answerInputModified.split(validateInput.splitBy);
        } else {
          answerInputModified = new Array(answerInputModified);
        }
      }
      const allValidations = validateInput.validations;
      const outerRegexPattern = validateInput.regexPattern;

      if (allValidations instanceof Array) {
        for (let i = 0; i < allValidations.length; i++) {
          validator(allValidations, i, outerRegexPattern);
          if (result.foundError) {
            result.success = false;
            if (result.errorMessage === '') {
              result.errorMessage = allValidations[i].errorMessage || 'Input is invalid';
            }
            break;
          } else {
            result.success = true;
          }
        }
      }
    }
    if (!result.foundError) {
      result.success = true;
    }
  } else if (widget === 'radio' || widget === 'checkbox') {
    if (answerInputModified !== '' && source == 'text') {
      result.foundError = true;
      result.success = false;
      result.errorMessage = currentQuestion.onInputFillMessage || 'Please select from below buttons';
    } else {
      result.success = true;
    }
  } else if (widget === 'select' || widget === 'searchselect' || widget === 'file') {
    result.success = true;
  }
  result.answerInputModified = answerInputModified;  
  return result;
}

export function validateFile (currentQuestion, answerInputModified, fileName, fileExtension) {
  const result = {
    success: false,
    foundError: false,
    errorMessage: '',
  };

  if ( fileName && fileExtension) {
    if (answerInputModified.indexOf('base64') > -1) {
      if (currentQuestion.fileExtensions && currentQuestion.fileExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
        result.success = true;
      } else {
        result.foundError = true;
        result.errorMessage = currentQuestion.onWrongFileUploadMessage || 'Please upload valid file type';
      }
    }
  }
  result.answerInputModified = answerInputModified; 
  return result;
}

export const setValue = (propertyPath, value, obj) => {

  // this is a super simple parsing, you will want to make this more complex to handle correctly any path
  // it will split by the dots at first and then simply pass along the array (on next iterations)
  let properties = Array.isArray(propertyPath) ? propertyPath : propertyPath.trim().split(".")

  // Not yet at the last property so keep digging
  if (properties.length > 1) {
    // The property doesn't exists OR is not an object (and so we overwritte it) so we create it
    if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== "object") obj[properties[0]] = {}
      // We iterate.
    return setValue(properties.slice(1), value, obj[properties[0]])
      // This is the last property - the one where to set the value
  } else {
    // We set the value to the last property
    obj[properties[0]] = value
    return true // this is the end
  }

}

export const getValue = (propertyPath, obj) => {
  let newValue = {...obj}
  let i;
  propertyPath = propertyPath.trim().split('.');
  for (i = 0; i < propertyPath.length; i++) {
    newValue = newValue[propertyPath[i]];
  }

  return newValue;
};

export function massageText(text, state) {
  try {
    const regexPattern = /\{{(.*?)\}}/g;
    const matched = text.match(regexPattern);
    let parts, temp, replaceableText;

    if (matched) {
      for (let i = 0; i < matched.length; i++) {
        parts = matched[i].slice(2, -2).split('.');
        replaceableText = '';

        if (parts) {
          temp = { ...state }
          for (let j = 0; j < parts.length; j++) {
            temp = temp[parts[j]];

            replaceableText = replaceableText + parts[j] + '.';
          }

          text = text.replace(new RegExp(`{{${replaceableText.slice(0,-1)}}}`, 'g'), temp);
        }
      }

      return text;
    }
  } catch(err) {
    console.error('Exception in massaging text :- ', err);
  }

  return text;
}

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function toTitleCase(str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
};

export function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function animateScroll(someElement, duration) {
  if (someElement) {
    var start = someElement.scrollTop;
    var end = someElement.scrollHeight;
    var change = end - start;
    var increment = 20;
    animate(0);
  }
  function easeInOut(currentTime, start, change, duration) {
    // by Robert Penner
    currentTime /= duration / 2;
    if (currentTime < 1) {
      return change / 2 * currentTime * currentTime + start;
    }
    currentTime -= 1;
    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
  }
  function animate(elapsedTime) {
    elapsedTime += increment;
    var position = easeInOut(elapsedTime, start, change, duration);
    someElement.scrollTop = position;
    if (elapsedTime < duration) {
      setTimeout(function() {
        animate(elapsedTime);
      }, increment)
    }
  }
}

// === RESIZE ====

export function resizeImage(img, extension, max_width, max_height, quality) {
  
  var canvas = document.createElement('canvas');

  var width = img.width;
  var height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > max_width) {
      //height *= max_width / width;
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      //width *= max_height / height;
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  
  // resize the canvas and draw the image data into it
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  
  //preview.appendChild(canvas); // do the actual resized preview
  
  return canvas.toDataURL('image/'.concat(extension), quality); // get the data from canvas as 60% JPG (can be also PNG, etc.)

}